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
      this.senderEmail = process.env.MAIL_FROM_EMAIL || 'faidifakhri9@gmail.com';
      this.senderName = process.env.MAIL_FROM_NAME || 'PeakPlay';
      console.warn('⚠️ [MAIL_SERVICE] Mode développement: service d\'email désactivé');
      return;
    }

    // Charger MAIL_FROM_EMAIL et MAIL_FROM_NAME depuis .env
    // IMPORTANT: Utilisez un sender validé dans Brevo (Settings > Senders & IP)
    this.senderEmail = process.env.MAIL_FROM_EMAIL || 'faidifakhri9@gmail.com';
    this.senderName = process.env.MAIL_FROM_NAME || 'PeakPlay';

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
      subject: 'Vérification de votre email - PeakPlay',
      htmlContent: `
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial; background:#f9fafb; padding:20px; margin:0;">
            <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color:#111827; text-align:center; margin-top:0;">Bienvenue sur PeakPlay ⚽</h2>
              <p style="font-size:16px; color:#374151; line-height:1.6;">Merci de vous être inscrit. Cliquez sur le bouton ci-dessous pour vérifier votre email :</p>
              <div style="text-align:center; margin:30px 0;">
                <a href="${url}" style="display:inline-block; background:#3b82f6; color:white; padding:14px 24px; border-radius:8px; text-decoration:none; font-weight:bold; text-align:center; font-size:16px; transition:background-color 0.2s;">Vérifier mon email</a>
              </div>
              <p style="margin-top:30px; font-size:14px; color:#6b7280; line-height:1.6;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                <span style="word-break: break-all; color:#3b82f6;">${url}</span>
              </p>
              <p style="margin-top:20px; font-size:12px; color:#9ca3af; text-align:center;">
                ⚠️ Ce lien expirera dans 24 heures.
              </p>
              <p style="margin-top:20px; font-size:14px; color:#6b7280; text-align:center;">
                Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
              </p>
            </div>
          </body>
        </html>
      `,
      textContent: `Bienvenue sur PeakPlay ⚽\n\nMerci de vous être inscrit. Cliquez sur le lien ci-dessous pour vérifier votre email :\n\n${url}\n\n⚠️ Ce lien expirera dans 24 heures.\n\nSi vous n'avez pas créé de compte, vous pouvez ignorer cet email.`,
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
      subject: '🔐 Notification de connexion - PeakPlay',
      htmlContent: `
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial; background:#f9fafb; padding:20px; margin:0;">
            <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color:#111827; text-align:center; margin-top:0;">🔐 Nouvelle connexion détectée</h2>
              <p style="font-size:16px; color:#374151; line-height:1.6;">Bonjour,</p>
              <p style="font-size:16px; color:#374151; line-height:1.6;">Une connexion à votre compte PeakPlay ⚽ a été effectuée avec succès.</p>
              <div style="background:#f5f5f5; padding:20px; border-radius:8px; margin:30px 0;">
                <p style="font-size:14px; color:#374151; margin:10px 0;"><strong>Date et heure :</strong> ${formattedDate}</p>
                ${loginInfo?.ip ? `<p style="font-size:14px; color:#374151; margin:10px 0;"><strong>Adresse IP :</strong> ${loginInfo.ip}</p>` : ''}
              </div>
              <p style="font-size:14px; color:#dc2626; line-height:1.6; background:#fef2f2; padding:15px; border-radius:8px; border-left:4px solid #dc2626;">
                <strong>⚠️ Si vous n'êtes pas à l'origine de cette connexion, veuillez changer votre mot de passe immédiatement.</strong>
              </p>
              <p style="margin-top:30px; font-size:14px; color:#6b7280; line-height:1.6;">
                Cordialement,<br>
                <strong>L'équipe PeakPlay</strong>
              </p>
              <p style="margin-top:20px; font-size:12px; color:#9ca3af; text-align:center;">
                Ceci est un email automatique, merci de ne pas y répondre.
              </p>
            </div>
          </body>
        </html>
      `,
      textContent: `🔐 Nouvelle connexion détectée\n\nBonjour,\n\nUne connexion à votre compte PeakPlay ⚽ a été effectuée avec succès.\n\nDate et heure : ${formattedDate}${loginInfo?.ip ? `\nAdresse IP : ${loginInfo.ip}` : ''}\n\n⚠️ Si vous n'êtes pas à l'origine de cette connexion, veuillez changer votre mot de passe immédiatement.\n\nCordialement,\nL'équipe PeakPlay\n\nCeci est un email automatique, merci de ne pas y répondre.`,
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
