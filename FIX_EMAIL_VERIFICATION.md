# 🔧 Correction des Emails de Vérification

## 📋 Problème Identifié

Les emails de vérification après `register` et les emails de notification après `login` ne fonctionnaient pas correctement.

## ✅ Corrections Apportées

### 1. **Nettoyage Amélioré des URLs**

**Avant :**
```typescript
const cleanBackendUrl = backendUrl.replace(/\/$/, '');
```

**Après :**
```typescript
const cleanBackendUrl = backendUrl
  .trim()                                    // Supprimer les espaces avant/après
  .replace(/^["']|["']$/g, '')              // Supprimer les guillemets au début/fin
  .replace(/\/+$/, '')                       // Supprimer les slashes finaux (un ou plusieurs)
  .replace(/[=]+$/, '')                      // Supprimer les = à la fin (comme ==)
  .replace(/\s+/g, '');                      // Supprimer tous les espaces
```

**Pourquoi :** Les URLs peuvent contenir des caractères problématiques (guillemets, espaces, `==`) qui causent des erreurs lors de l'envoi d'emails.

---

### 2. **Ajout de `textContent` dans les Emails**

**Avant :**
```typescript
const sendSmtpEmail: SendSmtpEmail = {
  // ... seulement htmlContent
};
```

**Après :**
```typescript
const sendSmtpEmail: SendSmtpEmail = {
  htmlContent: `...`,
  textContent: `Bienvenue sur PeakPlay ⚽\n\n...`, // ✅ Ajouté
};
```

**Pourquoi :** Brevo recommande d'inclure un `textContent` en plus du `htmlContent` pour une meilleure compatibilité avec les clients email.

---

### 3. **Logs Détaillés pour le Diagnostic**

**Ajouté dans `auth.service.ts` :**
```typescript
console.log(`   → BREVO_API_KEY: ${process.env.BREVO_API_KEY ? '✅ Défini' : '❌ NON DÉFINI'}`);
console.log(`   → MAIL_FROM_EMAIL: ${process.env.MAIL_FROM_EMAIL || 'Non défini (utilise défaut)'}`);
console.log(`   → MAIL_FROM_NAME: ${process.env.MAIL_FROM_NAME || 'Non défini (utilise défaut)'}`);
```

**Pourquoi :** Permet de diagnostiquer rapidement si les variables d'environnement sont bien configurées.

---

### 4. **Amélioration des Logs d'Erreur**

**Ajouté :**
```typescript
console.error(`   → Stack: ${emailError.stack || 'No stack trace'}`);
```

**Pourquoi :** Permet de voir la stack trace complète en cas d'erreur, facilitant le débogage.

---

## 🔍 Comment Vérifier que Tout Fonctionne

### **1. Vérifier les Variables d'Environnement**

Assurez-vous que votre `.env` contient :

```env
BREVO_API_KEY=xkeysib-...
MAIL_FROM_EMAIL=faidifakhri9@gmail.com
MAIL_FROM_NAME=PeakPlay
BACKEND_URL=http://localhost:3001
```

**Sur Render :**
```env
BREVO_API_KEY=xkeysib-...
MAIL_FROM_EMAIL=faidifakhri9@gmail.com
MAIL_FROM_NAME=PeakPlay
BACKEND_URL=https://votre-app.onrender.com
```

---

### **2. Tester l'Enregistrement**

