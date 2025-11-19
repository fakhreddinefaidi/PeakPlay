# 📖 Guide Simple : Récupérer le Profil Académie

## 🎯 Objectif

Récupérer votre profil académie complet (données académie + données utilisateur) via l'API.

---

## 📋 Étapes Simples

### **1️⃣ Se Connecter et Obtenir le Token**

**Endpoint :** `POST /api/v1/auth/login`

**Dans Swagger :**
1. Section **"Auth"** → **POST /api/v1/auth/login**
2. Cliquez **"Try it out"**
3. Entrez vos identifiants :
   ```json
   {
     "email": "votre@email.com",
     "password": "votre_mot_de_passe"
   }
   ```
4. Cliquez **"Execute"**
5. **Copiez le `access_token`** de la réponse

**Exemple de réponse :**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **2️⃣ Autoriser dans Swagger**

1. Cliquez sur **"Authorize"** (en haut à droite de Swagger)
2. Dans la fenêtre qui s'ouvre, vous verrez **"access-token"**
3. **Collez votre token** dans le champ (sans les guillemets)
4. Cliquez sur **"Authorize"**
5. Cliquez sur **"Close"**

**✅ Vous devriez voir un cadenas vert 🔒** indiquant que vous êtes connecté.

---

### **3️⃣ Récupérer le Profil Académie**

**Endpoint :** `GET /api/v1/academy/me`

**Dans Swagger :**
1. Section **"Academy"** → **GET /api/v1/academy/me**
2. Cliquez **"Try it out"**
3. Cliquez **"Execute"**

---

### **4️⃣ Voir la Réponse**

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
    "emailVerified": true,
    "picture": null,
    "provider": null
  }
}
```

---

## 🎯 Résumé Ultra-Rapide

1. **Login** → `POST /api/v1/auth/login` → Copier le token
2. **Authorize** → Coller le token dans "Authorize" → "Authorize" → "Close"
3. **Get Profile** → `GET /api/v1/academy/me` → "Try it out" → "Execute"
4. **Voir les données** → Dans la réponse JSON

---

## 📝 Exemple Complet dans Swagger

### **Étape 1 : Login**

```
POST /api/v1/auth/login

Body:
{
  "email": "academy@test.com",
  "password": "password123"
}

Réponse:
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **Étape 2 : Authorize**

1. Cliquez sur **"Authorize"** 🔒
2. Collez : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (votre token)
3. Cliquez **"Authorize"** puis **"Close"**

---

### **Étape 3 : Get Profile**

```
GET /api/v1/academy/me

Réponse:
{
  "_id": "...",
  "academyName": null,
  "logoUrl": null,
  "address": null,
  "phone": null,
  "responsableName": null,
  "categories": [],
  "user": {
    "email": "academy@test.com",
    "prenom": "Académie",
    "nom": "Test",
    "role": "ACADEMY",
    ...
  }
}
```

---

## ⚠️ Erreurs Possibles

### **Erreur 401 Unauthorized**

**Cause :** Token invalide ou expiré

**Solution :**
1. Reconnectez-vous (`POST /api/v1/auth/login`)
2. Copiez le nouveau token
3. Réautorisez dans Swagger

---

### **Erreur 403 Forbidden**

**Cause :** Votre utilisateur n'a pas le rôle `ACADEMY`

**Solution :**
1. Vérifiez que vous êtes connecté avec un compte ayant `"role": "ACADEMY"`
2. Ou créez un nouveau compte avec `"role": "ACADEMY"`

---

### **Erreur 404 Not Found**

**Cause :** Profil académie non trouvé (ne devrait plus arriver)

**Solution :** Le profil est créé automatiquement, réessayez

---

## 🔍 Ce que Vous Verrez dans la Réponse

### **Données du Profil Académie**
- `academyName` : Nom de l'académie
- `logoUrl` : URL du logo
- `address` : Adresse
- `phone` : Téléphone
- `responsableName` : Nom du responsable
- `categories` : Catégories d'âge (ex: ["U10", "U12"])

### **Données de l'Utilisateur** (dans `user`)
- `email` : Email de connexion
- `prenom` : Prénom
- `nom` : Nom
- `role` : Rôle (ACADEMY)
- `emailVerified` : Email vérifié (true/false)

---

## 📸 Visualisation dans Swagger

```
Swagger UI
├── Auth
│   └── POST /api/v1/auth/login        ← Étape 1 : Se connecter
│
├── Academy
│   └── GET /api/v1/academy/me         ← Étape 3 : Récupérer le profil
│
└── [Authorize 🔒]                      ← Étape 2 : Autoriser
```

---

## ✅ Checklist

- [ ] Connecté avec un compte `ACADEMY`
- [ ] Token obtenu et copié
- [ ] Token collé dans "Authorize"
- [ ] Cadenas vert visible 🔒
- [ ] `GET /api/v1/academy/me` exécuté
- [ ] Données visibles dans la réponse

---

## 🎯 Résumé en 3 Points

1. **Login** → Obtenir le token
2. **Authorize** → Coller le token dans Swagger
3. **GET /academy/me** → Voir votre profil

---

**🎉 C'est tout ! Vous devriez maintenant voir votre profil académie complet !**

