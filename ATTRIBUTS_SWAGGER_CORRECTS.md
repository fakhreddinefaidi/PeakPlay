# ✅ Attributs Corrects pour Swagger

## ⚠️ Erreur Commune

**❌ NE PAS utiliser les attributs de l'académie dans `POST /api/v1/auth/register`**

Les attributs comme `academyName`, `logoUrl`, `address`, etc. ne sont **PAS** acceptés dans l'endpoint de registration.

---

## 📋 1. POST /api/v1/auth/register (Créer un Compte)

### **Attributs Acceptés (CreateUserDto)**

```json
{
  "prenom": "Académie",
  "nom": "Test",
  "email": "academy@test.com",
  "age": "2000-01-01",
  "tel": 123456789,
  "password": "password123",
  "role": "ACADEMY"
}
```

### **Détails des Attributs**

| Attribut | Type | Obligatoire | Exemple |
|----------|------|-------------|---------|
| `prenom` | string | ✅ Oui | `"Académie"` |
| `nom` | string | ✅ Oui | `"Test"` |
| `email` | string | ✅ Oui | `"academy@test.com"` |
| `age` | string (Date) | ✅ Oui | `"2000-01-01"` |
| `tel` | number | ✅ Oui | `123456789` |
| `password` | string | ✅ Oui | `"password123"` |
| `role` | string | ✅ Oui | `"ACADEMY"` (ou `"JOUEUR"`, `"ARBITRE"`) |

### **Exemple Complet pour Register**

```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@academy.com",
  "age": "1985-05-15",
  "tel": 612345678,
  "password": "MonMotDePasse123!",
  "role": "ACADEMY"
}
```

---

## 📋 2. PUT /api/v1/academy/me (Mettre à Jour le Profil Académie)

### **⚠️ IMPORTANT : Utiliser APRÈS Login**

Ces attributs doivent être utilisés **APRÈS** avoir :
1. Créé le compte (POST /auth/register)
2. Connecté (POST /auth/login)
3. Autorisé dans Swagger (bouton "Authorize")

### **Attributs Acceptés (UpdateAcademyDto)**

```json
{
  "academyName": "Académie de Football Paris",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Rue de la République, 75001 Paris, France",
  "phone": "+33123456789",
  "responsableName": "Jean Dupont",
  "categories": ["U10", "U12", "U15", "U18"]
}
```

### **Détails des Attributs**

| Attribut | Type | Obligatoire | Exemple |
|----------|------|-------------|---------|
| `academyName` | string | ❌ Non | `"Académie de Football Paris"` |
| `logoUrl` | string | ❌ Non | `"https://example.com/logo.png"` |
| `address` | string | ❌ Non | `"123 Rue de la République, 75001 Paris"` |
| `phone` | string | ❌ Non | `"+33123456789"` |
| `responsableName` | string | ❌ Non | `"Jean Dupont"` |
| `categories` | string[] | ❌ Non | `["U10", "U12", "U15"]` |

### **Exemple Minimal**

```json
{
  "academyName": "Mon Académie"
}
```

---

## 🔄 Flux Complet (Étape par Étape)

### **Étape 1 : Créer le Compte**

**Endpoint :** `POST /api/v1/auth/register`

**Body :**
```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@academy.com",
  "age": "1985-05-15",
  "tel": 612345678,
  "password": "MonMotDePasse123!",
  "role": "ACADEMY"
}
```

**✅ Réponse attendue :** `201 Created`

---

### **Étape 2 : Se Connecter**

**Endpoint :** `POST /api/v1/auth/login`

**Body :**
```json
{
  "email": "jean.dupont@academy.com",
  "password": "MonMotDePasse123!"
}
```

**✅ Réponse attendue :**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**📝 Copiez le `access_token` !**

---

### **Étape 3 : Autoriser dans Swagger**

1. Cliquez sur **"Authorize"** (en haut à droite)
2. Collez le token dans le champ **"access-token"**
3. Cliquez **"Authorize"** puis **"Close"**
4. Vérifiez le cadenas vert 🔒

---

### **Étape 4 : Voir le Profil (Optionnel)**

**Endpoint :** `GET /api/v1/academy/me`

