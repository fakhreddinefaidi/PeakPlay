# 🧪 Guide de Test - Dashboard Académie Backend

## 📋 Prérequis

1. ✅ MongoDB en cours d'exécution (local ou Atlas)
2. ✅ Variables d'environnement configurées (`.env`)
3. ✅ Dépendances installées (`npm install`)

---

## 🚀 Étape 1 : Démarrer l'Application

```bash
# Démarrer l'application
npm run start:dev

# Ou en mode production
npm run build
npm run start:prod
```

L'application sera accessible sur :
- **API** : `http://localhost:3001/api/v1`
- **Swagger UI** : `http://localhost:3001/api`

---

## 🔐 Étape 2 : Créer un Utilisateur ACADEMY

### Option A : Via Swagger UI (Recommandé)

1. Ouvrez `http://localhost:3001/api` dans votre navigateur
2. Allez dans la section **Auth** → **POST /api/v1/auth/register**
3. Cliquez sur **"Try it out"**
4. Utilisez ce JSON :

```json
{
  "prenom": "Académie",
  "nom": "Test",
  "email": "academy@test.com",
  "password": "password123",
  "age": "2000-01-01",
  "tel": 123456789,
  "role": "ACADEMY"
}
```

5. Cliquez sur **"Execute"**
6. **Important** : Vérifiez votre email pour confirmer le compte (ou utilisez le token de vérification)

### Option B : Via cURL

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Académie",
    "nom": "Test",
    "email": "academy@test.com",
    "password": "password123",
    "age": "2000-01-01",
    "tel": 123456789,
    "role": "ACADEMY"
  }'
```

---

## 🔑 Étape 3 : Se Connecter et Obtenir un Token JWT

### Via Swagger UI

1. Allez dans **Auth** → **POST /api/v1/auth/login**
2. Cliquez sur **"Try it out"**
3. Utilisez ce JSON :

```json
{
  "email": "academy@test.com",
  "password": "password123"
}
```

4. Cliquez sur **"Execute"**
5. **Copiez le token** de la réponse (champ `access_token`)

### Via cURL

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "academy@test.com",
    "password": "password123"
  }'
```

**Réponse attendue :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "academy@test.com",
    "role": "ACADEMY",
    ...
  }
}
```

---

## 🔓 Étape 4 : Configurer l'Authentification dans Swagger

1. Dans Swagger UI, cliquez sur le bouton **"Authorize"** (en haut à droite)
2. Dans le champ **"access-token"**, collez votre token JWT
3. Cliquez sur **"Authorize"** puis **"Close"**

Maintenant, tous les endpoints protégés seront accessibles !

---

## 🧪 Étape 5 : Tester les Modules

### 🏛️ Module Academy Profile

#### GET /api/v1/academy/me - Récupérer le profil

**Via Swagger :**
- Section **Academy** → **GET /api/v1/academy/me**
- Cliquez sur **"Try it out"** → **"Execute"**

**Via cURL :**
```bash
curl -X GET http://localhost:3001/api/v1/academy/me \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

**Réponse attendue :**
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
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**ℹ️ Note importante :** Si vous venez de créer votre compte ACADEMY, le profil académie sera automatiquement créé (vide) lors du premier appel à `GET /api/v1/academy/me`. Vous n'avez pas besoin de créer le profil manuellement !

#### PUT /api/v1/academy/me - Mettre à jour le profil

**Via Swagger :**
- Section **Academy** → **PUT /api/v1/academy/me**
- Cliquez sur **"Try it out"**
- Utilisez ce JSON :

```json
{
  "academyName": "Académie de Football Paris",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Rue de la République, 75001 Paris",
  "phone": "+33123456789",
  "responsableName": "Jean Dupont",
  "categories": ["U10", "U12", "U15"]
}
```

**Via cURL :**
```bash
curl -X PUT http://localhost:3001/api/v1/academy/me \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "academyName": "Académie de Football Paris",
    "logoUrl": "https://example.com/logo.png",
    "address": "123 Rue de la République, 75001 Paris",
    "phone": "+33123456789",
    "responsableName": "Jean Dupont",
    "categories": ["U10", "U12", "U15"]
  }'
```

---

### ⚽ Module Teams

#### POST /api/v1/teams - Créer une équipe

**Via Swagger :**
- Section **Teams** → **POST /api/v1/teams**
- Cliquez sur **"Try it out"**
- Utilisez ce JSON :

```json
{
  "name": "Équipe U12 A",
  "category": "U12",
  "coachName": "Marc Dubois",
  "maxPlayers": 20
}
```

**Via cURL :**
```bash
curl -X POST http://localhost:3001/api/v1/teams \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Équipe U12 A",
    "category": "U12",
    "coachName": "Marc Dubois",
    "maxPlayers": 20
  }'
```

**Réponse attendue :**
```json
{
  "_id": "...",
  "name": "Équipe U12 A",
  "category": "U12",
  "coachName": "Marc Dubois",
  "maxPlayers": 20,
  "academyId": "...",
  "players": [],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/v1/teams - Récupérer toutes les équipes

**Via Swagger :**
- Section **Teams** → **GET /api/v1/teams**
- Cliquez sur **"Try it out"** → **"Execute"**

**Via cURL :**
```bash
curl -X GET http://localhost:3001/api/v1/teams \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

