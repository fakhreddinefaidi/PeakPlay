# 🔍 Pourquoi le Login Academy ne Marche Pas

## ⚠️ Problème

Vous recevez une erreur `401 Unauthorized` avec "Email ou mot de passe incorrect" lors du login avec un compte Academy.

---

## 🔍 Les 4 Raisons Possibles

Le code vérifie **4 conditions** avant de permettre le login. Si **une seule** échoue, vous obtenez l'erreur 401.

### **1️⃣ L'utilisateur n'existe pas dans la base de données**

**Vérification :** Ligne 30-32 de `auth.service.ts`
```typescript
if (!user) {
  return null; // → Erreur 401
}
```

**Cause :** La base de données MongoDB sur Render est **différente** de votre base locale.

**Solution :**
1. Créez un nouveau compte Academy sur Render :
   ```
   POST https://peakplay-17.onrender.com/api/v1/auth/register
   {
     "prenom": "Académie",
     "nom": "Test",
     "email": "faidifakhri9@gmail.com",
     "age": "2000-01-01",
     "tel": 123456789,
     "password": "12345688",
     "role": "ACADEMY"
   }
   ```

---

### **2️⃣ L'utilisateur n'a pas de mot de passe (créé via OAuth)**

**Vérification :** Ligne 36-38 de `auth.service.ts`
```typescript
if (!user.password) {
  return null; // → Erreur 401
}
```

**Cause :** Si l'utilisateur a été créé via Google/Facebook OAuth, il n'a pas de mot de passe.

**Solution :**
1. Utilisez le login OAuth (Google ou Facebook)
2. OU créez un nouveau compte avec email/password

---

### **3️⃣ L'email n'est PAS vérifié**

**Vérification :** Ligne 43-45 de `auth.service.ts`
```typescript
if (!user.emailVerified) {
  return null; // → Erreur 401
}
```

**⚠️ C'EST PROBABLEMENT ÇA !**

**Cause :** Le code **exige** que `emailVerified === true` avant de permettre le login.

**Solution :**
1. **Vérifiez votre boîte email** (spam aussi)
2. **Cherchez l'email de vérification** envoyé lors de l'inscription
3. **Cliquez sur le lien de vérification** dans l'email

**OU renvoyez l'email de vérification :**
```
POST https://peakplay-17.onrender.com/api/v1/auth/resend-verification
{
  "email": "faidifakhri9@gmail.com"
}
```

---

### **4️⃣ Le mot de passe est incorrect**

**Vérification :** Ligne 51-53 de `auth.service.ts`
```typescript
if (!isPasswordValid) {
  return null; // → Erreur 401
}
```

**Cause :** Le mot de passe saisi ne correspond pas au mot de passe hashé en base.

**Solution :**
1. Vérifiez que vous utilisez le **bon mot de passe**
2. Si vous avez oublié, créez un nouveau compte

---

## 🎯 Solution Rapide (Étape par Étape)

### **Étape 1 : Créer un Compte Academy sur Render**

```
POST https://peakplay-17.onrender.com/api/v1/auth/register

Body:
{
  "prenom": "Académie",
  "nom": "Test",
  "email": "faidifakhri9@gmail.com",
  "age": "2000-01-01",
  "tel": 123456789,
  "password": "12345688",
  "role": "ACADEMY"
}
```

**✅ Réponse attendue :** `201 Created`

---

### **Étape 2 : Vérifier l'Email**

1. **Ouvrez votre boîte email** (`faidifakhri9@gmail.com`)
2. **Cherchez l'email de vérification** (vérifiez aussi les spams)
3. **Cliquez sur le lien de vérification** dans l'email

**⚠️ IMPORTANT :** Sans vérification de l'email, le login **ne fonctionnera pas** !

---

### **Étape 3 : Se Connecter**

```
POST https://peakplay-17.onrender.com/api/v1/auth/login

Body:
{
  "email": "faidifakhri9@gmail.com",
  "password": "12345688"
}
```

**✅ Réponse attendue :** `200 OK` avec `access_token`

---

## 🔍 Comment Savoir la Cause Exacte

### **Méthode 1 : Vérifier les Logs Render**

Dans Render Dashboard → Votre service → **"Logs"**, vous verrez :

**Si l'utilisateur n'existe pas :**
```
[VALIDATE_USER] Recherche de l'utilisateur: faidifakhri9@gmail.com
[VALIDATE_USER] Utilisateur non trouvé: faidifakhri9@gmail.com
```

**Si l'email n'est pas vérifié :**
```
[VALIDATE_USER] Recherche de l'utilisateur: faidifakhri9@gmail.com
[VALIDATE_USER] Email non vérifié: faidifakhri9@gmail.com
```

**Si le mot de passe est incorrect :**
```
[VALIDATE_USER] Recherche de l'utilisateur: faidifakhri9@gmail.com
[VALIDATE_USER] Vérification du mot de passe pour: faidifakhri9@gmail.com
[VALIDATE_USER] Mot de passe invalide pour: faidifakhri9@gmail.com
```

**Ces logs vous diront exactement pourquoi le login échoue !**

---

### **Méthode 2 : Tester l'Inscription**

Essayez de créer le compte :

```
POST https://peakplay-17.onrender.com/api/v1/auth/register
{
  "email": "faidifakhri9@gmail.com",
  ...
}
```

**Si vous obtenez :** `"Un utilisateur avec cet email existe déjà"`
→ L'utilisateur existe, le problème est probablement l'email non vérifié ou le mot de passe incorrect.

**Si l'inscription réussit :**
→ L'utilisateur n'existait pas, vérifiez maintenant l'email et connectez-vous.

---

## 📋 Checklist de Diagnostic

- [ ] L'utilisateur existe dans la base de données de production (Render)
- [ ] L'email est vérifié (`emailVerified: true`)
- [ ] Le mot de passe est correct
- [ ] L'utilisateur n'a pas été créé uniquement via OAuth
- [ ] Les logs Render ont été vérifiés pour identifier la cause exacte

---

## 💡 Cause la Plus Probable

**Dans 90% des cas, c'est l'email non vérifié !**

Le code **exige** que `emailVerified === true` avant de permettre le login. Si vous avez créé le compte mais n'avez pas cliqué sur le lien de vérification dans l'email, le login échouera.

**Solution :**
1. Vérifiez votre boîte email
2. Cliquez sur le lien de vérification
3. OU renvoyez l'email de vérification via `POST /api/v1/auth/resend-verification`

---

## 🎯 Résumé

**Pourquoi le login Academy ne marche pas :**

1. ❌ L'utilisateur n'existe pas → **Créer le compte**
2. ❌ L'email n'est pas vérifié → **Vérifier l'email** (cause la plus probable)
3. ❌ Le mot de passe est incorrect → **Vérifier le mot de passe**
4. ❌ Utilisateur créé via OAuth → **Utiliser OAuth ou créer un nouveau compte**

**Solution rapide :**
1. Créer le compte sur Render
2. Vérifier l'email (cliquer sur le lien)
3. Se connecter

---

**🎯 En résumé : Vérifiez votre email de vérification, c'est probablement ça !**