1. **Faire un `POST /api/v1/auth/register`** avec :
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "prenom": "Test",
     "nom": "User"
   }
   ```

2. **Vérifier les logs** dans la console :
   ```
   📧 [REGISTER] Génération de l'URL de vérification
      → BACKEND_URL: http://localhost:3001
      → URL nettoyée: http://localhost:3001
      → URL complète: http://localhost:3001/api/v1/auth/verify-email?token=...
      → BREVO_API_KEY: ✅ Défini
      → MAIL_FROM_EMAIL: faidifakhri9@gmail.com
      → MAIL_FROM_NAME: PeakPlay
   📧 [SEND_VERIFICATION] Tentative d'envoi d'email de vérification
      → Destinataire: test@example.com
      → Sender: PeakPlay <faidifakhri9@gmail.com>
   ✅ [SEND_VERIFICATION] Email envoyé avec succès via Brevo API
   ```

3. **Vérifier votre boîte email** - Vous devriez recevoir un email de vérification.

---

### **3. Tester le Login**

1. **Faire un `POST /api/v1/auth/login`** avec :
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Vérifier les logs** dans la console :
   ```
   📧 [SEND_LOGIN_NOTIFICATION] Tentative d'envoi d'email de notification de connexion
      → Destinataire: test@example.com
      → Date: 01/01/2024, 12:00
      → Sender: PeakPlay <faidifakhri9@gmail.com>
   ✅ [SEND_LOGIN_NOTIFICATION] Email de notification de connexion envoyé via Brevo API
   ```

3. **Vérifier votre boîte email** - Vous devriez recevoir un email de notification.

---

## ❌ Diagnostic en Cas d'Erreur

### **Erreur : "BREVO_API_KEY is not configured"**

**Cause :** La variable `BREVO_API_KEY` n'est pas définie.

**Solution :**
1. Vérifiez votre fichier `.env` (local) ou les variables d'environnement (Render)
2. Assurez-vous que la clé commence par `xkeysib-`
3. Redémarrez l'application

---

### **Erreur : "Invalid sender email"**

**Cause :** L'email dans `MAIL_FROM_EMAIL` n'est pas validé dans Brevo.

**Solution :**
1. Allez sur [Brevo Dashboard](https://app.brevo.com)
2. Allez dans **Settings > Senders & IP**
3. Vérifiez que `faidifakhri9@gmail.com` est validé
4. Si non, validez-le en cliquant sur "Verify"

---

### **Erreur : "Quota exceeded"**

**Cause :** Vous avez atteint la limite d'emails gratuits de Brevo (300 emails/jour).

**Solution :**
1. Vérifiez votre quota sur [Brevo Dashboard](https://app.brevo.com)
2. Attendez le lendemain ou passez à un plan payant

---

### **Erreur : "Email not received"**

**Causes possibles :**

1. **Email dans les spams** : Vérifiez votre dossier spam
2. **Filtres email** : Vérifiez les filtres de votre boîte email
3. **Email invalide** : Vérifiez que l'email de destination est valide
4. **Erreur silencieuse** : Vérifiez les logs de l'application

**Solution :**
1. Vérifiez les logs de l'application pour voir les erreurs
2. Vérifiez votre boîte spam
3. Testez avec un autre email
4. Vérifiez le dashboard Brevo pour voir si l'email a été envoyé

---

## 📊 Logs à Surveiller

### **Logs de Succès :**
```
✅ [MAIL_SERVICE] Configuration Brevo API chargée avec succès
✅ [MAIL_SERVICE] Sender configuré: PeakPlay <faidifakhri9@gmail.com>
✅ [SEND_VERIFICATION] Email envoyé avec succès via Brevo API
✅ [SEND_LOGIN_NOTIFICATION] Email de notification de connexion envoyé via Brevo API
```

### **Logs d'Erreur :**
```
❌ [SEND_VERIFICATION] Erreur lors de l'envoi de l'email via Brevo API
   → Erreur: Invalid API key
   → Status HTTP: 401
```

---

## ✅ Checklist de Vérification

- [ ] `BREVO_API_KEY` est défini dans `.env` (local) ou variables d'environnement (Render)
- [ ] `MAIL_FROM_EMAIL` est défini et validé dans Brevo
- [ ] `MAIL_FROM_NAME` est défini
- [ ] `BACKEND_URL` est défini correctement (sans guillemets, sans `==`, sans slash final)
- [ ] Les logs montrent "✅ Email envoyé avec succès"
- [ ] L'email est reçu dans la boîte de réception (vérifier aussi les spams)

---

## 🚀 Prochaines Étapes

1. **Tester l'enregistrement** : Créez un nouveau compte et vérifiez que l'email est reçu
2. **Tester le login** : Connectez-vous et vérifiez que l'email de notification est reçu
3. **Vérifier les logs** : Surveillez les logs pour confirmer que tout fonctionne
4. **Vérifier Brevo Dashboard** : Allez sur [Brevo Dashboard](https://app.brevo.com) pour voir les emails envoyés

---

## 📝 Notes Importantes

- **Les emails ne bloquent pas l'enregistrement** : Si l'email échoue, l'utilisateur est quand même créé
- **Les emails de notification ne bloquent pas le login** : Si l'email échoue, le login fonctionne quand même
- **Les erreurs sont loggées** : Toutes les erreurs sont loggées dans la console pour le débogage
- **Le `textContent` est requis** : Brevo recommande d'inclure un `textContent` en plus du `htmlContent`

---

## 🔗 Ressources

- [Documentation Brevo API](https://developers.brevo.com/)
- [Brevo Dashboard](https://app.brevo.com)
- [Guide de Configuration Email](./CONFIGURATION_EMAIL_BREVO.md)

