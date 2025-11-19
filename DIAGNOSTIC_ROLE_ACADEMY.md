# 🔍 Diagnostic : Pourquoi le Rôle "ACADEMY" ne Passe Pas

## ⚠️ Causes Possibles

### **1. Application Non Redémarrée**

**Problème :** Si vous avez modifié le code mais n'avez pas redémarré l'application, les changements ne sont pas pris en compte.

**Solution :**
```bash
# Arrêter l'application (Ctrl+C)
# Puis redémarrer
npm run start:dev
```

---

### **2. Test sur la Production (Render) Non Mise à Jour**

**Problème :** Si vous testez sur `https://peakplay-17.onrender.com`, le code déployé n'a peut-être pas été mis à jour.

**Solution :**
1. Pusher le code sur GitHub
2. Redéployer sur Render
3. Attendre la fin du déploiement
4. Tester à nouveau

---

### **3. Format du Rôle Incorrect**

**Problème :** Le rôle doit être **exactement** `"ACADEMY"` en majuscules.

**❌ Formats qui ne fonctionnent PAS :**
```json
{
  "role": "academy"      // minuscules
  "role": "Academy"      // majuscule/minuscule
  "role": "ACADEMIE"     // ancien nom
  "role": "ACADEMY "     // avec espace
}
```

**✅ Format correct :**
```json
{
  "role": "ACADEMY"      // exactement comme ça
}
```

---

### **4. Validation Enum TypeScript**

**Problème :** Parfois `@IsEnum` avec un enum TypeScript peut avoir des problèmes.

**Solution :** Le code a été corrigé pour accepter `UserRole | string`.

---

## 🔧 Solutions par Étape

### **Étape 1 : Vérifier le Code Local**

Vérifiez que le fichier `src/users/dto/create-user.dto.ts` contient bien :

```typescript
export enum UserRole {
  JOUEUR = 'JOUEUR',
  ACADEMY = 'ACADEMY',  // ← Doit être présent
  ARBITRE = 'ARBITRE',
}
```

---

### **Étape 2 : Rebuild et Redémarrer**

```bash
# Rebuild
npm run build

# Redémarrer en développement
npm run start:dev
```

---

### **Étape 3 : Tester en Local**

1. Ouvrez Swagger : `http://localhost:3001/api`
2. Testez `POST /api/v1/auth/register` avec :

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

3. **Si ça fonctionne en local** → Le problème vient de la production
4. **Si ça ne fonctionne pas en local** → Vérifiez les logs de l'application

---

### **Étape 4 : Vérifier les Logs**

Regardez les logs de l'application pour voir l'erreur exacte :

```bash
# Les logs devraient afficher l'erreur de validation
```

**Erreur typique :**
```
[ValidationPipe] role must be one of the following values: JOUEUR, ACADEMY, ARBITRE
```

---

### **Étape 5 : Si Test sur Production**

Si vous testez sur `https://peakplay-17.onrender.com` :

1. **Vérifiez que le code est poussé sur GitHub**
2. **Redéployez sur Render :**
   - Allez sur Render.com
   - Cliquez sur votre service
   - "Manual Deploy" → "Deploy latest commit"
3. **Attendez la fin du build**
4. **Testez à nouveau**

---

## 🧪 Test Rapide

### **Test 1 : Vérifier que l'Enum est Correct**

Créez un fichier de test temporaire :

```typescript
// test-enum.ts
import { UserRole } from './src/users/dto/create-user.dto';

console.log('UserRole.ACADEMY =', UserRole.ACADEMY);
console.log('Object.values(UserRole) =', Object.values(UserRole));
```

Exécutez :
```bash
npx ts-node test-enum.ts
```

**Résultat attendu :**
```
UserRole.ACADEMY = ACADEMY
Object.values(UserRole) = [ 'JOUEUR', 'ACADEMY', 'ARBITRE' ]
```

---

### **Test 2 : Vérifier la Validation**

Testez avec curl :

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Test",
    "nom": "User",
    "email": "test@test.com",
    "age": "2000-01-01",
    "tel": 123456789,
    "password": "password123",
    "role": "ACADEMY"
  }'
```

**Si erreur 400 :** Regardez le message d'erreur dans la réponse.

---

## 📋 Checklist de Diagnostic

- [ ] Code local vérifié (enum UserRole contient ACADEMY)
- [ ] Application redémarrée après modifications
- [ ] Build réussi (`npm run build`)
- [ ] Test en local effectué
- [ ] Format du rôle correct (`"ACADEMY"` en majuscules, sans espaces)
- [ ] Logs de l'application vérifiés
- [ ] Si production : code déployé et redéployé

---

## 🎯 Solutions Rapides

### **Solution 1 : Redémarrer l'Application**

```bash
# Arrêter (Ctrl+C)
npm run start:dev
```

---

### **Solution 2 : Vérifier le Format JSON**

Assurez-vous que votre JSON est valide :

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

**Points à vérifier :**
- Pas de virgule en trop à la fin
- Guillemets doubles pour les strings
- `role` est bien `"ACADEMY"` (pas `"academy"` ou `"ACADEMIE"`)

---

### **Solution 3 : Vérifier l'Environnement**

**En local :**
- URL : `http://localhost:3001/api`
- Vérifiez que l'application tourne

**En production :**
- URL : `https://peakplay-17.onrender.com/api`
- Vérifiez que le code est déployé

---

## ❓ Questions à Vous Poser

1. **Où testez-vous ?** (local ou production)
2. **Avez-vous redémarré l'application ?**
3. **Quel est le message d'erreur exact ?**
4. **Le format du rôle est-il exactement `"ACADEMY"` ?**

---

## 🔍 Message d'Erreur Typique

Si vous voyez :
```json
{
  "message": [
    "role must be one of the following values: "
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

**Cela signifie :** La version déployée n'a pas été mise à jour. Redéployez.

---

## ✅ Après Correction

Une fois corrigé, vous devriez voir :

**Réponse 201 Created :**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "email": "test@test.com",
    "role": "ACADEMY",
    ...
  }
}
```

---

**🎯 En résumé : Redémarrez l'application et vérifiez le format exact du rôle !**

