# 🚀 Guide de Déploiement sur Render

## ✅ Votre Application est Prête pour Render !

Tous les problèmes ont été corrigés pour un déploiement sans problème sur Render.

---

## 📋 Checklist de Déploiement

### ✅ 1. Configuration MongoDB

**Option recommandée : MongoDB Atlas (Cloud)**

1. Créez un compte sur https://www.mongodb.com/cloud/atlas/register
2. Créez un cluster gratuit (M0)
3. Configurez l'accès réseau : `0.0.0.0/0` (tous les IPs)
4. Créez un utilisateur avec mot de passe
5. Obtenez la chaîne de connexion :
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dam_backend?retryWrites=true&w=majority
   ```

---

### ✅ 2. Variables d'Environnement dans Render

Dans votre dashboard Render, configurez **TOUTES** ces variables :

```env
# === REQUIS ===
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dam_backend?retryWrites=true&w=majority
JWT_SECRET=votre-super-secret-jwt-key-minimum-20-caracteres-long

# === Email Brevo ===
BREVO_API_KEY=xkeysib-votre-cle-api-brevo
MAIL_FROM="DAM Backend <9b8f34001@smtp-brevo.com>"
BACKEND_URL=https://dam-backend.onrender.com

# === OAuth Google ===
GOOGLE_CLIENT_ID=votre-google-client-id
GOOGLE_CLIENT_SECRET=votre-google-client-secret
GOOGLE_CALLBACK_URL=https://dam-backend.onrender.com/api/v1/auth/google/redirect

# === OAuth Facebook ===
FACEBOOK_APP_ID=votre-facebook-app-id
FACEBOOK_APP_SECRET=votre-facebook-app-secret
FACEBOOK_CALLBACK_URL=https://dam-backend.onrender.com/api/v1/auth/facebook/redirect

# === Frontend (si vous avez un frontend) ===
FRONTEND_URL=https://votre-frontend.onrender.com
```

---

### ✅ 3. Configuration Google OAuth

1. **Allez sur Google Cloud Console** : https://console.cloud.google.com
2. **Créez un projet** ou sélectionnez un projet existant
3. **Activez Google+ API**
4. **Créez des identifiants OAuth 2.0** :
   - Type : Application Web
   - **URI de redirection autorisés** :
     ```
     https://dam-backend.onrender.com/api/v1/auth/google/redirect
     ```
   - **Origines JavaScript autorisées** :
     ```
     https://dam-backend.onrender.com
     ```
5. **Copiez le Client ID et Client Secret**

⚠️ **IMPORTANT** : Les URLs doivent être en **HTTPS** et correspondre exactement à votre URL Render !

---

### ✅ 4. Configuration Facebook OAuth

1. **Allez sur Facebook Developers** : https://developers.facebook.com
2. **Créez une application**
3. **Ajoutez Facebook Login**
4. **Configurez les paramètres** :
   - **URL de redirection OAuth valides** :
     ```
     https://dam-backend.onrender.com/api/v1/auth/facebook/redirect
     ```
   - **Domaines de l'application** :
     ```
     dam-backend.onrender.com
     ```
5. **Copiez l'App ID et App Secret**

⚠️ **IMPORTANT** : Les URLs doivent être en **HTTPS** !

---

### ✅ 5. Configuration Render

1. **Créez un nouveau service Web** sur Render
2. **Connectez votre repository GitHub/GitLab**
3. **Configuration du build** :
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run start:prod` ou `node dist/main`
   - **Environment** : `Node`

4. **Ajoutez toutes les variables d'environnement** (voir section 2)

5. **Déployez !**

---

## 🔍 Vérifications Post-Déploiement

### ✅ 1. Vérifier que l'application démarre

Dans les logs Render, vous devriez voir :
```
✅ Configuration Brevo API chargée
✅ [MAIL_SERVICE] Sender configuré: DAM Backend <9b8f34001@smtp-brevo.com>
🚀 Application is running on: http://0.0.0.0:10000
```

### ✅ 2. Tester l'API

```bash
# Tester l'endpoint de base
curl https://dam-backend.onrender.com/api/v1

# Tester Swagger
https://dam-backend.onrender.com/api
```