#### GET /api/v1/teams/:id - Récupérer une équipe

**Via Swagger :**
- Section **Teams** → **GET /api/v1/teams/{id}**
- Entrez l'ID de l'équipe
- Cliquez sur **"Execute"**

**Via cURL :**
```bash
curl -X GET http://localhost:3001/api/v1/teams/ID_DE_L_EQUIPE \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

---

### 📝 Module Join Requests

**Note :** Pour tester ce module, vous devez d'abord :
1. Créer un utilisateur avec le rôle `JOUEUR`
2. Créer une équipe
3. Créer une demande d'adhésion (via le frontend ou directement en base de données)

#### GET /api/v1/teams/:teamId/requests - Récupérer les demandes

**Via Swagger :**
- Section **Join Requests** → **GET /api/v1/teams/{teamId}/requests**
- Entrez l'ID de l'équipe
- Cliquez sur **"Execute"**

**Via cURL :**
```bash
curl -X GET http://localhost:3001/api/v1/teams/ID_DE_L_EQUIPE/requests \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

#### POST /api/v1/teams/:teamId/requests/:requestId/accept - Accepter une demande

**Via Swagger :**
- Section **Join Requests** → **POST /api/v1/teams/{teamId}/requests/{requestId}/accept**
- Entrez les IDs
- Cliquez sur **"Execute"**

**Via cURL :**
```bash
curl -X POST http://localhost:3001/api/v1/teams/ID_EQUIPE/requests/ID_DEMANDE/accept \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

#### POST /api/v1/teams/:teamId/requests/:requestId/reject - Refuser une demande

**Via Swagger :**
- Section **Join Requests** → **POST /api/v1/teams/{teamId}/requests/{requestId}/reject**
- Entrez les IDs
- Cliquez sur **"Execute"**

**Via cURL :**
```bash
curl -X POST http://localhost:3001/api/v1/teams/ID_EQUIPE/requests/ID_DEMANDE/reject \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

---

### 🏆 Module Tournaments

#### POST /api/v1/tournaments - Créer un tournoi

**Via Swagger :**
- Section **Tournaments** → **POST /api/v1/tournaments**
- Cliquez sur **"Try it out"**
- Utilisez ce JSON :

```json
{
  "name": "Tournoi de Printemps 2024",
  "category": "U12",
  "type": "ELIMINATION",
  "maxTeams": 16,
  "startDate": "2024-05-01T10:00:00Z",
  "endDate": "2024-05-05T18:00:00Z",
  "location": "Stade Municipal, Paris"
}
```

**Via cURL :**
```bash
curl -X POST http://localhost:3001/api/v1/tournaments \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tournoi de Printemps 2024",
    "category": "U12",
    "type": "ELIMINATION",
    "maxTeams": 16,
    "startDate": "2024-05-01T10:00:00Z",
    "endDate": "2024-05-05T18:00:00Z",
    "location": "Stade Municipal, Paris"
  }'
```

#### GET /api/v1/tournaments - Récupérer tous les tournois

**Avec filtre par statut :**
```bash
curl -X GET "http://localhost:3001/api/v1/tournaments?status=UPCOMING" \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

**Sans filtre :**
```bash
curl -X GET http://localhost:3001/api/v1/tournaments \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

---

### 👨‍⚖️ Module Referees

#### POST /api/v1/referees - Créer un arbitre

**Via Swagger :**
- Section **Referees** → **POST /api/v1/referees**
- Cliquez sur **"Try it out"**
- Utilisez ce JSON :

```json
{
  "name": "Jean Martin",
  "phone": "+33123456789",
  "email": "jean.martin@example.com"
}
```

**Via cURL :**
```bash
curl -X POST http://localhost:3001/api/v1/referees \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Martin",
    "phone": "+33123456789",
    "email": "jean.martin@example.com"
  }'
```

#### GET /api/v1/referees - Récupérer tous les arbitres

