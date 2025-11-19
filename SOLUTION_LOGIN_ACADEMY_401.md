# 🔧 Solution : Erreur 401 Login Academy

## ⚠️ Problème

Vous recevez une erreur `401 Unauthorized` avec "Email ou mot de passe incorrect" lors du login avec :
- Email : `faidifakhri9@gmail.com`
- Password : `12345688`
- URL : `https://peakplay-17.onrender.com`

---

## 🔍 Pourquoi ça ne Marche Pas ?

Le code vérifie **4 conditions** avant de permettre le login. Si **une seule** échoue → erreur 401.

### **Les 4 Vérifications :**

1. ✅ L'utilisateur existe dans la base de données
2. ✅ L'utilisateur a un mot de passe (pas OAuth uniquement)
3. ✅ **L'email est vérifié** (`emailVerified === true`) ← **PROBABLEMENT ÇA !**
4. ✅ Le mot de passe est correct

---

## 🎯 Solution Immédiate

### **Étape 1 : Créer le Compte sur Render**

L'utilisateur n'existe probablement pas dans la base de données de production.

```
POST https://peakplay-17.onrender.com/api/v1/auth/register

Body:
{
  "prenom": "Fakhreddine",
  "nom": "Faidi",
  "email": "faidifakhri9@gmail.com",
  "age": "2000-01-01",
  "tel": 123456789,
  "password": "12345688",
  "role": "ACADEMY"
}
```

**✅ Réponse attendue :** `201 Created`

---

### **Étape 2 : Vérifier l'Email (CRUCIAL !)**

**⚠️ C'EST LA CAUSE LA PLUS PROBABLE !**

Le code **exige** que `emailVerified === true` avant de permettre le login.

1. **Ouvrez votre boîte email** (`faidifakhri9@gmail.com`)
2. **Cherchez l'email de vérification** envoyé par Render
3. **Vérifiez aussi les spams** (dossier indésirables)
4. **Cliquez sur le lien de vérification** dans l'email

**Sans cette étape, le login ne fonctionnera JAMAIS !**

---

### **Étape 3 : Si l'Email n'est Pas Arrivé**

Renvoyez l'email de vérification :

```
POST https://peakplay-17.onrender.com/api/v1/auth/resend-verification

Body:
{
  "email": "faidifakhri9@gmail.com"
}
```

Puis vérifiez votre email et cliquez sur le lien.

---

### **Étape 4 : Se Connecter**

Une fois l'email vérifié :

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

## 🔍 Comment Identifier la Cause Exacte

### **Méthode 1 : Vérifier les Logs Render**

Dans Render Dashboard → Votre service → **"Logs"**, cherchez :

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
→ L'utilisateur existe, le problème est probablement l'email non vérifié.

**Si l'inscription réussit :**
→ L'utilisateur n'existait pas, vérifiez maintenant l'email et connectez-vous.

---

## 📋 Checklist de Résolution

- [ ] Compte créé sur Render (`POST /api/v1/auth/register`)
- [ ] Email de vérification reçu
- [ ] Lien de vérification cliqué dans l'email
- [ ] Email vérifié (`emailVerified: true`)
- [ ] Login testé avec les bons identifiants
- [ ] Logs Render vérifiés pour identifier la cause

---

## 💡 Cause la Plus Probable

**Dans 90% des cas, c'est l'email non vérifié !**

Le code vérifie à la ligne 43-45 de `auth.service.ts` :
```typescript
if (!user.emailVerified) {
  return null; // → Erreur 401
}
```

**Si vous avez créé le compte mais n'avez pas cliqué sur le lien de vérification, le login échouera toujours.**

---

## 🎯 Résumé Ultra-Rapide

1. **Créer le compte** sur Render (`POST /register`)
2. **Vérifier l'email** (cliquer sur le lien de vérification) ← **LE PLUS IMPORTANT !**
3. **Se connecter** (`POST /login`)

**Sans vérification de l'email, le login ne fonctionnera jamais !**

---

## 🔧 Si Rien Ne Fonctionne

1. **Vérifiez les logs Render** (c'est la source de vérité)
2. **Créez un nouveau compte** avec un email différent pour tester
3. **Vérifiez que l'email de vérification arrive bien** (spam aussi)
4. **Contactez le support** si le problème persiste

---

**🎯 En résumé : Vérifiez votre email de vérification, c'est probablement ça !**

