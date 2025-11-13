import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    const mailHost = process.env.MAIL_HOST;
    const mailPort = Number(process.env.MAIL_PORT);
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;

    console.log('📧 Configuration email:', {
      host: mailHost,
      port: mailPort,
      user: mailUser ? `${mailUser.substring(0, 3)}***` : 'NON DÉFINI',
      pass: mailPass ? '***' : 'NON DÉFINI',
    });

    if (!mailHost || !mailPort || !mailUser || !mailPass) {
      console.error('❌ Configuration email incomplète ! Vérifiez vos variables d\'environnement MAIL_*');
      throw new Error('Configuration email incomplète: MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS sont requis');
    }

    // Correction pour Brevo: utiliser smtp.brevo.com au lieu de smtp-relay.brevo.com
    const correctedHost = mailHost === 'smtp-relay.brevo.com' ? 'smtp.brevo.com' : mailHost;
    if (mailHost !== correctedHost) {
      console.warn('⚠️ Correction automatique: smtp-relay.brevo.com → smtp.brevo.com');
      console.warn('⚠️ Pour SMTP Relay Brevo, utilisez smtp.brevo.com avec votre clé SMTP');
    }

    this.transporter = nodemailer.createTransport({
      host: correctedHost,
      port: mailPort,
      secure: false, // true pour 465, false pour 587
      auth: {
        user: mailUser,
        pass: mailPass,
      },
      // Ajouter des options de debug pour voir les erreurs
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development',
    });

    // Vérifier la connexion au démarrage (optionnel mais utile pour debug)
    // On appelle verifyConnection de manière asynchrone sans bloquer le constructeur
    this.verifyConnection().catch((err) => {
      console.error('❌ Erreur lors de la vérification SMTP:', err.message);
    });
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Connexion SMTP vérifiée avec succès');
    } catch (error) {
      console.error('❌ Erreur de connexion SMTP:', error.message);
      console.error('❌ Vérifiez vos credentials Brevo/Sendinblue');
      console.error('❌ Pour Brevo, assurez-vous d\'utiliser smtp.brevo.com avec votre clé SMTP');
      // Ne pas bloquer le démarrage, mais avertir
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    try {
      console.log('📧 Tentative d\'envoi d\'email de vérification à:', to);
      
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
      const verifyUrl = `${backendUrl}/api/v1/auth/verify-email?token=${token}`;
      const mailFrom = process.env.MAIL_FROM || `"DAM Backend" <${process.env.MAIL_USER}>`;
      
      const mailOptions = {
        from: mailFrom,
        to,
        subject: 'Vérifie ton adresse e-mail',
        html: `
          <h2>Bienvenue 👋</h2>
          <p>Merci de t'être inscrit ! Clique sur le lien ci-dessous pour vérifier ton e-mail :</p>
          <a href="${verifyUrl}" target="_blank" 
             style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;">
             Vérifier mon compte
          </a>
          <p>Ce lien expirera dans 24 heures.</p>
        `,
      };

      console.log('📧 Options email:', {
        from: mailFrom,
        to,
        subject: mailOptions.subject,
        url: verifyUrl,
      });

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de vérification envoyé avec succès:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de vérification:', error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
        stack: error.stack,
      });
      
      // Erreurs communes Brevo/Sendinblue
      if (error.code === 'EAUTH') {
        console.error('❌ Erreur d\'authentification SMTP');
        console.error('❌ Vérifiez que MAIL_USER et MAIL_PASS sont corrects');
        console.error('❌ Pour Brevo, utilisez votre email et votre clé SMTP (pas le mot de passe)');
      } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
        console.error('❌ Erreur de connexion SMTP');
        console.error('❌ Vérifiez que MAIL_HOST (smtp.brevo.com) et MAIL_PORT (587) sont corrects');
      } else if (error.responseCode === 535) {
        console.error('❌ Erreur 535: Authentification échouée');
        console.error('❌ Vérifiez vos credentials Brevo dans le fichier .env');
      }
      
      throw error;
    }
  }

  async sendLoginNotificationEmail(to: string, loginInfo?: { date?: Date; ip?: string }) {
    const mailFrom = process.env.MAIL_FROM || `"DAM Backend" <${process.env.MAIL_USER}>`;
    const loginDate = loginInfo?.date || new Date();
    const formattedDate = loginDate.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    const mailOptions = {
      from: mailFrom,
      to,
      subject: '🔐 Notification de connexion',
      html: `
        <h2>Nouvelle connexion détectée 🔐</h2>
        <p>Bonjour,</p>
        <p>Une connexion à votre compte a été effectuée avec succès.</p>
        <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:20px 0;">
          <p><strong>Date et heure :</strong> ${formattedDate}</p>
          ${loginInfo?.ip ? `<p><strong>Adresse IP :</strong> ${loginInfo.ip}</p>` : ''}
        </div>
        <p>Si vous n'êtes pas à l'origine de cette connexion, veuillez changer votre mot de passe immédiatement.</p>
        <p style="color:#666;font-size:12px;margin-top:30px;">
          Ceci est un email automatique, merci de ne pas y répondre.
        </p>
      `,
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Ne pas bloquer le login si l'email échoue
      console.error('Erreur lors de l\'envoi de l\'email de notification de connexion:', error);
    }
  }
}

