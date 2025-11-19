# 🧪 Guide de Test Academy dans Swagger

## 📋 Attributs pour Tester dans Swagger

---

## 🎯 1. PUT /api/v1/academy/me (Mettre à jour le profil)

### **Exemple Complet avec Tous les Attributs**

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

### **Exemple Minimal (Seulement le nom)**

```json
{
  "academyName": "Académie de Football Paris"
}
```

---

### **Exemple avec Quelques Attributs**

```json
{
  "academyName": "Académie de Football Lyon",
  "address": "456 Avenue des Sports, 69001 Lyon",
  "phone": "+33456789123",
  "categories": ["U10", "U12"]
}
```

---

### **Exemple avec Logo et Catégories**

```json
{
  "academyName": "Académie de Football Marseille",
  "logoUrl": "https://i.imgur.com/logo-academy.png",
  "categories": ["U10", "U12", "U15", "U18", "SENIOR"]
}
```

---

### **Exemple Complet avec Responsable**

```json
{
  "academyName": "Académie de Football Nice",
  "logoUrl": "https://example.com/nice-logo.jpg",
  "address": "789 Boulevard de la Promenade, 06000 Nice",
  "phone": "+33987654321",
  "responsableName": "Marie Martin",
  "categories": ["U8", "U10", "U12", "U15"]
}
```

---

## 📝 Attributs Disponibles (Format JSON)

| Attribut | Type | Obligatoire | Exemple |
|----------|------|-------------|---------|
| `academyName` | string | ❌ | `"Académie de Football Paris"` |
| `logoUrl` | string | ❌ | `"https://example.com/logo.png"` |
| `address` | string | ❌ | `"123 Rue de la République, 75001 Paris"` |
| `phone` | string | ❌ | `"+33123456789"` |
| `responsableName` | string | ❌ | `"Jean Dupont"` |
| `categories` | string[] | ❌ | `["U10", "U12", "U15"]` |

---

## 🧪 Étapes pour Tester dans Swagger

### **Étape 1 : Se Connecter**

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
6. **Copiez le `access_token`** de la réponse

---

### **Étape 2 : Autoriser**

1. Cliquez sur **"Authorize"** (en haut à droite)
2. Collez le token dans le champ **"access-token"**
3. Cliquez **"Authorize"** puis **"Close"**
4. Vérifiez que le cadenas est vert 🔒

---

### **Étape 3 : Voir le Profil Actuel**

1. Section **Academy** → **GET /api/v1/academy/me**
2. Cliquez **"Try it out"**
3. Cliquez **"Execute"**
4. **Notez les valeurs actuelles** (ou `null` si vide)

---

### **Étape 4 : Mettre à Jour le Profil**

1. Section **Academy** → **PUT /api/v1/academy/me**
2. Cliquez **"Try it out"**
3. Dans le champ de texte, **collez un des exemples JSON ci-dessus**
4. Cliquez **"Execute"**
5. Vérifiez la réponse `200 OK`

---

### **Étape 5 : Vérifier les Modifications**

1. **Refaites GET /api/v1/academy/me**
2. Vérifiez que les données ont été mises à jour

---

## 📋 Exemples de Catégories

### **Catégories Standard**

```json
{
  "categories": ["U8", "U10", "U12", "U15", "U18", "SENIOR"]
}
```

### **Catégories Minimales**

```json
{
  "categories": ["U10", "U12"]
}
```

### **Catégories Personnalisées**

```json
{
  "categories": ["U9", "U11", "U13", "U16", "U19"]
}
```

### **Sans Catégories**

```json
{
  "academyName": "Académie Test",
  "categories": []
}
```

---

## 🔄 Scénarios de Test

### **Test 1 : Création Initiale**

```json
{
  "academyName": "Ma Première Académie",
  "address": "1 Rue Test, 75001 Paris",
  "phone": "+33123456789",
  "responsableName": "Test User",
  "categories": ["U10"]
}
```

---

### **Test 2 : Mise à Jour Partielle**

Mettez à jour seulement certains champs :

```json
{
  "academyName": "Académie Modifiée",
  "phone": "+33987654321"
}
```

**✅ Résultat attendu :** Seuls `academyName` et `phone` sont modifiés, les autres restent inchangés.

---

### **Test 3 : Ajout de Logo**

```json
{
  "logoUrl": "https://i.imgur.com/example-logo.png"
}
```

---

### **Test 4 : Modification des Catégories**

```json
{
  "categories": ["U10", "U12", "U15", "U18", "SENIOR"]
}
```

---

### **Test 5 : Mise à Jour Complète**

```json
{
  "academyName": "Académie de Football Excellence",
  "logoUrl": "https://example.com/excellence-logo.png",
  "address": "999 Avenue du Football, 75016 Paris, France",
  "phone": "+33111222333",
  "responsableName": "Pierre Excellence",
  "categories": ["U8", "U10", "U12", "U15", "U18", "SENIOR"]
}
```

---

## 📊 Réponse Attendue (GET /api/v1/academy/me)

Après la mise à jour, vous devriez voir :

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
  "updatedAt": "2024-01-15T14:45:00.000Z",
  "user": {
    "_id": "67abc123def456789",
    "email": "academy@example.com",
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

## ❌ Erreurs Possibles

### **Erreur 401 Unauthorized**
**Cause :** Token invalide ou expiré  
**Solution :** Reconnectez-vous et réautorisez

### **Erreur 403 Forbidden**
**Cause :** Votre utilisateur n'a pas le rôle `ACADEMY`  
**Solution :** Vérifiez que vous êtes connecté avec un compte `ACADEMY`

### **Erreur 400 Bad Request**
**Cause :** Format JSON invalide ou type incorrect  
**Solution :** Vérifiez que :
- Le JSON est valide (pas de virgule en trop)
- `categories` est un tableau : `["U10"]` et non `"U10"`
- Les chaînes sont entre guillemets

---

## ✅ Checklist de Test

- [ ] Connecté avec un compte `ACADEMY`
- [ ] Token autorisé dans Swagger (cadenas vert 🔒)
- [ ] GET /api/v1/academy/me fonctionne
- [ ] PUT /api/v1/academy/me avec un attribut fonctionne
- [ ] PUT /api/v1/academy/me avec tous les attributs fonctionne
- [ ] Vérification : GET /api/v1/academy/me affiche les modifications
- [ ] Test de mise à jour partielle fonctionne
- [ ] Test avec catégories multiples fonctionne

---

## 🎯 Exemples Prêts à Copier-Coller

### **Exemple 1 : Académie Complète**
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

### **Exemple 2 : Académie Simple**
```json
{
  "academyName": "Académie Test",
  "address": "1 Rue Test, 75001 Paris",
  "categories": ["U10", "U12"]
}
```

### **Exemple 3 : Seulement le Nom**
```json
{
  "academyName": "Mon Académie"
}
```

### **Exemple 4 : Avec Logo et Responsable**
```json
{
  "academyName": "Académie Excellence",
  "logoUrl": "https://i.imgur.com/logo.png",
  "responsableName": "Marie Dupont",
  "categories": ["U8", "U10", "U12", "U15"]
}
```

---

**🎉 Copiez-collez ces exemples directement dans Swagger pour tester !**

