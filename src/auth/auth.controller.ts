import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { shouldUseSecureCookies } from '../utils/env.util';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // === Enregistrement ===
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un nouveau compte utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiResponse({ status: 409, description: 'Un utilisateur avec cet email existe déjà' })
  @ApiResponse({ status: 400, description: 'Erreur de validation ou lors de l\'enregistrement' })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.authService.register(createUserDto);
      return result;
    } catch (error) {
      console.error('❌ Erreur dans le contrôleur register:', error);
      throw error;
    }
  }

  // === Login ===
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Se connecter avec email et mot de passe' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect' })
  async login(@Body() loginDto: LoginDto, @Req() req, @Res() res) {
    try {
      console.log(`[LOGIN] Tentative de connexion pour: ${loginDto.email}`);
      
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
        console.log(`[LOGIN] Échec de validation pour: ${loginDto.email}`);
        console.log(`[LOGIN] Email ou mot de passe incorrect pour: ${loginDto.email}`);
        throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

      console.log(`[LOGIN] Utilisateur validé: ${user.email}`);

    const token = (await this.authService.login(user))?.access_token;

      if (!token) {
        console.error(`[LOGIN] Erreur lors de la génération du token pour: ${loginDto.email}`);
        throw new UnauthorizedException('Erreur lors de la génération du token');
      }

      console.log(`[LOGIN] Token généré avec succès pour: ${loginDto.email}`);

      // Envoyer un email de notification de connexion
      try {
        const clientIp = req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'] || 'Inconnue';
        await this.authService.sendLoginNotificationEmail(user.email, {
          date: new Date(),
          ip: clientIp,
        });
        console.log(`[LOGIN] Email de notification envoyé pour: ${loginDto.email}`);
      } catch (error) {
        // Ne pas bloquer le login si l'email échoue
        console.error(`[LOGIN] Erreur lors de l'envoi de l'email de notification pour ${loginDto.email}:`, error.message || error);
      }

      const isProd = shouldUseSecureCookies();
      const cookieOptions: any = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60, // 1 heure
      path: '/',
      };

      // En production avec HTTPS, ajouter domain si nécessaire
      if (isProd && process.env.COOKIE_DOMAIN) {
        cookieOptions.domain = process.env.COOKIE_DOMAIN;
      }

      res.cookie('access_token', token, cookieOptions);
      console.log(`[LOGIN] Cookie défini avec secure=${isProd}, sameSite=${cookieOptions.sameSite}`);

      return res.json({ success: true, access_token: token });
    } catch (error) {
      // Si c'est déjà une UnauthorizedException, la relancer
      if (error instanceof UnauthorizedException) {
        console.log(`[LOGIN] UnauthorizedException: ${error.message}`);
        throw error;
      }
      // Sinon, logger l'erreur et renvoyer une erreur générique
      console.error(`[LOGIN] Erreur inattendue lors du login pour ${loginDto?.email || 'unknown'}:`, error);
      throw new UnauthorizedException('Erreur lors de la connexion');
    }
  }

  // === Google OAuth ===
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // lance le flux OAuth Google
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    if (!req.user) throw new UnauthorizedException('Google authentication failed');

    const token = (await this.authService.login(req.user))?.access_token;
    
    // Envoyer un email de notification de connexion
    try {
      const clientIp = req.ip || req.connection?.remoteAddress || 'Inconnue';
      await this.authService.sendLoginNotificationEmail(req.user.email, {
        date: new Date(),
        ip: clientIp,
      });
    } catch (error) {
      // Ne pas bloquer le login si l'email échoue
      console.error('Erreur lors de l\'envoi de l\'email de notification:', error);
    }
    
    const frontend = process.env.FRONTEND_URL;
    const isProd = shouldUseSecureCookies();

    const cookieOptions: any = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60,
      path: '/',
    };

    if (isProd && process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    res.cookie('access_token', token, cookieOptions);

    // ✅ Mode test (pas de FRONTEND_URL)
    if (!frontend) {
      return res.status(200).json({
        message: '✅ Google authentication successful!',
        user: req.user,
        access_token: token,
      });
    }

    // ✅ Mode production
      return res.redirect(`${frontend.replace(/\/$/, '')}/auth/success`);
  }

  // === Facebook OAuth ===
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth() {
    // lance le flux OAuth Facebook
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(@Req() req, @Res() res) {
    if (!req.user) throw new UnauthorizedException('Facebook authentication failed');

    const token = (await this.authService.login(req.user))?.access_token;
    
    // Envoyer un email de notification de connexion
    try {
      const clientIp = req.ip || req.connection?.remoteAddress || 'Inconnue';
      await this.authService.sendLoginNotificationEmail(req.user.email, {
        date: new Date(),
        ip: clientIp,
      });
    } catch (error) {
      // Ne pas bloquer le login si l'email échoue
      console.error('Erreur lors de l\'envoi de l\'email de notification:', error);
    }
    
    const frontend = process.env.FRONTEND_URL;
    const isProd = shouldUseSecureCookies();

    const cookieOptions: any = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60,
      path: '/',
    };

    if (isProd && process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    res.cookie('access_token', token, cookieOptions);

    // ✅ Mode test — retourne JSON
    if (!frontend) {
      return res.status(200).json({
        message: '✅ Facebook authentication successful!',
        user: req.user,
        access_token: token,
      });
    }

    // ✅ Mode production — redirige vers le frontend
      return res.redirect(`${frontend.replace(/\/$/, '')}/auth/success`);
    }

  // === Vérification d'email ===
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res) {
    try {
      const payload = this.authService.verifyEmailToken(token);
      const user = await this.authService.markEmailAsVerified(payload.email);
      if (!user) throw new UnauthorizedException('Utilisateur introuvable');
      return res.json({ message: '✅ Adresse e-mail vérifiée avec succès.' });
    } catch (error) {
      return res.status(400).json({ message: '❌ Lien invalide ou expiré.' });
    }
  }

  // === Renvoyer l'email de vérification ===
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renvoyer l\'email de vérification' })
  @ApiResponse({ status: 200, description: 'Email de vérification renvoyé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @ApiResponse({ status: 400, description: 'Email déjà vérifié ou utilisateur non OAuth' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com',
        },
      },
    },
  })
  async resendVerificationEmail(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
  }
}
