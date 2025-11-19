# 📖 Guide : Voir le Profil Académie dans Swagger

## 🎯 Objectif

Voir votre profil académie complet (données utilisateur + données académie) dans Swagger UI.

---

## 📋 Étapes Détaillées

### 1️⃣ Démarrer l'Application

```bash
npm run start:dev
```

Attendez que vous voyiez :
```
🚀 Application is running on: http://0.0.0.0:3001
```

---

### 2️⃣ Ouvrir Swagger UI

Ouvrez votre navigateur et allez à :
```
http://localhost:3001/api
```

Vous devriez voir l'interface Swagger avec tous les endpoints disponibles.

---

### 3️⃣ Créer un Compte ACADEMY (si pas déjà fait)

#### Option A : Via Swagger

1. Dans Swagger, trouvez la section **"Auth"**
2. Cliquez sur **POST /api/v1/auth/register**
3. Cliquez sur **"Try it out"**
4. Dans le champ de texte, collez ce JSON :

```json
{
  "prenom": "Académie",
  "nom": "Test",
  "email": "academy@test.com",
  "password": "password123",
  "age": "2000-01-01",
  "tel": 123456789,
  "role": "ACADEMY"
}
```

5. Cliquez sur **"Execute"**
6. Vous devriez voir une réponse `201 Created`

**⚠️ Important :** Vérifiez votre email pour confirmer le compte (ou utilisez le token de vérification).

---

### 4️⃣ Se Connecter et Obtenir le Token

1. Dans Swagger, section **"Auth"**
2. Cliquez sur **POST /api/v1/auth/login**
3. Cliquez sur **"Try it out"**
4. Collez ce JSON :

```json
{
  "email": "academy@test.com",
  "password": "password123"
}
```

5. Cliquez sur **"Execute"**
6. Dans la réponse, **copiez le `access_token`**

