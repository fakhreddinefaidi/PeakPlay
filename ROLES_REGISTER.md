# 🎭 Rôles Disponibles lors du Register

## 📋 Rôles Acceptés

Lors de l'inscription (`POST /api/v1/auth/register`), vous pouvez utiliser **3 rôles** :

| Rôle | Description | Exemple d'Utilisation |
|------|-------------|----------------------|
| `"JOUEUR"` | Joueur de football | Un joueur qui veut rejoindre des équipes |
| `"ACADEMY"` | Académie de football | Une académie qui gère des équipes et tournois |
| `"ARBITRE"` | Arbitre de football | Un arbitre qui officie lors des matchs |

---

## ✅ Exemples pour Chaque Rôle

### 1️⃣ **Rôle : JOUEUR**

```json
{
  "prenom": "Wassim",
  "nom": "Abdelli",
  "email": "wassim@test.com",
  "age": "2005-03-15",
  "tel": 612345678,
  "password": "password123",
  "role": "JOUEUR"
}
```

**💡 Utilisation :** Pour créer un compte joueur qui pourra rejoindre des équipes.

---

### 2️⃣ **Rôle : ACADEMY**

```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "academy@test.com",
  "age": "1985-05-20",
  "tel": 612345678,
  "password": "password123",
  "role": "ACADEMY"
}
```

**💡 Utilisation :** Pour créer un compte académie qui pourra :
- Gérer son profil académie
- Créer des équipes
- Gérer des tournois
- Accepter/refuser des demandes de joueurs

**📌 Important :** Après le register avec `role: "ACADEMY"`, vous devrez utiliser `PUT /api/v1/academy/me` pour remplir les informations de l'académie (academyName, logoUrl, etc.).

---

### 3️⃣ **Rôle : ARBITRE**

```json
{
  "prenom": "Marie",
  "nom": "Martin",
  "email": "arbitre@test.com",
  "age": "1990-07-10",
  "tel": 612345678,
  "password": "password123",
  "role": "ARBITRE"
}
```

**💡 Utilisation :** Pour créer un compte arbitre qui pourra être assigné à des matchs.

---

## ⚠️ Rôles NON Acceptés

Ces valeurs **ne fonctionneront PAS** :

❌ `"ADMIN"`  
❌ `"OWNER"`  
❌ `"COACH"`  
❌ `"MANAGER"`  
❌ `"joueur"` (minuscules)  
❌ `"Academy"` (majuscule/minuscule incorrect)  
❌ `"ACADEMIE"` (ancien nom, maintenant c'est `"ACADEMY"`)

**✅ Utilisez EXACTEMENT :** `"JOUEUR"`, `"ACADEMY"`, ou `"ARBITRE"` (en majuscules)

---

## 📝 Format Exact

Le champ `role` doit être :
- **Type :** `string`
- **Valeur :** Exactement l'une de ces 3 chaînes (sensible à la casse)
- **Obligatoire :** ✅ Oui

**Exemples valides :**
```json
"role": "JOUEUR"    ✅
"role": "ACADEMY"   ✅
"role": "ARBITRE"   ✅
```

**Exemples invalides :**
```json
"role": "joueur"    ❌ (minuscules)
"role": "Joueur"    ❌ (majuscule/minuscule)
"role": "ACADEMIE"  ❌ (ancien nom)
"role": "ADMIN"     ❌ (n'existe pas)
```

---

## 🎯 Exemples Complets pour Swagger

### **Exemple 1 : Créer un Joueur**

```json
{
  "prenom": "Ahmed",
  "nom": "Ben Ali",
  "email": "ahmed.benali@test.com",
  "age": "2008-06-20",
  "tel": 612345678,
  "password": "MonMotDePasse123!",
  "role": "JOUEUR"
}
```

---

### **Exemple 2 : Créer une Académie**

```json
{
  "prenom": "Académie",
  "nom": "Paris Football",
  "email": "paris.football@academy.com",
  "age": "2000-01-01",
  "tel": 612345678,
  "password": "AcademyPass123!",
  "role": "ACADEMY"
}
```

**📌 Après ce register :**
1. Connectez-vous avec `POST /api/v1/auth/login`
2. Autorisez dans Swagger
3. Utilisez `PUT /api/v1/academy/me` pour ajouter :
   ```json
   {
     "academyName": "Académie Paris Football",
     "logoUrl": "https://example.com/logo.png",
     "address": "123 Rue de Paris, 75001 Paris",
     "phone": "+33123456789",
     "responsableName": "Jean Dupont",
     "categories": ["U10", "U12", "U15"]
   }
   ```

---

### **Exemple 3 : Créer un Arbitre**

```json
{
  "prenom": "Sophie",
  "nom": "Lefebvre",
  "email": "sophie.lefebvre@arbitre.com",
  "age": "1992-04-12",
  "tel": 612345678,
  "password": "ArbitrePass123!",
  "role": "ARBITRE"
}
```

---

## 🔍 Validation dans le Code

Le rôle est validé avec cette règle :

```typescript
@IsEnum(['JOUEUR', 'ACADEMY', 'ARBITRE'])
role: string;
```

**Si vous utilisez un autre rôle, vous obtiendrez une erreur :**
```json
{
  "message": [
    "role must be one of the following values: JOUEUR, ACADEMY, ARBITRE"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 📊 Tableau Récapitulatif

| Rôle | Valeur Exacte | Accès aux Fonctionnalités |
|------|---------------|--------------------------|
| **Joueur** | `"JOUEUR"` | - Rejoindre des équipes<br>- Faire des demandes d'adhésion |
| **Académie** | `"ACADEMY"` | - Gérer le profil académie<br>- Créer des équipes<br>- Gérer des tournois<br>- Accepter/refuser des demandes |
| **Arbitre** | `"ARBITRE"` | - Être assigné à des matchs |

---

## ✅ Checklist pour Register

- [ ] `prenom` : string (obligatoire)
- [ ] `nom` : string (obligatoire)
- [ ] `email` : string, format email valide (obligatoire)
- [ ] `age` : string, format "YYYY-MM-DD" (obligatoire)
- [ ] `tel` : number (obligatoire)
- [ ] `password` : string (obligatoire)
- [ ] `role` : string, **EXACTEMENT** `"JOUEUR"`, `"ACADEMY"`, ou `"ARBITRE"` (obligatoire)

---

## 🎯 Résumé Ultra-Rapide

**Rôles disponibles :**
- ✅ `"JOUEUR"` - Pour les joueurs
- ✅ `"ACADEMY"` - Pour les académies
- ✅ `"ARBITRE"` - Pour les arbitres

**Format :** Toujours en **MAJUSCULES** et **exactement** comme écrit ci-dessus.

---

**🎉 Copiez-collez ces exemples directement dans Swagger !**

