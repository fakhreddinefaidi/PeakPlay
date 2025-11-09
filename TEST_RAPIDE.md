# 🧪 Guide de Test Rapide

## 🚀 Méthode 1 : Swagger UI (La Plus Simple)

### Étape 1 : Démarrer l'application

```bash
npm run start:dev
```

### Étape 2 : Ouvrir Swagger

Ouvrez votre navigateur et allez sur :
```
http://localhost:3002/api
```

### Étape 3 : Tester le Login

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

### Résultat Attendu

**✅ Succès (200)** :
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**❌ Erreur (401)** :
```json
{
  "statusCode": 401,
  "message": "Email ou mot de passe incorrect"
}
```

---

## 💻 Méthode 2 : cURL (Terminal)

### Windows PowerShell

```powershell
$body = @{
    email = "votre_email@example.com"
    password = "votre_mot_de_passe"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3002/api/v1/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Linux/Mac

```bash
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre_email@example.com",
    "password": "votre_mot_de_passe"
  }'
```

---

## 📮 Méthode 3 : Postman

1. **Méthode** : `POST`
2. **URL** : `http://localhost:3002/api/v1/auth/login`
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

## 🌐 Méthode 4 : Test en Production (Render)

### Si votre application est déployée sur Render

1. **Trouvez votre URL** sur [Render Dashboard](https://dashboard.render.com)
2. **Testez avec Swagger** :
   ```
   https://votre-backend.onrender.com/api
   ```
3. **Testez avec cURL** :
   ```bash
   curl -X POST https://votre-backend.onrender.com/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "votre_email@example.com",
       "password": "votre_mot_de_passe"
     }'
   ```

---

## ✅ Checklist Avant de Tester

### Pour le Login

- [ ] L'application est démarrée (`npm run start:dev`)
- [ ] MongoDB est accessible
- [ ] Un utilisateur existe dans la base de données
- [ ] L'email de l'utilisateur est vérifié (`emailVerified: true`)
- [ ] Le mot de passe est correct

### Pour Créer un Utilisateur (si nécessaire)

1. **Via Swagger** : `POST /api/v1/auth/register`
2. **Body** :
   ```json
   {
     "email": "test@example.com",
     "password": "Test123456",
     "prenom": "Test",
     "nom": "User"
   }
   ```
3. **Vérifier l'email** : Un email de vérification sera envoyé
4. **Vérifier l'email** : Cliquez sur le lien dans l'email ou utilisez :
   ```
   GET /api/v1/auth/verify-email?token=VOTRE_TOKEN
   ```

---

## 🔍 Vérifier les Logs

### En Local

Les logs s'affichent dans le terminal où vous avez lancé `npm run start:dev`.

Vous devriez voir :
```
[LOGIN] Tentative de connexion pour: votre_email@example.com
[VALIDATE_USER] Recherche de l'utilisateur: votre_email@example.com
[VALIDATE_USER] Utilisateur validé avec succès: votre_email@example.com
[LOGIN] Token généré avec succès
```

### En Production (Render)

1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur votre service
3. Allez dans l'onglet **"Logs"**
4. Faites une tentative de login
5. Vérifiez les logs avec les préfixes `[LOGIN]` et `[VALIDATE_USER]`

---

## 🐛 Dépannage

### Erreur : "Cannot connect to database"

**Solution** :
1. Vérifiez que MongoDB est démarré
2. Vérifiez que `MONGODB_URI` est correct dans `.env`

### Erreur : "Email ou mot de passe incorrect"

**Vérifiez** :
1. L'utilisateur existe dans MongoDB
2. Le mot de passe est correct
3. L'email est vérifié (`emailVerified: true`)

### Erreur : "Veuillez vérifier votre adresse email"

**Solution** :
1. Vérifiez votre boîte email
2. Cliquez sur le lien de vérification
3. Ou utilisez l'endpoint `POST /api/v1/auth/resend-verification`

### Erreur : "Port already in use"

**Solution** :
```bash
# Windows
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3002 | xargs kill
```

---

## 📝 Exemple Complet de Test

### 1. Démarrer l'application

```bash
npm run start:dev
```

### 2. Créer un utilisateur (si nécessaire)

**Via Swagger** (`http://localhost:3002/api`) :
- `POST /api/v1/auth/register`
- Body :
  ```json
  {
    "email": "test@example.com",
    "password": "Test123456",
    "prenom": "Test",
    "nom": "User"
  }
  ```

### 3. Vérifier l'email

- Vérifiez votre boîte email
- Cliquez sur le lien de vérification
- Ou utilisez : `GET /api/v1/auth/verify-email?token=VOTRE_TOKEN`

### 4. Tester le login

**Via Swagger** :
- `POST /api/v1/auth/login`
- Body :
  ```json
  {
    "email": "test@example.com",
    "password": "Test123456"
  }
  ```

### 5. Vérifier le résultat

**✅ Succès** : Vous recevez un `access_token`

**❌ Erreur** : Vérifiez les logs pour voir où ça échoue

---

## 🎯 Test Rapide (Copier-Coller)

### Windows PowerShell

```powershell
# Test de l'API de base
Invoke-RestMethod -Uri "http://localhost:3002/api/v1"

# Test de login
$body = @{ email = "test@example.com"; password = "Test123456" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3002/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $body
```

### Linux/Mac

```bash
# Test de l'API de base
curl http://localhost:3002/api/v1

# Test de login
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

---

## 📞 Besoin d'Aide ?

Si le test ne fonctionne pas :

1. **Vérifiez les logs** dans le terminal
2. **Vérifiez MongoDB** : L'utilisateur existe-t-il ?
3. **Vérifiez les variables d'environnement** dans `.env`
4. **Vérifiez les logs Render** si en production

Les logs détaillés vous indiqueront exactement où le problème se situe !