```bash
curl -X GET http://localhost:3001/api/v1/referees \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

---

## 🧪 Scénario de Test Complet

### 1. Créer un utilisateur ACADEMY
```bash
POST /api/v1/auth/register
{
  "prenom": "Académie",
  "nom": "Test",
  "email": "academy@test.com",
  "password": "password123",
  "age": "2000-01-01",
  "tel": 123456789,
  "role": "ACADEMY"
}
```

### 2. Se connecter
```bash
POST /api/v1/auth/login
{
  "email": "academy@test.com",
  "password": "password123"
}
```
→ **Copier le token JWT**

### 3. Mettre à jour le profil académie
```bash
PUT /api/v1/academy/me
Authorization: Bearer TOKEN
{
  "academyName": "Académie de Football Paris",
  "categories": ["U10", "U12", "U15"]
}
```

### 4. Créer une équipe
```bash
POST /api/v1/teams
Authorization: Bearer TOKEN
{
  "name": "Équipe U12 A",
  "category": "U12",
  "coachName": "Marc Dubois",
  "maxPlayers": 20
}
```
→ **Copier l'ID de l'équipe**

### 5. Créer un tournoi
```bash
POST /api/v1/tournaments
Authorization: Bearer TOKEN
{
  "name": "Tournoi de Printemps 2024",
  "category": "U12",
  "type": "ELIMINATION",
  "maxTeams": 16,
  "startDate": "2024-05-01T10:00:00Z",
  "endDate": "2024-05-05T18:00:00Z",
  "location": "Stade Municipal, Paris"
}
```

### 6. Créer un arbitre
```bash
POST /api/v1/referees
Authorization: Bearer TOKEN
{
  "name": "Jean Martin",
  "phone": "+33123456789",
  "email": "jean.martin@example.com"
}
```

### 7. Lister toutes les ressources
```bash
GET /api/v1/teams
GET /api/v1/tournaments
GET /api/v1/referees
GET /api/v1/academy/me
```

---

## ❌ Tests d'Erreurs

### Test 1 : Accès sans authentification
```bash
curl -X GET http://localhost:3001/api/v1/academy/me
```
**Résultat attendu :** `401 Unauthorized`

### Test 2 : Accès avec un token invalide
```bash
curl -X GET http://localhost:3001/api/v1/academy/me \
  -H "Authorization: Bearer token_invalide"
```
**Résultat attendu :** `401 Unauthorized`

### Test 3 : Accès avec un utilisateur JOUEUR (pas ACADEMY)
1. Créez un utilisateur avec `role: "JOUEUR"`
2. Connectez-vous et obtenez le token
3. Essayez d'accéder à `/api/v1/academy/me`
**Résultat attendu :** `403 Forbidden - Required roles: ACADEMY`

### Test 4 : Créer une équipe avec maxPlayers < nombre de joueurs actuels
1. Créez une équipe avec `maxPlayers: 20`
2. Ajoutez 15 joueurs (via join requests)
3. Essayez de mettre à jour avec `maxPlayers: 10`
**Résultat attendu :** `400 BadRequest - Le nombre maximum de joueurs ne peut pas être inférieur au nombre actuel`

### Test 5 : Accepter une demande déjà traitée
1. Acceptez une demande
2. Essayez de l'accepter à nouveau
**Résultat attendu :** `400 BadRequest - Cette demande a déjà été traitée`

---

## 📊 Vérification dans MongoDB

Vous pouvez vérifier les données directement dans MongoDB :

```bash
# Se connecter à MongoDB
mongosh

# Utiliser la base de données
use dam_backend

# Voir les collections
show collections

# Voir les académies
db.academies.find().pretty()

# Voir les équipes
db.teams.find().pretty()

# Voir les tournois
db.tournaments.find().pretty()

# Voir les arbitres
db.referees.find().pretty()

# Voir les demandes d'adhésion
db.joinrequests.find().pretty()
```

---

## 🛠️ Outils Recommandés

1. **Swagger UI** : `http://localhost:3001/api` (Interface graphique)
2. **Postman** : Collection d'API REST
3. **Insomnia** : Alternative à Postman
4. **cURL** : Ligne de commande
5. **MongoDB Compass** : Interface graphique pour MongoDB

---

## ✅ Checklist de Test

- [ ] Application démarre sans erreur
- [ ] Swagger UI accessible
- [ ] Création d'utilisateur ACADEMY réussie
- [ ] Login et obtention du token JWT
- [ ] Authentification dans Swagger fonctionne
- [ ] GET /api/v1/academy/me fonctionne
- [ ] PUT /api/v1/academy/me fonctionne
- [ ] POST /api/v1/teams fonctionne
- [ ] GET /api/v1/teams fonctionne
- [ ] POST /api/v1/tournaments fonctionne
- [ ] GET /api/v1/tournaments fonctionne
- [ ] POST /api/v1/referees fonctionne
- [ ] GET /api/v1/referees fonctionne
- [ ] Test d'erreur 401 (non authentifié)
- [ ] Test d'erreur 403 (mauvais rôle)
- [ ] Test d'erreur 404 (ressource non trouvée)

---

## 🐛 Dépannage

### Problème : "401 Unauthorized"
- ✅ Vérifiez que le token JWT est valide
- ✅ Vérifiez que le token n'a pas expiré
- ✅ Vérifiez le format : `Authorization: Bearer TOKEN`

### Problème : "403 Forbidden"
- ✅ Vérifiez que l'utilisateur a le rôle `ACADEMY`
- ✅ Vérifiez dans MongoDB : `db.users.findOne({ email: "academy@test.com" })`

### Problème : "404 Not Found"
- ✅ Vérifiez que l'ID de la ressource existe
- ✅ Vérifiez que la ressource appartient à votre académie

### Problème : "400 Bad Request"
- ✅ Vérifiez le format JSON
- ✅ Vérifiez les champs requis
- ✅ Vérifiez les validations (dates, nombres, etc.)

---

**🎉 Bon test !**

