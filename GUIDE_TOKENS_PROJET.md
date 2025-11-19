# 🔑 Guide : Où Trouver les Tokens dans le Projet

## 📍 Résumé Rapide

**Les tokens JWT ne sont PAS stockés dans le projet** - ils sont **générés dynamiquement** lors de la connexion (login).

---

## 🎯 Où les Tokens sont Générés

### 1️⃣ **Génération du Token** 
📍 **Fichier : `src/auth/auth.service.ts`** (lignes 65-81)

```typescript
async login(user: any) {
  const payload = {
    email: user.email,
    sub: user._id,
    role: user.role,
  };
  const token = this.jwtService.sign(payload);  // ← ICI le token est créé
  return {
    access_token: token,  // ← Token retourné ici
  };
}
```

**Ce que fait ce code :**
- Crée un payload avec `email`, `sub` (user ID), et `role`
- Signe le token avec `JWT_SECRET`
- Retourne le token dans `access_token`

---

### 2️⃣ **Retour du Token au Client**
📍 **Fichier : `src/auth/auth.controller.ts`** (lignes 89, 128)

```typescript
// Ligne 89 : Récupération du token
const token = (await this.authService.login(user))?.access_token;

// Ligne 128 : Retour au client
return res.json({ success: true, access_token: token });
```

**Le token est retourné dans la réponse JSON du login.**

---

## 🔐 Configuration JWT

### **Clé Secrète JWT**
📍 **Fichier : `.env`** (ou variables d'environnement)

```env
JWT_SECRET=votre_secret_jwt_ici_minimum_20_caracteres
```

**Où est utilisée cette clé :**

1. **`src/auth/auth.module.ts`** (ligne 24)
   ```typescript
   secret: configService.get<string>('JWT_SECRET')
   ```

2. **`src/auth/strategies/jwt.strategy.ts`** (ligne 12)
   ```typescript
   secretOrKey: configService.get<string>('JWT_SECRET')
   ```

3. **`src/app.module.ts`** (lignes 15-22)
   - Validation et valeur par défaut si non défini

---

## 📥 Comment Obtenir un Token

### **Méthode 1 : Via Swagger (POST /api/v1/auth/login)**

1. Ouvrez Swagger : `http://localhost:3001/api`
2. Section **Auth** → **POST /api/v1/auth/login**
3. Cliquez **"Try it out"**
4. Entrez vos identifiants :
   ```json
   {
     "email": "votre@email.com",
     "password": "votre_mot_de_passe"
   }
   ```
5. Cliquez **"Execute"**
6. **Copiez le `access_token`** de la réponse :

```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  ← ICI
}
```

---

### **Méthode 2 : Via cURL**

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"votre@email.com","password":"votre_mot_de_passe"}'
```

**Réponse :**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **Méthode 3 : Via Postman / Insomnia**

1. **POST** `http://localhost:3001/api/v1/auth/login`
2. **Body** (JSON) :
   ```json
   {
     "email": "votre@email.com",
     "password": "votre_mot_de_passe"
   }
   ```
3. **Response** → Copiez `access_token`

---

## 🔍 Structure du Token JWT