**Exemple de réponse :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFjYWRlbXlAdGVzdC5jb20iLCJzdWIiOiI2NzEyMzQ1Njc4OWFiYzEyMzQ1Njc4Iiwicm9sZSI6IkFDQURFTVkiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwMzYwMH0.xxxxx",
  "user": {
    "email": "academy@test.com",
    "role": "ACADEMY"
  }
}
```

**📝 Copiez tout le token** (la longue chaîne après `"access_token":`)

---

### 5️⃣ Autoriser dans Swagger

1. En haut à droite de Swagger, cliquez sur le bouton **"Authorize"** 🔒
2. Dans la fenêtre qui s'ouvre, vous verrez **"access-token"**
3. Dans le champ à côté de **"access-token"**, collez votre token (sans les guillemets)
4. Cliquez sur **"Authorize"**
5. Cliquez sur **"Close"**

**✅ Vous êtes maintenant authentifié !**

Vous devriez voir un cadenas vert 🔒 à côté de "Authorize" indiquant que vous êtes connecté.

---

### 6️⃣ Voir le Profil Académie

1. Dans Swagger, trouvez la section **"Academy"**
2. Cliquez sur **GET /api/v1/academy/me**
3. Cliquez sur **"Try it out"**
4. Cliquez sur **"Execute"**

---

### 7️⃣ Voir la Réponse

Vous devriez voir une réponse `200 OK` avec toutes vos données :

```json
{
  "_id": "67abc123def456789",
  "userId": "67abc123def456789",
  "academyName": null,
  "logoUrl": null,
  "address": null,
  "phone": null,
  "responsableName": null,
  "categories": [],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "user": {
    "_id": "67abc123def456789",
    "email": "academy@test.com",
    "prenom": "Académie",
    "nom": "Test",
    "age": "2000-01-01T00:00:00.000Z",
    "tel": 123456789,
    "role": "ACADEMY",
    "emailVerified": false,
    "picture": null,
    "provider": null
  }
}
```

**🎉 Vous voyez maintenant :**
- ✅ Les données du profil académie (en haut)
- ✅ Les données de l'utilisateur (dans l'objet `user`)

---

### 8️⃣ Mettre à Jour le Profil (Optionnel)

Pour remplir votre profil académie :

1. Dans Swagger, section **"Academy"**
2. Cliquez sur **PUT /api/v1/academy/me**
3. Cliquez sur **"Try it out"**
4. Collez ce JSON :

```json
{
  "academyName": "Académie de Football Paris",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Rue de la République, 75001 Paris",
  "phone": "+33123456789",
  "responsableName": "Jean Dupont",
  "categories": ["U10", "U12", "U15"]
}
```

5. Cliquez sur **"Execute"**

6. **Ensuite, refaites GET /api/v1/academy/me** pour voir les données mises à jour !

---

## 🖼️ Visualisation dans Swagger

### Où Trouver les Sections

```
Swagger UI
├── Auth
│   ├── POST /api/v1/auth/register
│   └── POST /api/v1/auth/login
├── Academy
│   ├── GET /api/v1/academy/me      ← ICI pour voir le profil
│   └── PUT /api/v1/academy/me      ← ICI pour mettre à jour
├── Teams
├── Tournaments
└── ...
```

---

## 🔍 Détails de la Réponse

### Données du Profil Académie
- `_id` : ID du profil académie
- `userId` : ID de l'utilisateur (référence)
- `academyName` : Nom de l'académie
- `logoUrl` : URL du logo
- `address` : Adresse complète
- `phone` : Numéro de téléphone
- `responsableName` : Nom du responsable
- `categories` : Tableau des catégories (ex: ["U10", "U12"])
- `createdAt` : Date de création
- `updatedAt` : Date de dernière mise à jour

### Données de l'Utilisateur (dans `user`)
- `_id` : ID de l'utilisateur
- `email` : Email de connexion
- `prenom` : Prénom
- `nom` : Nom de famille
- `age` : Date de naissance
- `tel` : Numéro de téléphone
- `role` : Rôle (ACADEMY)
- `emailVerified` : Email vérifié (true/false)
- `picture` : URL de la photo de profil
- `provider` : Provider OAuth (google, facebook, ou null)

---

## ❌ Problèmes Courants

### Erreur 401 Unauthorized
**Cause :** Token non valide ou expiré  
**Solution :** 
1. Reconnectez-vous (POST /api/v1/auth/login)
2. Copiez le nouveau token
3. Réautorisez dans Swagger

### Erreur 403 Forbidden
**Cause :** Votre utilisateur n'a pas le rôle ACADEMY  
**Solution :** 
1. Vérifiez que vous avez créé le compte avec `"role": "ACADEMY"`
2. Ou modifiez le rôle de l'utilisateur dans MongoDB

### Erreur 404 Not Found
**Cause :** Profil académie non trouvé (ne devrait plus arriver)  
**Solution :** Le profil est créé automatiquement, réessayez

### Le Token Ne Fonctionne Pas
**Solution :**
1. Vérifiez que vous avez collé le token **sans les guillemets**
2. Vérifiez que vous avez cliqué sur **"Authorize"** puis **"Close"**
3. Vérifiez que le cadenas est vert 🔒

---

## 📸 Capture d'Écran Mentale

```
┌─────────────────────────────────────────┐
│  Swagger UI                             │
│  [Authorize 🔒]                         │
├─────────────────────────────────────────┤
│                                         │
│  Academy                                │
│  ┌───────────────────────────────────┐ │
│  │ GET /api/v1/academy/me            │ │
│  │ [Try it out] [Execute]            │ │
│  │                                    │ │
│  │ Response:                          │ │
│  │ {                                  │ │
│  │   "_id": "...",                    │ │
│  │   "academyName": "...",            │ │
│  │   "user": {                        │ │
│  │     "email": "...",                │ │
│  │     "prenom": "...",               │ │
│  │     ...                            │ │
│  │   }                                │ │
│  │ }                                  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist Rapide

- [ ] Application démarrée (`npm run start:dev`)
- [ ] Swagger ouvert (`http://localhost:3001/api`)
- [ ] Compte ACADEMY créé (POST /auth/register)
- [ ] Connecté et token obtenu (POST /auth/login)
- [ ] Token collé dans "Authorize"
- [ ] Cadenas vert visible 🔒
- [ ] GET /api/v1/academy/me exécuté
- [ ] Données visibles dans la réponse

---

## 🎯 Résumé Ultra-Rapide

1. **Démarrer** : `npm run start:dev`
2. **Ouvrir** : `http://localhost:3001/api`
3. **Créer compte** : POST /auth/register (role: "ACADEMY")
4. **Se connecter** : POST /auth/login → copier le token
5. **Autoriser** : Cliquer sur "Authorize" → coller le token → "Authorize" → "Close"
6. **Voir profil** : GET /academy/me → "Try it out" → "Execute"
7. **Voir les données** : Dans la réponse, vous verrez le profil + les données utilisateur dans `user`

---

**🎉 C'est tout ! Vous devriez maintenant voir votre profil complet dans Swagger !**

