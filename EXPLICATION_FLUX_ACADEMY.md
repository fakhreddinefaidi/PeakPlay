# 🔄 Explication du Flux : Register → Login → Profil Académie

## ❓ Question

**Si je fais register puis login, est-ce que je trouve les données affichées et enregistrées dans le profil ?**

## ✅ Réponse

**OUI !** Voici comment ça fonctionne :

---

## 📋 Flux Complet

### 1️⃣ **Register** (`POST /api/v1/auth/register`)

Quand vous créez un compte avec `role: "ACADEMY"` :

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

**Ce qui se passe :**
- ✅ Un utilisateur est créé dans la collection `users` avec `role: "ACADEMY"`
- ❌ **AUCUN** profil académie n'est créé dans la collection `academies` à ce moment-là

---

### 2️⃣ **Login** (`POST /api/v1/auth/login`)

Quand vous vous connectez :

```json
{
  "email": "academy@test.com",
  "password": "password123"
}
```

**Ce qui se passe :**
- ✅ Vous recevez un token JWT contenant :
  - `userId` : L'ID de votre utilisateur
  - `email` : Votre email
  - `role` : "ACADEMY"

**Réponse :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "academy@test.com",
    "role": "ACADEMY",
    ...
  }
}
```

---

### 3️⃣ **GET /api/v1/academy/me** - Récupérer le profil

**🎯 C'EST ICI QUE LA MAGIE OPÈRE !**

Quand vous appelez `GET /api/v1/academy/me` avec votre token :

**Ce qui se passe automatiquement :**

1. Le système vérifie si un profil académie existe pour votre `userId`
2. **Si le profil n'existe pas** → Il est **créé automatiquement** (vide) !
3. **Si le profil existe** → Il est retourné tel quel

**Réponse (première fois) :**
```json
{
  "_id": "...",
  "userId": "VOTRE_USER_ID",
  "academyName": null,
  "logoUrl": null,
  "address": null,
  "phone": null,
  "responsableName": null,
  "categories": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**✅ Vous recevez toujours une réponse, même si le profil est vide !**

---

### 4️⃣ **PUT /api/v1/academy/me** - Mettre à jour le profil

Maintenant, vous pouvez remplir votre profil :

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

**Réponse :**
```json
{
  "_id": "...",
  "userId": "VOTRE_USER_ID",
  "academyName": "Académie de Football Paris",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Rue de la République, 75001 Paris",
  "phone": "+33123456789",
  "responsableName": "Jean Dupont",
  "categories": ["U10", "U12", "U15"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

---

## 🎯 Résumé

| Étape | Action | Profil Académie |
|-------|--------|-----------------|
| 1. Register | Création du compte | ❌ N'existe pas encore |
| 2. Login | Obtention du token | ❌ N'existe pas encore |
| 3. GET /academy/me | Première récupération | ✅ **Créé automatiquement (vide)** |
| 4. PUT /academy/me | Mise à jour | ✅ Rempli avec vos données |
| 5. GET /academy/me | Récupération suivante | ✅ Retourne vos données |

---

## 💡 Avantages de cette Approche

1. **Pas besoin de créer le profil manuellement** - Il est créé automatiquement au premier accès
2. **Pas d'erreur 404** - Vous recevez toujours une réponse, même si le profil est vide
3. **Flexibilité** - Vous pouvez commencer à utiliser l'API immédiatement après le login
4. **Simplicité** - Un seul appel suffit pour voir votre profil (même vide)

---

## 🧪 Test Rapide

```bash
# 1. Register
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Académie","nom":"Test","email":"academy@test.com","password":"password123","age":"2000-01-01","tel":123456789,"role":"ACADEMY"}'

# 2. Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"academy@test.com","password":"password123"}'
# → Copiez le token

# 3. GET /academy/me (crée automatiquement le profil vide)
curl -X GET http://localhost:3001/api/v1/academy/me \
  -H "Authorization: Bearer VOTRE_TOKEN"
# → Réponse avec profil vide

# 4. PUT /academy/me (remplit le profil)
curl -X PUT http://localhost:3001/api/v1/academy/me \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"academyName":"Académie de Football Paris","categories":["U10","U12"]}'

# 5. GET /academy/me (retourne le profil rempli)
curl -X GET http://localhost:3001/api/v1/academy/me \
  -H "Authorization: Bearer VOTRE_TOKEN"
# → Réponse avec vos données
```

---

## ✅ Conclusion

**OUI, après register + login, vous pouvez immédiatement accéder à votre profil académie !**

Le profil est créé automatiquement (vide) lors du premier appel à `GET /api/v1/academy/me`, puis vous pouvez le remplir avec `PUT /api/v1/academy/me`.

**Aucune étape manuelle n'est nécessaire !** 🎉

