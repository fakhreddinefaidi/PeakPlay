# 🔧 Résolution du Problème de Connexion MongoDB

## ❌ Problème Actuel

```
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
```

**Cause :** MongoDB n'est pas démarré ou n'est pas accessible sur `localhost:27017`

---

## ✅ Solutions

### Solution 1 : Utiliser MongoDB Atlas (Recommandé) ⭐

**Avantages :**
- ✅ Pas besoin d'installer MongoDB localement
- ✅ Gratuit jusqu'à 512 MB
- ✅ Fonctionne immédiatement
- ✅ Compatible avec Render

**Étapes :**

1. **Créer un compte MongoDB Atlas**
   - Allez sur : https://www.mongodb.com/cloud/atlas/register
   - Créez un compte gratuit

2. **Créer un cluster gratuit**
   - Choisissez "Free" (M0)
   - Sélectionnez une région proche
   - Créez le cluster

3. **Configurer l'accès**
   - **Database Access** : Créez un utilisateur avec un mot de passe
   - **Network Access** : Ajoutez `0.0.0.0/0` (tous les IPs) pour le développement

4. **Obtenir la chaîne de connexion**
   - Cliquez sur "Connect" → "Connect your application"
   - Copiez la chaîne de connexion
   - Format : `mongodb+srv://username:password@cluster.mongodb.net/dam_backend?retryWrites=true&w=majority`

5. **Configurer dans votre `.env`**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dam_backend?retryWrites=true&w=majority
   ```

---

### Solution 2 : Installer MongoDB Localement

**Pour Windows :**

1. **Télécharger MongoDB Community Server**
   - https://www.mongodb.com/try/download/community
   - Choisissez Windows et téléchargez l'installateur

2. **Installer MongoDB**
   - Exécutez l'installateur
   - Choisissez "Complete" installation
   - Cochez "Install MongoDB as a Service"
   - Cochez "Install MongoDB Compass" (optionnel)

3. **Démarrer MongoDB**
   ```powershell
   # Vérifier que le service est démarré
   Get-Service MongoDB
   
   # Si le service n'est pas démarré
   Start-Service MongoDB
   ```

4. **Vérifier la connexion**
   ```powershell
   # Tester la connexion
   mongosh
   ```

5. **Configurer dans votre `.env`**
   ```env
   MONGODB_URI=mongodb://localhost:27017/dam_backend
   ```

---

### Solution 3 : Utiliser Docker (Alternative)

**Si vous avez Docker installé :**

```powershell
# Démarrer MongoDB avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Vérifier que le conteneur est démarré
docker ps
```

Puis dans votre `.env` :
```env
MONGODB_URI=mongodb://localhost:27017/dam_backend
```

---

## 📝 Configuration du Fichier `.env`

Créez un fichier `.env` à la racine du projet avec :

```env
# MongoDB (choisissez une option)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dam_backend?retryWrites=true&w=majority
# OU
# MONGODB_URI=mongodb://localhost:27017/dam_backend

# JWT Secret (minimum 20 caractères)
JWT_SECRET=your-super-secret-jwt-key-minimum-20-characters

# Brevo API
BREVO_API_KEY=xkeysib-your-brevo-api-key
MAIL_FROM="DAM Backend <9b8f34001@smtp-brevo.com>"
BACKEND_URL=http://localhost:3001

# Environment
NODE_ENV=development
PORT=3001
```

---

## ✅ Vérification

Après avoir configuré MongoDB, redémarrez l'application :

```powershell
npm run start:dev
```

Vous devriez voir :
```
✅ Configuration Brevo API chargée
✅ Connexion MongoDB réussie
```

---

## 🎯 Recommandation

**Pour le développement :** Utilisez **MongoDB Atlas** (Solution 1)
- Plus simple
- Pas besoin d'installer quoi que ce soit
- Fonctionne immédiatement
- Compatible avec Render

**Pour la production :** Utilisez **MongoDB Atlas** ou votre propre instance MongoDB

---

## ⚠️ Note Importante

Le problème de connexion MongoDB est **indépendant** de la configuration email Brevo. La configuration email fonctionne correctement (vous voyez `✅ Configuration Brevo API chargée` dans les logs).

Une fois MongoDB configuré, tout fonctionnera ! 🚀

