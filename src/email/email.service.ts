/**
 * ⚠️ SERVICE OBSOLÈTE - NE PLUS UTILISER
 * 
 * Ce service utilise SMTP (nodemailer) et est remplacé par MailService
 * qui utilise l'API Brevo directement.
 * 
 * @deprecated Utilisez MailService à la place (src/mail/mail.service.ts)
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Configuration du transporteur email
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: parseInt(this.configService.get<string>('SMTP_PORT') || '587'),
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  /**
   * Envoie un email de vérification après authentification OAuth
   */
  async sendVerificationEmail(
    email: string,
    name: string,
    verificationToken: string,
    provider: 'google' | 'facebook',
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
    const appName = this.configService.get<string>('APP_NAME') || 'DAM Backend';

    const mailOptions = {
      from: `"${appName}" <${this.configService.get<string>('SMTP_USER')}>`,
      to: email,
      subject: `Vérification de votre compte - ${appName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bienvenue ${name} !</h1>
            </div>
            <div class="content">
              <p>Bonjour ${name},</p>
              <p>Merci de vous être inscrit avec ${provider === 'google' ? 'Google' : 'Facebook'}.</p>
              <p>Pour finaliser votre inscription et activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Vérifier mon email</a>
              </div>
              <p>Ou copiez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #4CAF50;">${verificationUrl}</p>
              <p><strong>Ce lien expirera dans 24 heures.</strong></p>
              <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
              <p>Cordialement,<br>L'équipe ${appName}</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Bonjour ${name},
        
        Merci de vous être inscrit avec ${provider === 'google' ? 'Google' : 'Facebook'}.
        
        Pour vérifier votre adresse email, cliquez sur ce lien :
        ${verificationUrl}
        
        Ce lien expirera dans 24 heures.
        
        Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
        
        Cordialement,
        L'équipe ${appName}
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de vérification envoyé à ${email}`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi de l'email à ${email}:`, error);
      // Ne pas faire échouer l'authentification si l'email échoue
    }
  }
}

