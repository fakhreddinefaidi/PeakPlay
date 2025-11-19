# 📋 Attributs du Modèle Academy

## 🎯 Vue d'Ensemble

Le modèle **Academy** représente le profil d'une académie de football. Il contient les informations spécifiques à l'académie, liées à un utilisateur avec le rôle `ACADEMY`.

---

## 📊 Liste des Attributs

### 1️⃣ **`_id`** (ObjectId)
- **Type** : `ObjectId` (MongoDB)
- **Description** : Identifiant unique du profil académie (généré automatiquement)
- **Obligatoire** : ✅ Oui (automatique)
- **Modifiable** : ❌ Non
- **Exemple** : `"67abc123def456789"`

---

### 2️⃣ **`userId`** (string)
- **Type** : `string`
- **Description** : Référence vers l'ID de l'utilisateur (`User._id`) qui possède ce profil académie
- **Obligatoire** : ✅ Oui
- **Modifiable** : ❌ Non (unique, créé une seule fois)
- **Contrainte** : `unique: true`
- **Exemple** : `"67abc123def456789"`

**📌 Note** : Chaque utilisateur avec le rôle `ACADEMY` a un seul profil académie.

---

### 3️⃣ **`academyName`** (string)
- **Type** : `string`
- **Description** : Nom de l'académie de football
- **Obligatoire** : ✅ Oui (mais peut être `null` initialement)
- **Modifiable** : ✅ Oui
- **Exemple** : `"Académie de Football Paris"`
- **Validation** : Chaîne de caractères

**💡 Utilisation** : Nom officiel de l'académie affiché partout.

---

### 4️⃣ **`logoUrl`** (string, optionnel)
- **Type** : `string | null`
- **Description** : URL du logo de l'académie
- **Obligatoire** : ❌ Non (optionnel)
- **Modifiable** : ✅ Oui
- **Exemple** : `"https://example.com/logo.png"`
- **Validation** : Chaîne de caractères (URL)

**💡 Utilisation** : Image du logo à afficher sur le site/app.

---

### 5️⃣ **`address`** (string, optionnel)
- **Type** : `string | null`
- **Description** : Adresse complète de l'académie
- **Obligatoire** : ❌ Non (optionnel)
- **Modifiable** : ✅ Oui
- **Exemple** : `"123 Rue de la République, 75001 Paris, France"`
- **Validation** : Chaîne de caractères

**💡 Utilisation** : Adresse postale pour les tournois, événements, etc.

---

### 6️⃣ **`phone`** (string, optionnel)
- **Type** : `string | null`
- **Description** : Numéro de téléphone de l'académie
- **Obligatoire** : ❌ Non (optionnel)
- **Modifiable** : ✅ Oui
- **Exemple** : `"+33123456789"` ou `"0123456789"`
- **Validation** : Chaîne de caractères

**💡 Utilisation** : Contact téléphonique pour les joueurs/parents.

---

### 7️⃣ **`responsableName`** (string, optionnel)
- **Type** : `string | null`
- **Description** : Nom du responsable de l'académie
- **Obligatoire** : ❌ Non (optionnel)
- **Modifiable** : ✅ Oui
- **Exemple** : `"Jean Dupont"`
- **Validation** : Chaîne de caractères

**💡 Utilisation** : Nom de la personne responsable (directeur, manager, etc.).

---

### 8️⃣ **`categories`** (string[], optionnel)
- **Type** : `string[]` (tableau de chaînes)
- **Description** : Liste des catégories d'âge proposées par l'académie
- **Obligatoire** : ❌ Non (optionnel)
- **Valeur par défaut** : `[]` (tableau vide)
- **Modifiable** : ✅ Oui
- **Exemple** : `["U10", "U12", "U15", "U18"]`
- **Validation** : Tableau de chaînes de caractères

**💡 Utilisation** : 
- `U10` = Under 10 (moins de 10 ans)
- `U12` = Under 12 (moins de 12 ans)
- `U15` = Under 15 (moins de 15 ans)
- `U18` = Under 18 (moins de 18 ans)
- etc.

---

### 9️⃣ **`createdAt`** (Date)
- **Type** : `Date`
- **Description** : Date et heure de création du profil académie
- **Obligatoire** : ✅ Oui (automatique)
- **Modifiable** : ❌ Non
- **Valeur par défaut** : `Date.now` (date actuelle)
- **Exemple** : `"2024-01-15T10:30:00.000Z"`

**📌 Note** : Généré automatiquement par Mongoose avec `timestamps: true`.

---

### 🔟 **`updatedAt`** (Date)
- **Type** : `Date`
- **Description** : Date et heure de dernière modification du profil académie
- **Obligatoire** : ✅ Oui (automatique)
- **Modifiable** : ❌ Non (mis à jour automatiquement)
- **Valeur par défaut** : `Date.now` (date actuelle)
- **Exemple** : `"2024-01-15T14:45:00.000Z"`

