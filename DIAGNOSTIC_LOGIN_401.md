# 🔍 Diagnostic : Erreur 401 "Email ou mot de passe incorrect"

## ⚠️ Problème

Vous recevez une erreur `401 Unauthorized` avec le message "Email ou mot de passe incorrect" lors du login sur `https://peakplay-17.onrender.com`.

---

## 🔍 Causes Possibles

### **1. L'utilisateur n'existe pas dans la base de données de production**

**Problème :** La base de données MongoDB sur Render est différente de votre base de données locale.

**Solution :**
1. Créez un nouveau compte via `POST /api/v1/auth/register` sur Render
2. Vérifiez votre email pour confirmer le compte
3. Connectez-vous ensuite

---

### **2. L'email n'est pas vérifié**

**Problème :** Le code vérifie que `emailVerified === true` avant de permettre le login (ligne 43-46 de `auth.service.ts`).

**Solution :**
1. Vérifiez votre boîte email pour le lien de vérification
2. Ou utilisez `POST /api/v1/auth/resend-verification` pour renvoyer l'email
3. Cliquez sur le lien de vérification dans l'email

---

### **3. Le mot de passe est incorrect**

**Problème :** Le mot de passe saisi ne correspond pas au mot de passe hashé en base.

**Solution :**
1. Vérifiez que vous utilisez le bon mot de passe
2. Si vous avez oublié, créez un nouveau compte ou réinitialisez le mot de passe

---

### **4. L'utilisateur a été créé via OAuth (Google/Facebook)**

**Problème :** Si l'utilisateur a été créé via OAuth, il n'a pas de mot de passe et ne peut pas se connecter avec email/password.

**Solution :**
1. Utilisez le login OAuth (Google ou Facebook) au lieu de email/password
2. Ou créez un nouveau compte avec email/password

---

## 🧪 Étapes de Diagnostic

### **Étape 1 : Vérifier que l'utilisateur existe**

Testez l'inscription sur Render :

```bash
POST https://peakplay-17.onrender.com/api/v1/auth/register
```

Body :
```json
{
  "prenom": "Test",
  "nom": "User",
  "email": "faidifakhri9@gmail.com",
  "age": "2000-01-01",
  "tel": 123456789,
  "password": "123456",
  "role": "JOUEUR"
}
```

**Si vous obtenez une erreur "Un utilisateur avec cet email existe déjà"** → L'utilisateur existe, passez à l'étape 2.

**Si l'inscription réussit** → Vérifiez votre email et connectez-vous ensuite.

---

### **Étape 2 : Vérifier que l'email est vérifié**

Si l'utilisateur existe mais que le login échoue, l'email n'est peut-être pas vérifié.

**Solution :**
1. Vérifiez votre boîte email (spam aussi)
2. Cherchez l'email de vérification de Render
3. Cliquez sur le lien de vérification

**Ou renvoyez l'email de vérification :**

```bash
POST https://peakplay-17.onrender.com/api/v1/auth/resend-verification
```

Body :
```json
{
  "email": "faidifakhri9@gmail.com"
}
```

---

### **Étape 3 : Vérifier les logs Render**

Dans Render Dashboard → Votre service → **"Logs"**, vous devriez voir :

```
[VALIDATE_USER] Recherche de l'utilisateur: faidifakhri9@gmail.com
[VALIDATE_USER] Utilisateur non trouvé: faidifakhri9@gmail.com
```

ou

```
[VALIDATE_USER] Email non vérifié: faidifakhri9@gmail.com
```

ou

```
[VALIDATE_USER] Mot de passe invalide pour: faidifakhri9@gmail.com
```

**Ces logs vous diront exactement pourquoi le login échoue.**

---

## ✅ Solutions par Scénario

### **Scénario 1 : Nouveau compte sur Render**

1. **Créer le compte :**
   ```bash
   POST /api/v1/auth/register
   {
     "email": "faidifakhri9@gmail.com",
     "password": "123456",
     ...
   }
   ```

2. **Vérifier l'email :**
   - Vérifiez votre boîte email
   - Cliquez sur le lien de vérification

3. **Se connecter :**
   ```bash
   POST /api/v1/auth/login
   {
     "email": "faidifakhri9@gmail.com",
     "password": "123456"
   }
   ```

---

### **Scénario 2 : Compte existant mais email non vérifié**

1. **Renvoyer l'email de vérification :**
   ```bash
   POST /api/v1/auth/resend-verification
   {
     "email": "faidifakhri9@gmail.com"
   }
   ```

2. **Vérifier l'email et cliquer sur le lien**

3. **Se connecter**

---

### **Scénario 3 : Mot de passe oublié**

1. **Créer un nouveau compte** (si l'email n'est pas déjà utilisé)
2. **Ou** implémenter une fonctionnalité de réinitialisation de mot de passe

---

### **Scénario 4 : Utilisateur créé via OAuth**

1. **Utiliser le login OAuth :**
   ```
   GET https://peakplay-17.onrender.com/api/v1/auth/google
   ```
   ou
   ```
   GET https://peakplay-17.onrender.com/api/v1/auth/facebook
   ```

2. **Ou créer un nouveau compte avec email/password**

---

## 🔧 Code Actuel (Validation)

Le code vérifie dans cet ordre :

1. ✅ L'utilisateur existe
2. ✅ L'utilisateur a un mot de passe (pas OAuth)
3. ✅ L'email est vérifié (`emailVerified === true`)
4. ✅ Le mot de passe est correct

**Si une de ces conditions échoue, vous obtenez "Email ou mot de passe incorrect".**

---

## 📋 Checklist de Résolution

- [ ] L'utilisateur existe dans la base de données de production
- [ ] L'email est vérifié (`emailVerified: true`)
- [ ] Le mot de passe est correct
- [ ] L'utilisateur n'a pas été créé via OAuth uniquement
- [ ] Les logs Render ont été vérifiés pour identifier la cause exacte

---

## 🎯 Solution Rapide

**Pour tester rapidement :**

1. **Créer un nouveau compte sur Render :**
   ```
   POST https://peakplay-17.onrender.com/api/v1/auth/register
   ```

2. **Vérifier l'email** (cliquer sur le lien)

3. **Se connecter :**
   ```
   POST https://peakplay-17.onrender.com/api/v1/auth/login
   ```

---

## 💡 Conseils

- **Les bases de données sont séparées :** La base de données locale est différente de celle de production
- **Vérifiez toujours l'email :** Le login ne fonctionne que si `emailVerified === true`
- **Consultez les logs Render :** Ils vous diront exactement pourquoi le login échoue
- **Testez avec un nouveau compte :** C'est souvent plus rapide que de diagnostiquer un compte existant

---

**🎯 En résumé : Créez un nouveau compte sur Render, vérifiez l'email, puis connectez-vous !**

