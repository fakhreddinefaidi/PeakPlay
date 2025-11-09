# 🚀 Tester sur l'URL de Déploiement (Render)

## 📍 Étape 1 : Trouver Votre URL Render

### Méthode 1 : Dashboard Render

1. Allez sur : [https://dashboard.render.com](https://dashboard.render.com)
2. Connectez-vous avec votre compte
3. Cliquez sur votre service (ex: `dam-backend`)
4. **L'URL est affichée en haut** de la page

**Format typique** :
```
https://dam-backend.onrender.com
```
ou
```
https://dam-backend-xxxx.onrender.com
```

### Méthode 2 : Dans les Logs

1. Allez dans l'onglet **"Logs"** de votre service Render
2. L'URL est visible dans l'en-tête de la page

---

## 🧪 Étape 2 : Tester avec Swagger (Recommandé)

### 1. Ouvrir Swagger

Remplacez `votre-backend.onrender.com` par votre URL réelle :

```
https://votre-backend.onrender.com/api
```

**Exemple** :
```
https://dam-backend.onrender.com/api
```

### 2. Tester le Login

1. Dans Swagger, trouvez la section **"Auth"**
2. Cliquez sur **`POST /api/v1/auth/login`**
3. Cliquez sur **"Try it out"**
4. Entrez vos données :
   ```json
   {
     "email": "votre_email@example.com",
     "password": "votre_mot_de_passe"
   }
   ```
5. Cliquez sur **"Execute"**

### 3. Vérifier la Réponse

**✅ Succès (200)** :
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 💻 Étape 3 : Tester avec cURL

### Windows PowerShell

Remplacez `votre-backend.onrender.com` par votre URL :

```powershell
$body = @{
    email = "votre_email@example.com"
    password = "votre_mot_de_passe"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://votre-backend.onrender.com/api/v1/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Linux/Mac

```bash
curl -X POST https://votre-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre_email@example.com",
    "password": "votre_mot_de_passe"
  }'
```

### Avec Affichage Détaillé (-v)

```bash
curl -X POST https://votre-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre_email@example.com",
    "password": "votre_mot_de_passe"
  }' \
  -v
```

---

## 📮 Étape 4 : Tester avec Postman

1. **Méthode** : `POST`
2. **URL** : `https://votre-backend.onrender.com/api/v1/auth/login`
3. **Headers** :
   - `Content-Type: application/json`
4. **Body** (raw JSON) :
   ```json
   {
     "email": "votre_email@example.com",
     "password": "votre_mot_de_passe"
   }
   ```
5. Cliquez sur **"Send"**

---

## 🌐 Étape 5 : Tester avec le Navigateur (Console)

Ouvrez la console du navigateur (F12) et exécutez :

```javascript
fetch('https://votre-backend.onrender.com/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important pour les cookies
  body: JSON.stringify({
    email: 'votre_email@example.com',
    password: 'votre_mot_de_passe'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

---

## 🔍 Étape 6 : Vérifier les Logs Render

### Pour Voir les Logs de Login

1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur votre service
3. Allez dans l'onglet **"Logs"**
4. Faites une tentative de login
5. Vous devriez voir :

```
[LOGIN] Tentative de connexion pour: votre_email@example.com
[VALIDATE_USER] Recherche de l'utilisateur: votre_email@example.com
[VALIDATE_USER] Utilisateur validé avec succès: votre_email@example.com
[LOGIN] Token généré avec succès pour: votre_email@example.com
[LOGIN] Cookie défini avec secure=true, sameSite=none
```

---

## ✅ Checklist Avant de Tester

### Variables d'Environnement sur Render

Vérifiez que ces variables sont définies sur Render :

- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` (MongoDB Atlas)
- [ ] `JWT_SECRET` (minimum 20 caractères)
- [ ] `FRONTEND_URL` (si vous avez un frontend)
- [ ] `BACKEND_URL` (votre URL Render complète)

### Base de Données

- [ ] MongoDB Atlas est accessible depuis Render
- [ ] Un utilisateur existe dans la base de données
- [ ] L'email de l'utilisateur est vérifié (`emailVerified: true`)
- [ ] Le mot de passe est correct

---

## 🐛 Dépannage

### Erreur : "Network Error" ou "CORS Error"

**Solution** :
1. Vérifiez que `FRONTEND_URL` est défini sur Render
2. Vérifiez que l'origine de la requête correspond à `FRONTEND_URL`
3. Vérifiez les logs CORS dans Render

### Erreur : "Internal Server Error" (500)

**Solution** :
1. Vérifiez les logs Render pour l'erreur exacte
2. Vérifiez que `JWT_SECRET` est défini (minimum 20 caractères)
3. Vérifiez que MongoDB est accessible

### Erreur : "Cannot connect to database"

**Solution** :
1. Vérifiez que `MONGODB_URI` est correct
2. Vérifiez que MongoDB Atlas autorise les connexions depuis Render (IP whitelist)
3. Vérifiez que le cluster MongoDB est actif

### Erreur : "Email ou mot de passe incorrect"

**Vérifiez** :
1. Les logs Render montrent `[VALIDATE_USER] Utilisateur non trouvé` ou `[VALIDATE_USER] Mot de passe invalide`
2. L'utilisateur existe dans MongoDB
3. Le mot de passe est correct
4. L'email est vérifié (`emailVerified: true`)

---

## 📝 Exemple Complet

### 1. Trouver Votre URL

```
https://dam-backend.onrender.com
```

### 2. Tester avec Swagger

```
https://dam-backend.onrender.com/api
```

### 3. Tester le Login

**URL** : `POST https://dam-backend.onrender.com/api/v1/auth/login`

**Body** :
```json
{
  "email": "test@example.com",
  "password": "Test123456"
}
```

### 4. Vérifier les Logs

Allez dans Render Dashboard → Logs pour voir les messages `[LOGIN]`

---

## 🎯 Test Rapide (Copier-Coller)

### Remplacez `votre-backend.onrender.com` par votre URL réelle

**Windows PowerShell** :
```powershell
# Test de l'API de base
Invoke-RestMethod -Uri "https://votre-backend.onrender.com/api/v1"

# Test de login
$body = @{ email = "test@example.com"; password = "Test123456" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://votre-backend.onrender.com/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $body
```

**Linux/Mac** :
```bash
# Test de l'API de base
curl https://votre-backend.onrender.com/api/v1

# Test de login
curl -X POST https://votre-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

---

## 📞 Besoin d'Aide ?

Si le test ne fonctionne pas :

1. **Vérifiez les logs Render** pour voir les erreurs exactes
2. **Vérifiez les variables d'environnement** sur Render
3. **Vérifiez que MongoDB est accessible**
4. **Vérifiez que l'utilisateur existe et est vérifié**

Les logs détaillés avec les préfixes `[LOGIN]` et `[VALIDATE_USER]` vous indiqueront exactement où le problème se situe !