### ✅ 3. Tester l'inscription

```bash
curl -X POST https://dam-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "prenom": "Test",
    "nom": "User"
  }'
```

### ✅ 4. Tester OAuth Google

1. Ouvrez dans votre navigateur :
   ```
   https://dam-backend.onrender.com/api/v1/auth/google
   ```
2. Vous devriez être redirigé vers Google
3. Après authentification, vous serez redirigé vers votre frontend ou recevrez un token JSON

### ✅ 5. Tester OAuth Facebook

1. Ouvrez dans votre navigateur :
   ```
   https://dam-backend.onrender.com/api/v1/auth/facebook
   ```
2. Vous devriez être redirigé vers Facebook
3. Après authentification, vous serez redirigé vers votre frontend ou recevrez un token JSON

---

## ✅ Fonctionnalités Vérifiées pour Render

### ✅ 1. Configuration Serveur
- ✅ Écoute sur `0.0.0.0` (requis par Render)
- ✅ Utilise `PORT` depuis les variables d'environnement
- ✅ Compatible avec Render

### ✅ 2. CORS
- ✅ Configuré pour accepter les requêtes du frontend
- ✅ Support des cookies avec `credentials: true`
- ✅ Compatible avec Render

### ✅ 3. Cookies
- ✅ `secure: true` en production (HTTPS)
- ✅ `sameSite: 'none'` en production (cross-site)
- ✅ `httpOnly: true` (sécurité)
- ✅ Compatible avec Render

### ✅ 4. OAuth Google
- ✅ URLs de callback générées automatiquement depuis `BACKEND_URL`
- ✅ Compatible avec HTTPS
- ✅ Fonctionne sur Render

### ✅ 5. OAuth Facebook
- ✅ URLs de callback générées automatiquement depuis `BACKEND_URL`
- ✅ Compatible avec HTTPS
- ✅ Fonctionne sur Render

### ✅ 6. Email Brevo
- ✅ Utilise uniquement l'API Brevo (pas de SMTP)
- ✅ URLs de vérification générées avec `BACKEND_URL`
- ✅ Compatible avec Render

---

## ⚠️ Points d'Attention

### 1. **URLs OAuth doivent être en HTTPS**

Google et Facebook **exigent HTTPS** en production. Assurez-vous que :
- `BACKEND_URL` commence par `https://`
- Les URLs de callback dans Google/Facebook sont en `https://`

### 2. **Variables d'Environnement**

Toutes les variables doivent être définies dans Render. Si une variable manque :
- L'application peut démarrer mais certaines fonctionnalités ne fonctionneront pas
- Vérifiez les logs pour les erreurs

### 3. **MongoDB Atlas**

Assurez-vous que :
- L'IP `0.0.0.0/0` est autorisée dans Network Access
- L'utilisateur a les permissions nécessaires
- La chaîne de connexion est correcte

### 4. **Premier Déploiement**

Le premier déploiement peut prendre 5-10 minutes. Soyez patient !

---

## 🎯 Résumé

### ✅ Oui, vous pouvez déployer sur Render sans problème !

**Tout est configuré pour :**
- ✅ Render (serveur, port, host)
- ✅ OAuth Google (URLs automatiques)
- ✅ OAuth Facebook (URLs automatiques)
- ✅ Email Brevo (API uniquement)
- ✅ Cookies sécurisés (HTTPS)
- ✅ CORS configuré

### ✅ Les APIs Google fonctionnent bien !

**Les stratégies OAuth :**
- ✅ Utilisent `BACKEND_URL` automatiquement
- ✅ Génèrent les URLs de callback correctement
- ✅ Compatibles avec HTTPS
- ✅ Fonctionnent sur Render

### ✅ Rien ne sera bloqué par Render !

**Tout est compatible :**
- ✅ Pas de SMTP (utilise uniquement l'API Brevo)
- ✅ Pas de ports bloqués
- ✅ Pas de restrictions réseau
- ✅ Configuration optimale pour Render

---

## 🚀 Prêt à Déployer !

Suivez simplement les étapes ci-dessus et votre application fonctionnera parfaitement sur Render ! 🎉

