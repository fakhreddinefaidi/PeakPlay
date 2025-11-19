# 🔧 Fix 502 Bad Gateway sur Render

## ❌ Problème

Vous voyez une erreur **502 Bad Gateway** sur `https://peakplay-17.onrender.com`

Cela signifie que Render ne peut pas communiquer avec votre application backend.

---

## 🔍 Diagnostic Étape par Étape

### 1️⃣ Vérifier les Logs Render

**C'est la première chose à faire !**

1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Sélectionnez votre service `peakplay-17`
3. Cliquez sur l'onglet **"Logs"**
4. Regardez les dernières lignes pour voir l'erreur exacte

**Erreurs courantes :**
- `Error: Cannot find module '...'` → Dépendance manquante
- `EADDRINUSE` → Port déjà utilisé
- `MongooseServerSelectionError` → Problème de connexion MongoDB
- `JWT_SECRET must be at least 20 characters` → Variable d'environnement manquante
- `Application failed to start` → Erreur au démarrage

---

### 2️⃣ Vérifier les Variables d'Environnement

Dans Render Dashboard → Votre service → **"Environment"**

**Variables OBLIGATOIRES :**
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre_secret_jwt_long_au_moins_20_caracteres
BACKEND_URL=https://peakplay-17.onrender.com
FRONTEND_URL=https://votre-frontend.onrender.com
```

**Variables pour Email (Brevo) :**
```env
BREVO_API_KEY=xkeysib-...
MAIL_FROM_EMAIL=faidifakhri9@gmail.com
MAIL_FROM_NAME=PeakPlay
```

**Variables pour OAuth (optionnel mais recommandé) :**
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://peakplay-17.onrender.com/api/v1/auth/google/callback
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
FACEBOOK_CALLBACK_URL=https://peakplay-17.onrender.com/api/v1/auth/facebook/callback
```

**⚠️ Points importants :**
- `PORT` doit être `10000` (Render utilise ce port)
- `BACKEND_URL` doit être l'URL complète de votre service Render (sans slash final)
- `JWT_SECRET` doit faire au moins 20 caractères en production

---

### 3️⃣ Vérifier le Build Command

Dans Render Dashboard → Votre service → **"Settings"** → **"Build Command"**

**Doit être :**
```bash
npm install && npm run build
```

**Ou si vous utilisez yarn :**
```bash
yarn install && yarn build
```

---

### 4️⃣ Vérifier le Start Command

Dans Render Dashboard → Votre service → **"Settings"** → **"Start Command"**

**Doit être :**
```bash
npm run start:prod
```

**Ou :**
```bash
node dist/main.js
```

---

### 5️⃣ Vérifier que le Code Compile Localement

```bash
# Dans votre projet local
npm run build
```

**Si ça échoue :**
- Corrigez les erreurs TypeScript
- Vérifiez que toutes les dépendances sont installées
- Vérifiez que tous les imports sont corrects

---

### 6️⃣ Vérifier MongoDB Atlas

**Si vous utilisez MongoDB Atlas :**

1. Vérifiez que votre IP est autorisée dans MongoDB Atlas
   - Network Access → Add IP Address → `0.0.0.0/0` (pour Render)
2. Vérifiez que votre utilisateur MongoDB a les bonnes permissions
3. Testez la connexion avec `MONGODB_URI` dans votre `.env` local

---

## 🛠️ Solutions Courantes

### Solution 1 : Redémarrer le Service

Parfois, un simple redémarrage résout le problème :

1. Render Dashboard → Votre service
2. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**

---

### Solution 2 : Vérifier le Port dans main.ts

Votre `src/main.ts` doit avoir :

```typescript
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const host = '0.0.0.0'; // Important pour Render

await app.listen(port, host);
```

**⚠️ Le host doit être `0.0.0.0` et non `localhost` !**

---

### Solution 3 : Vérifier les Modules Récemment Ajoutés

Si vous venez d'ajouter les modules Academy, Teams, etc., vérifiez que :