**📌 Note** : Mis à jour automatiquement par Mongoose à chaque modification.

---

## 📝 Structure Complète du Modèle

```typescript
{
  _id: ObjectId,                    // ID unique (auto)
  userId: string,                    // Référence User._id (unique, obligatoire)
  academyName: string,               // Nom de l'académie (obligatoire)
  logoUrl?: string,                  // URL du logo (optionnel)
  address?: string,                  // Adresse (optionnel)
  phone?: string,                    // Téléphone (optionnel)
  responsableName?: string,          // Nom responsable (optionnel)
  categories?: string[],             // Catégories d'âge (optionnel, défaut: [])
  createdAt: Date,                   // Date création (auto)
  updatedAt: Date                    // Date modification (auto)
}
```

---

## 🔄 Attributs Modifiables via API

### **PUT /api/v1/academy/me**

Vous pouvez modifier ces attributs via le DTO `UpdateAcademyDto` :

✅ **Modifiables** :
- `academyName`
- `logoUrl`
- `address`
- `phone`
- `responsableName`
- `categories`

❌ **Non modifiables** :
- `_id`
- `userId`
- `createdAt`
- `updatedAt` (mis à jour automatiquement)

---

## 📋 Exemple de Données Complètes

```json
{
  "_id": "67abc123def456789",
  "userId": "67abc123def456789",
  "academyName": "Académie de Football Paris",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Rue de la République, 75001 Paris, France",
  "phone": "+33123456789",
  "responsableName": "Jean Dupont",
  "categories": ["U10", "U12", "U15", "U18"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:45:00.000Z"
}
```

---

## 📋 Exemple de Données Initiales (Profil Vide)

Lors de la création automatique du profil (premier appel à `GET /api/v1/academy/me`), le profil est créé avec :

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
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔗 Relation avec le Modèle User

Le profil Academy est **lié** à un utilisateur via `userId` :

```
User (role: "ACADEMY")
  └── Academy (userId: User._id)
```

**📌 Important** :
- Un utilisateur `ACADEMY` a **un seul** profil Academy
- Le profil Academy est créé automatiquement au premier accès
- Les données utilisateur (email, prenom, nom, etc.) sont dans le modèle `User`, pas dans `Academy`

---

## 📊 Réponse Complète de GET /api/v1/academy/me

L'endpoint retourne le profil Academy **+ les données utilisateur** :

```json
{
  // Attributs Academy
  "_id": "67abc123def456789",
  "userId": "67abc123def456789",
  "academyName": "Académie de Football Paris",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Rue de la République, 75001 Paris",
  "phone": "+33123456789",
  "responsableName": "Jean Dupont",
  "categories": ["U10", "U12", "U15"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:45:00.000Z",
  
  // Données utilisateur (ajoutées par le service)
  "user": {
    "_id": "67abc123def456789",
    "email": "academy@example.com",
    "prenom": "Académie",
    "nom": "Test",
    "age": "2000-01-01T00:00:00.000Z",
    "tel": 123456789,
    "role": "ACADEMY",
    "emailVerified": true,
    "picture": "https://example.com/photo.jpg",
    "provider": "google"
  }
}
```

---

## 📂 Fichiers du Modèle

| Fichier | Description |
|---------|-------------|
| `src/schemas/academy.schema.ts` | **Schéma Mongoose** (définition des attributs) |
| `src/academy/dto/update-academy.dto.ts` | **DTO de mise à jour** (attributs modifiables) |
| `src/academy/academy.service.ts` | **Service** (logique métier) |
| `src/academy/academy.controller.ts` | **Controller** (endpoints API) |

---

## ✅ Résumé des Attributs

| Attribut | Type | Obligatoire | Modifiable | Description |
|----------|------|-------------|------------|-------------|
| `_id` | ObjectId | ✅ | ❌ | ID unique |
| `userId` | string | ✅ | ❌ | Référence User |
| `academyName` | string | ✅* | ✅ | Nom académie |
| `logoUrl` | string? | ❌ | ✅ | URL logo |
| `address` | string? | ❌ | ✅ | Adresse |
| `phone` | string? | ❌ | ✅ | Téléphone |
| `responsableName` | string? | ❌ | ✅ | Nom responsable |
| `categories` | string[] | ❌ | ✅ | Catégories d'âge |
| `createdAt` | Date | ✅ | ❌ | Date création |
| `updatedAt` | Date | ✅ | ❌ | Date modification |

**\* `academyName` est obligatoire dans le schéma mais peut être `null` initialement.**

---

**🎯 Total : 10 attributs** (8 modifiables par l'utilisateur, 2 automatiques)

