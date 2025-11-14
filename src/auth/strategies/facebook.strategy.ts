import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const appID = configService.get<string>('FACEBOOK_APP_ID') || '';
    const appSecret = configService.get<string>('FACEBOOK_APP_SECRET') || '';
    // Utiliser FACEBOOK_CALLBACK_URL si défini, sinon construire depuis BACKEND_URL
    const backendUrl = configService.get<string>('BACKEND_URL') || 'http://localhost:3001';
    const cleanBackendUrl = backendUrl.replace(/\/$/, ''); // Nettoyer le slash final
    const defaultCallbackURL = `${cleanBackendUrl}/api/v1/auth/facebook/redirect`;
    const callbackURL =
      configService.get<string>('FACEBOOK_CALLBACK_URL') ||
      defaultCallbackURL;

    super({
      clientID: appID,
      clientSecret: appSecret,
      callbackURL,
      profileFields: [
        'id',
        'emails',
        'name',
        'displayName',
        'picture.type(large)',
      ],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ): Promise<any> {
    try {
      if (!profile) {
        return done(
          new UnauthorizedException('Profil Facebook introuvable'),
          null,
        );
      }

      // ✅ Certains comptes n’ont PAS d’adresse email publique
      const email =
        profile.emails?.[0]?.value || `${profile.id}@facebook.local`;

      const givenName = profile.name?.givenName || '';
      const familyName = profile.name?.familyName || '';
      const displayName = profile.displayName || `${givenName} ${familyName}`;
      const picture = profile.photos?.[0]?.value;

      // ✅ Crée ou retrouve un utilisateur via AuthService
      const user = await this.authService.findOrCreateOAuthUser({
        provider: 'facebook',
        providerId: profile.id,
        email,
        givenName,
        familyName,
        displayName,
        picture,
      });

      if (!user) {
        return done(
          new UnauthorizedException('Impossible de créer ou trouver l\'utilisateur'),
          null,
        );
      }

      // ✅ findOrCreateOAuthUser a déjà :
      // - Défini user.provider = 'facebook'
      // - Défini user.emailVerified = true
      // - Pas d'email de vérification envoyé (Facebook garantit l'identité)
      
      // ✅ Tout est bon → authentification réussie
      return done(null, user);
    } catch (err) {
      console.error('❌ Erreur FacebookStrategy:', err);
      return done(
        new UnauthorizedException('Erreur pendant la validation Facebook'),
        null,
      );
    }
  }
}
