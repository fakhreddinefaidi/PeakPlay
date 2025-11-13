import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
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
    await this.transporter.sendMail(mailOptions);
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