**✅ Réponse attendue :**
```json
{
  "_id": "...",
  "userId": "...",
  "academyName": null,
  "logoUrl": null,
  "address": null,
  "phone": null,
  "responsableName": null,
  "categories": [],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "user": {
    "_id": "...",
    "email": "jean.dupont@academy.com",
    "prenom": "Jean",
    "nom": "Dupont",
    ...
  }
}
```

---

### **Étape 5 : Mettre à Jour le Profil Académie**

**Endpoint :** `PUT /api/v1/academy/me`

**Body :**
```json
{
  "academyName": "Académie de Football Paris",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Rue de la République, 75001 Paris, France",
  "phone": "+33123456789",
  "responsableName": "Jean Dupont",
  "categories": ["U10", "U12", "U15", "U18"]
}
```

**✅ Réponse attendue :** `200 OK` avec le profil mis à jour

---

## ❌ Erreurs Courantes

### **Erreur 1 : Utiliser les Attributs Académie dans Register**

**❌ MAUVAIS :**
```json
{
  "academyName": "Académie de Football Paris",
  "logoUrl": "https://example.com/logo.png",
  "email": "test@test.com",
  "password": "password123"
}
```

**✅ BON :**
```json
{
  "prenom": "Académie",
  "nom": "Test",
  "email": "test@test.com",
  "age": "2000-01-01",
  "tel": 123456789,
  "password": "password123",
  "role": "ACADEMY"
}
```

---

### **Erreur 2 : Oublier les Champs Obligatoires dans Register**

**❌ MAUVAIS :**
```json
{
  "email": "test@test.com",
  "password": "password123"
}
```

**✅ BON :**
```json
{
  "prenom": "Test",
  "nom": "User",
  "email": "test@test.com",
  "age": "2000-01-01",
  "tel": 123456789,
  "password": "password123",
  "role": "ACADEMY"
}
```

---

### **Erreur 3 : Utiliser PUT /academy/me Sans Autorisation**

**❌ MAUVAIS :** Appeler `PUT /api/v1/academy/me` sans token

**✅ BON :** 
1. Se connecter d'abord
2. Autoriser dans Swagger
3. Ensuite appeler `PUT /api/v1/academy/me`

---

## 📊 Tableau Récapitulatif

| Endpoint | Attributs | Quand Utiliser |
|----------|-----------|----------------|
| `POST /api/v1/auth/register` | `prenom`, `nom`, `email`, `age`, `tel`, `password`, `role` | **Créer un nouveau compte** |
| `POST /api/v1/auth/login` | `email`, `password` | **Se connecter** |
| `GET /api/v1/academy/me` | Aucun (juste le token) | **Voir le profil** |
| `PUT /api/v1/academy/me` | `academyName`, `logoUrl`, `address`, `phone`, `responsableName`, `categories` | **Mettre à jour le profil académie** |

---

## ✅ Exemples Prêts à Copier-Coller

### **Exemple 1 : Register (Créer un Compte ACADEMY)**

```json
{
  "prenom": "Académie",
  "nom": "Test",
  "email": "academy@test.com",
  "age": "2000-01-01",
  "tel": 123456789,
  "password": "password123",
  "role": "ACADEMY"
}
```

---

### **Exemple 2 : Login (Se Connecter)**

```json
{
  "email": "academy@test.com",
  "password": "password123"
}
```

---

### **Exemple 3 : Update Academy Profile (Mettre à Jour)**

```json
{
  "academyName": "Académie de Football Paris",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Rue de la République, 75001 Paris, France",
  "phone": "+33123456789",
  "responsableName": "Jean Dupont",
  "categories": ["U10", "U12", "U15", "U18"]
}
```

---

## 🎯 Résumé

1. **Register** = Créer le compte utilisateur (avec `prenom`, `nom`, `email`, etc.)
2. **Login** = Obtenir le token
3. **Authorize** = Coller le token dans Swagger
4. **PUT /academy/me** = Ajouter les infos de l'académie (`academyName`, `logoUrl`, etc.)

**⚠️ Les attributs de l'académie ne vont PAS dans register, ils vont dans PUT /academy/me !**

---

**🎉 Utilisez ces exemples directement dans Swagger !**