Un token JWT a 3 parties séparées par des points :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJzdWIiOiI2N2FiYzEyMyIsInJvbGUiOiJBQ0FERU1ZIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.xxxxx
│─────────── HEADER ───────────││─────────── PAYLOAD ───────────││── SIGNATURE ──│
```

**Décodage du payload (base64) :**
```json
{
  "email": "test@example.com",
  "sub": "67abc123",        // User ID
  "role": "ACADEMY",
  "iat": 1700000000,        // Issued at
  "exp": 1700003600         // Expires (1h après)
}
```

**Pour décoder un token :** https://jwt.io

---

## 📂 Fichiers Clés du Système JWT

| Fichier | Rôle |
|---------|------|
| `src/auth/auth.service.ts` | **Génère** le token (`jwtService.sign()`) |
| `src/auth/auth.controller.ts` | **Retourne** le token au client |
| `src/auth/auth.module.ts` | **Configure** JwtModule avec `JWT_SECRET` |
| `src/auth/strategies/jwt.strategy.ts` | **Valide** le token lors des requêtes |
| `src/auth/guards/jwt-auth.guard.ts` | **Protège** les routes avec le token |
| `.env` | **Stocke** `JWT_SECRET` (clé secrète) |

---

## 🛡️ Utilisation du Token

### **Dans Swagger :**
1. Cliquez sur **"Authorize"** (en haut à droite)
2. Collez le token dans le champ **"access-token"**
3. Cliquez **"Authorize"** puis **"Close"**

### **Dans les Requêtes HTTP :**
```bash
# Header Authorization
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Dans le Code (Guards) :**
```typescript
@UseGuards(JwtAuthGuard)  // ← Vérifie automatiquement le token
@Get('me')
getProfile(@Req() req) {
  return req.user;  // ← req.user contient les données du token
}
```

---

## ⚙️ Configuration du Token

### **Durée de Validité**
📍 **Fichier : `src/auth/auth.module.ts`** (ligne 25)

```typescript
signOptions: { expiresIn: '1h' }  // ← Token expire après 1 heure
```

**Pour changer la durée :**
- `'15m'` = 15 minutes
- `'1h'` = 1 heure
- `'7d'` = 7 jours
- `'30d'` = 30 jours

---

## 🔒 Sécurité

### **JWT_SECRET**
- **Minimum 20 caractères** (validé dans `app.module.ts`)
- **Ne JAMAIS commiter** dans Git
- **Différent en production** vs développement

### **Token dans les Cookies**
📍 **Fichier : `src/auth/auth.controller.ts`** (ligne 125)

Le token est aussi stocké dans un cookie `access_token` (httpOnly, secure en production).

---

## 📊 Flux Complet

```
1. Client → POST /auth/login
   ↓
2. AuthController.login()
   ↓
3. AuthService.login() → jwtService.sign() → Token généré
   ↓
4. Token retourné dans JSON : { access_token: "..." }
   ↓
5. Client stocke le token
   ↓
6. Client → GET /academy/me + Header: Authorization: Bearer <token>
   ↓
7. JwtAuthGuard → JwtStrategy.validate() → Vérifie le token
   ↓
8. Si valide → req.user contient { userId, email, role }
   ↓
9. Controller retourne les données
```

---

## ❓ Questions Fréquentes

### **Q : Où sont stockés les tokens dans la base de données ?**
**R :** Nulle part ! Les tokens JWT sont **stateless** (sans état). Ils contiennent toutes les infos nécessaires dans le payload.

### **Q : Comment invalider un token ?**
**R :** Les tokens JWT sont invalides quand ils expirent (1h par défaut). Pour invalider avant expiration, il faut implémenter une blacklist (non implémenté actuellement).

### **Q : Où trouver JWT_SECRET ?**
**R :** Dans le fichier `.env` à la racine du projet. Si non défini, une valeur par défaut est utilisée en développement.

### **Q : Le token est-il dans MongoDB ?**
**R :** Non, les tokens ne sont jamais stockés en base. Seuls les utilisateurs sont stockés.

---

## 🎯 Résumé

| Élément | Emplacement |
|---------|-------------|
| **Génération** | `src/auth/auth.service.ts` ligne 72 |
| **Retour au client** | `src/auth/auth.controller.ts` ligne 128 |
| **Configuration** | `src/auth/auth.module.ts` ligne 24 |
| **Validation** | `src/auth/strategies/jwt.strategy.ts` |
| **Clé secrète** | `.env` → `JWT_SECRET` |
| **Obtention** | POST `/api/v1/auth/login` → copier `access_token` |

---

**✅ Les tokens sont générés à la demande lors du login, pas stockés dans le projet !**

