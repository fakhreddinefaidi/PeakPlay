import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/schemas/user.schemas';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  /**
   * Trouve un utilisateur par email (méthode utilitaire)
   */
  async findUserByEmail(email: string): Promise<any> {
    return this.userModel.findOne({ email });
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      console.log(`[VALIDATE_USER] Recherche de l'utilisateur: ${email}`);
      const user = await this.userModel.findOne({ email });
      
      // Si l'utilisateur n'existe pas
      if (!user) {
        console.log(`[VALIDATE_USER] Utilisateur non trouvé: ${email}`);
        return null;
      }
      
      // Si l'utilisateur n'a pas de mot de passe (créé via OAuth), il ne peut pas se connecter avec email/password
      if (!user.password) {
        console.log(`[VALIDATE_USER] Utilisateur sans mot de passe (OAuth): ${email}`);
        return null;
      }
      
      // Vérifier que l'email est vérifié (sécurité)
      // Note: Les utilisateurs OAuth ont déjà emailVerified = true automatiquement
      if (!user.emailVerified) {
        console.log(`[VALIDATE_USER] Email non vérifié: ${email}`);
        return null;
      }
      
      // Vérifier le mot de passe
      console.log(`[VALIDATE_USER] Vérification du mot de passe pour: ${email}`);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log(`[VALIDATE_USER] Mot de passe invalide pour: ${email}`);
        return null;
      }
      
      console.log(`[VALIDATE_USER] Utilisateur validé avec succès: ${email}`);
      const { password: _, ...result } = user.toObject();
      return result;
    } catch (error) {
      console.error(`[VALIDATE_USER] Erreur lors de la validation pour ${email}:`, error);
      return null;
    }
  }

  async login(user: any) {
    try {
      const payload = {
        email: user.email,
        sub: user._id,
        role: user.role,
      };
      const token = this.jwtService.sign(payload);
      console.log(`[LOGIN] Token JWT généré pour: ${user.email}`);
      return {
        access_token: token,
      };
    } catch (error) {
      console.error(`[LOGIN] Erreur lors de la génération du token JWT pour ${user?.email || 'unknown'}:`, error);
      throw error;
    }
  }

  async register(createUserDto: any) {
    try {
      console.log('📝 Tentative d\'enregistrement pour:', createUserDto.email);
      
      const existingUser = await this.userModel.findOne({ email: createUserDto.email });
      if (existingUser) {
        throw new ConflictException('Un utilisateur avec cet email existe déjà.');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const verificationToken = this.generateVerificationToken(createUserDto.email);
      
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        emailVerified: false,
        verificationToken,
        verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 heures
      });

      console.log('💾 Tentative de sauvegarde de l\'utilisateur...');
      const savedUser = await newUser.save();
      console.log('✅ Utilisateur sauvegardé avec succès, ID:', savedUser._id);
      
      // Envoyer l'email de vérification uniquement si ce n'est pas un utilisateur OAuth
      // (Facebook et Google garantissent déjà la vérification de l'email)
      if (savedUser.provider !== 'facebook' && savedUser.provider !== 'google') {
        try {
          console.log('📧 Tentative d\'envoi d\'email de vérification pour:', createUserDto.email);
          await this.mailService.sendVerificationEmail(
            createUserDto.email,
            verificationToken,
          );
          console.log('✅ Email de vérification envoyé avec succès');
        } catch (emailError) {
          console.error('❌ Erreur lors de l\'envoi de l\'email (non bloquant):', emailError.message);
          console.error('❌ Code d\'erreur:', emailError.code);
          console.error('❌ Response code:', emailError.responseCode);
          console.error('❌ Stack trace:', emailError.stack);
          console.error('⚠️ L\'utilisateur a été créé mais l\'email de vérification n\'a pas pu être envoyé');
          console.error('⚠️ Vous pouvez renvoyer l\'email via POST /api/v1/auth/resend-verification');
          // Ne pas bloquer l'enregistrement si l'email échoue
        }
      } else {
        console.log('ℹ️ Utilisateur OAuth détecté - pas d\'email de vérification nécessaire');
      }
      
      const { password, ...result } = savedUser.toObject();
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement:', error);
      // Si c'est déjà une exception HTTP, la relancer
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      // Sinon, envelopper dans une BadRequestException
      throw new BadRequestException(`Erreur lors de l'enregistrement: ${error.message}`);
    }
  }

  async linkProvider(userId: string, provider: string, providerId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) return null;
    user.provider = provider;
    user.providerId = providerId;
    await user.save();
    const { password, ...result } = user.toObject();
    return result;
  }

  /**
   * Génère un token JWT de vérification d'email
   */
  private generateVerificationToken(email: string): string {
    return this.jwtService.sign(
      { email, type: 'email-verification' },
      { expiresIn: '24h' },
    );
  }

  /**
   * Trouve ou crée un utilisateur via OAuth (Google / Facebook)
   */
  async findOrCreateOAuthUser(profile: {
    provider?: string;
    providerId?: string;
    email?: string;
    givenName?: string;
    familyName?: string;
    displayName?: string;
    picture?: string;
  }): Promise<any> {
    const { provider, providerId } = profile;
    let email = profile.email;

    // ✅ fallback si Facebook ne renvoie pas d'email
    if (!email) {
      email = `${providerId}@${provider}.local`;
    }

    // 🔹 Recherche d'abord par provider et providerId
    let user = await this.userModel.findOne({
      provider: provider,
      providerId: providerId,
    });

    // Si l'utilisateur existe déjà avec ce provider
    if (user) {
      // Google/Facebook garantissent déjà la vérification de l'email
      // On marque donc l'email comme vérifié automatiquement
      if (!user.emailVerified) {
        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
      }
      
      const { password, ...result } = user.toObject();
      return result;
    }

    // 🔹 Si l'utilisateur n'existe pas, chercher par email (pour lier un compte existant)
    user = await this.userModel.findOne({ email });

    if (user) {
      // Si l'utilisateur existe mais n'a pas de provider, on le lie
      if (!user.provider || !user.providerId) {
        user.provider = provider;
        user.providerId = providerId;
        await user.save();
      }
      
      // Google/Facebook garantissent déjà la vérification de l'email
      // On marque donc l'email comme vérifié automatiquement
      if (!user.emailVerified) {
        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
      }
      
      const { password, ...result } = user.toObject();
      return result;
    }

    // 🔹 Créer un nouvel utilisateur
    const prenom = profile.givenName || profile.displayName || '';
    const nom = profile.familyName || '';
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Google et Facebook garantissent déjà la vérification de l'email
    // On marque donc l'email comme vérifié automatiquement
    const newUser = new this.userModel({
      prenom,
      nom,
      email,
      password: hashedPassword,
      picture: profile.picture || '',
      provider,
      providerId,
      role: 'JOUEUR',
      age: new Date('1970-01-01'),
      tel: 0,
      // Google/Facebook garantissent déjà la vérification de l'email
      emailVerified: true,
      verificationToken: undefined,
      verificationTokenExpires: undefined,
    });

    const savedUser = await newUser.save();
    console.log('✅ Nouvel utilisateur OAuth créé:', savedUser.email, 'Provider:', provider, '- Email automatiquement vérifié');
    
    // Pas besoin d'envoyer d'email pour OAuth - Google/Facebook garantissent déjà la vérification
    
    const { password, ...result } = savedUser.toObject();
    return result;
  }

  /**
   * Vérifie le token JWT de vérification d'email
   */
  verifyEmailToken(token: string) {
    return this.jwtService.verify(token);
  }

  /**
   * Marque l'email comme vérifié
   */
  async markEmailAsVerified(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return user;
  }

  /**
   * Vérifie l'email avec le token (ancienne méthode - gardée pour compatibilité)
   */
  async verifyEmail(token: string): Promise<{ message: string; verified: boolean }> {
    const user = await this.userModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }, // Token non expiré
    });

    if (!user) {
      throw new NotFoundException('Token de vérification invalide ou expiré');
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return {
      message: 'Email vérifié avec succès !',
      verified: true,
    };
  }

  /**
   * Renvoie un email de vérification (uniquement pour les utilisateurs créés via register)
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Cet email est déjà vérifié');
    }

    // Seuls les utilisateurs créés via register (sans provider) peuvent renvoyer l'email
    if (user.provider) {
      throw new BadRequestException('Les utilisateurs OAuth (Google/Facebook) n\'ont pas besoin de vérification d\'email');
    }

    const verificationToken = this.generateVerificationToken(user.email);
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await this.mailService.sendVerificationEmail(
      user.email,
      verificationToken,
    );

    return {
      message: 'Email de vérification renvoyé avec succès',
    };
  }

  /**
   * Envoie un email de notification de connexion
   */
  async sendLoginNotificationEmail(email: string, loginInfo?: { date?: Date; ip?: string }) {
    return this.mailService.sendLoginNotificationEmail(email, loginInfo);
  }
}
