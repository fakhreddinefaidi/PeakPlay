import { Injectable } from '@nestjs/common';
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private apiInstance: TransactionalEmailsApi | null;
  private senderEmail: string;
  private senderName: string;

  constructor() {
    console.log('📧 [MAIL_SERVICE] Initialisation du service d\'envoi d\'email via Brevo API...');
    
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey) {
      console.error('❌ [MAIL_SERVICE] BREVO_API_KEY n\'est pas défini dans les variables d\'environnement');
      console.error('⚠️ [MAIL_SERVICE] Les emails ne pourront pas être envoyés sans BREVO_API_KEY');
      console.error('⚠️ [MAIL_SERVICE] Pour obtenir votre clé: https://app.brevo.com → Settings > SMTP & API > API Keys');
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error('BREVO_API_KEY is required in production');
      }
      
      // En développement, créer une instance vide (les emails échoueront mais l'app démarre)
      this.apiInstance = null;
      this.senderEmail = '9b8f34001@smtp-brevo.com';
      this.senderName = 'DAM Backend';
      console.warn('⚠️ [MAIL_SERVICE] Mode développement: service d\'email désactivé');
      return;
    }

    // Parser MAIL_FROM depuis .env
    // Format attendu: "DAM Backend <9b8f34001@smtp-brevo.com>"
    const mailFromEnv = process.env.MAIL_FROM || 'DAM Backend <9b8f34001@smtp-brevo.com>';
    
    // Extraire l'email et le nom du format "Name <email@domain.com>"
    const mailFromMatch = mailFromEnv.match(/^(.+?)\s*<(.+?)>$/);
    if (mailFromMatch) {
      this.senderName = mailFromMatch[1].trim();
      this.senderEmail = mailFromMatch[2].trim();
    } else {
      console.warn('⚠️ [MAIL_SERVICE] Format MAIL_FROM invalide, utilisation du format par défaut');
      this.senderName = 'DAM Backend';
      this.senderEmail = '9b8f34001@smtp-brevo.com';
    }

    // Initialiser l'API Brevo
    this.apiInstance = new TransactionalEmailsApi();
    this.apiInstance.setApiKey(0, apiKey);
    
    console.log('✅ [MAIL_SERVICE] Configuration Brevo API chargée avec succès');
    console.log(`✅ [MAIL_SERVICE] Sender configuré: ${this.senderName} <${this.senderEmail}>`);
    console.log(`✅ [MAIL_SERVICE] API Brevo: https://api.brevo.com/v3/smtp/email`);
  }


  /**
   * Envoie un email de vérification via l'API Brevo
   * @param to - Email du destinataire
   * @param url - URL de vérification complète
   */
  async sendVerificationEmail(to: string, url: string): Promise<void> {
    if (!this.apiInstance) {
      console.error('❌ [SEND_VERIFICATION] BREVO_API_KEY non configuré - impossible d\'envoyer l\'email');
      throw new Error('BREVO_API_KEY is not configured');
    }

    console.log('📧 [SEND_VERIFICATION] Tentative d\'envoi d\'email de vérification');
    console.log(`   → Destinataire: ${to}`);
    console.log(`   → Sender: ${this.senderName} <${this.senderEmail}>`);
    console.log(`   → URL de vérification: ${url}`);

    const sendSmtpEmail: SendSmtpEmail = {
      sender: {
        email: this.senderEmail,
        name: this.senderName,
      },
      to: [{ email: to }],
      subject: 'Vérification de votre email - DAM Backend',
      htmlContent: `
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
              <h1>Bienvenue sur DAM Backend !</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Merci de vous être inscrit. Pour finaliser votre inscription et activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
              <div style="text-align: center;">
                <a href="${url}" class="button" style="color: white;">Vérifier mon email</a>
              </div>
              <p>Ou copiez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #4CAF50; background: #f0f0f0; padding: 10px; border-radius: 3px;">${url}</p>
              <p><strong>⚠️ Ce lien expirera dans 24 heures.</strong></p>
              <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
              <p>Cordialement,<br>L'équipe DAM Backend</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      console.log('📤 [SEND_VERIFICATION] Envoi de l\'email via Brevo API...');
      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ [SEND_VERIFICATION] Email envoyé avec succès via Brevo API');
      console.log(`   → Message ID: ${response.body?.messageId || 'N/A'}`);
      console.log(`   → Destinataire: ${to}`);
      return;
    } catch (error) {
      console.error('❌ [SEND_VERIFICATION] Erreur lors de l\'envoi de l\'email via Brevo API');
      console.error(`   → Destinataire: ${to}`);
      console.error(`   → Sender: ${this.senderName} <${this.senderEmail}>`);
      console.error(`   → Erreur: ${error.message || 'Unknown error'}`);
      if (error.response?.body) {
        console.error(`   → Détails Brevo API:`, JSON.stringify(error.response.body, null, 2));
      }
      if (error.status) {
        console.error(`   → Status HTTP: ${error.status}`);
      }
      if (error.response?.statusCode) {
        console.error(`   → Status Code: ${error.response.statusCode}`);
      }
      throw error;
    }
  }

  /**
   * Envoie un email de notification de connexion
   * @param to - Email du destinataire
   * @param loginInfo - Informations de connexion (date, IP)
   */
  async sendLoginNotificationEmail(to: string, loginInfo?: { date?: Date; ip?: string }): Promise<void> {
    if (!this.apiInstance) {
      console.error('❌ [SEND_LOGIN_NOTIFICATION] BREVO_API_KEY non configuré - impossible d\'envoyer l\'email de notification');
      return; // Ne pas bloquer le login
    }

    const loginDate = loginInfo?.date || new Date();
    const formattedDate = loginDate.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    console.log('📧 [SEND_LOGIN_NOTIFICATION] Tentative d\'envoi d\'email de notification de connexion');
    console.log(`   → Destinataire: ${to}`);
    console.log(`   → Date: ${formattedDate}`);
    console.log(`   → Sender: ${this.senderName} <${this.senderEmail}>`);

    const sendSmtpEmail: SendSmtpEmail = {
      sender: {
        email: this.senderEmail,
        name: this.senderName,
      },
      to: [{ email: to }],
      subject: '🔐 Notification de connexion - DAM Backend',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .info-box { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔐 Nouvelle connexion détectée</h2>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Une connexion à votre compte a été effectuée avec succès.</p>
              <div class="info-box">
                <p><strong>Date et heure :</strong> ${formattedDate}</p>
                ${loginInfo?.ip ? `<p><strong>Adresse IP :</strong> ${loginInfo.ip}</p>` : ''}
              </div>
              <p><strong>⚠️ Si vous n'êtes pas à l'origine de cette connexion, veuillez changer votre mot de passe immédiatement.</strong></p>
              <p>Cordialement,<br>L'équipe DAM Backend</p>
            </div>
            <div class="footer">
              <p>Ceci est un email automatique, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      console.log('📤 [SEND_LOGIN_NOTIFICATION] Envoi de l\'email via Brevo API...');
      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ [SEND_LOGIN_NOTIFICATION] Email de notification de connexion envoyé via Brevo API');
      console.log(`   → Message ID: ${response.body?.messageId || 'N/A'}`);
      console.log(`   → Destinataire: ${to}`);
    } catch (error) {
      // Ne pas bloquer le login si l'email échoue
      console.error('❌ [SEND_LOGIN_NOTIFICATION] Erreur lors de l\'envoi de l\'email de notification de connexion');
      console.error(`   → Destinataire: ${to}`);
      console.error(`   → Sender: ${this.senderName} <${this.senderEmail}>`);
      console.error(`   → Erreur: ${error.message || 'Unknown error'}`);
      if (error.response?.body) {
        console.error(`   → Détails Brevo API:`, JSON.stringify(error.response.body, null, 2));
      }
      if (error.status) {
        console.error(`   → Status HTTP: ${error.status}`);
      }
      if (error.response?.statusCode) {
        console.error(`   → Status Code: ${error.response.statusCode}`);
      }
    }
  }
}