1. Tous les modules sont importés dans `app.module.ts`
2. Tous les schémas sont correctement définis
3. Toutes les dépendances sont dans `package.json`

**Vérifiez que `app.module.ts` contient :**
```typescript
imports: [
  // ... autres modules
  AcademyModule,
  TeamsModule,
  JoinRequestsModule,
  TournamentsModule,
  RefereesModule,
]
```

---

### Solution 4 : Vérifier les Erreurs de Compilation

Si le build échoue sur Render :

1. Regardez les logs de build dans Render
2. Vérifiez que `package.json` contient toutes les dépendances
3. Vérifiez que `tsconfig.json` est correct

**Commandes pour tester localement :**
```bash
# Nettoyer et reconstruire
rm -rf dist node_modules
npm install
npm run build
```

---

### Solution 5 : Vérifier les Variables d'Environnement Sensibles

**Erreur courante :** `JWT_SECRET must be at least 20 characters`

**Solution :**
- Dans Render, vérifiez que `JWT_SECRET` est défini
- Il doit faire au moins 20 caractères
- Exemple : `JWT_SECRET=mon_super_secret_jwt_long_et_securise_123456`

---

### Solution 6 : Vérifier MongoDB Connection

**Erreur :** `MongooseServerSelectionError`

**Solutions :**
1. Vérifiez que `MONGODB_URI` est correct dans Render
2. Vérifiez que MongoDB Atlas autorise les connexions depuis Render
3. Testez la connexion localement avec la même URI

**Format MongoDB URI :**
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

---

## 🔍 Checklist de Vérification

Avant de redéployer, vérifiez :

- [ ] Les logs Render pour voir l'erreur exacte
- [ ] `PORT=10000` dans les variables d'environnement
- [ ] `BACKEND_URL` est l'URL complète de votre service (sans slash final)
- [ ] `JWT_SECRET` fait au moins 20 caractères
- [ ] `MONGODB_URI` est correct et accessible
- [ ] Le build command est `npm install && npm run build`
- [ ] Le start command est `npm run start:prod`
- [ ] `src/main.ts` utilise `host: '0.0.0.0'`
- [ ] Tous les modules sont importés dans `app.module.ts`
- [ ] Le code compile localement (`npm run build`)

---

## 🚀 Redéploiement

Une fois les corrections faites :

1. **Commit et push vos changements :**
   ```bash
   git add .
   git commit -m "Fix: Correction pour Render deployment"
   git push
   ```

2. **Dans Render Dashboard :**
   - Allez dans votre service
   - Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**
   - Surveillez les logs en temps réel

3. **Attendez la fin du déploiement :**
   - Build : ~2-5 minutes
   - Start : ~30 secondes

4. **Testez l'URL :**
   - `https://peakplay-17.onrender.com/api/v1`
   - `https://peakplay-17.onrender.com/api` (Swagger)

---

## 📝 Logs à Surveiller

**Logs de build réussis :**
```
✓ Built successfully
```

**Logs de démarrage réussis :**
```
🚀 Application is running on: http://0.0.0.0:10000
```

**Si vous voyez ces logs, l'application devrait fonctionner !**

---

## 🆘 Si Rien Ne Fonctionne

1. **Vérifiez les logs Render** (c'est la source de vérité)
2. **Testez localement** avec les mêmes variables d'environnement
3. **Créez un nouveau service Render** pour tester
4. **Contactez le support Render** si le problème persiste

---

## 💡 Conseils

- **Toujours vérifier les logs Render en premier** - Ils vous diront exactement ce qui ne va pas
- **Testez localement avant de déployer** - `npm run build && npm run start:prod`
- **Utilisez des variables d'environnement** - Ne hardcodez jamais les secrets
- **Surveillez les logs pendant le déploiement** - Vous verrez les erreurs en temps réel

---

**🎯 La plupart des erreurs 502 sont dues à :**
1. Variables d'environnement manquantes ou incorrectes
2. Port mal configuré
3. Erreur de compilation
4. Problème de connexion MongoDB

**Commencez par vérifier les logs Render, c'est la clé !** 🔑

