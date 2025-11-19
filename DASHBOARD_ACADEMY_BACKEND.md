# 🎯 Dashboard Académie - Backend NestJS

## ✅ Modules Implémentés

Tous les modules backend pour le Dashboard Académie ont été créés avec succès.

---

## 📦 Structure des Modules

### 1. 🏛️ Module Academy Profile

**Fichiers créés :**
- `src/schemas/academy.schema.ts` - Schéma MongoDB
- `src/academy/dto/update-academy.dto.ts` - DTO de mise à jour
- `src/academy/academy.service.ts` - Service métier
- `src/academy/academy.controller.ts` - Contrôleur REST
- `src/academy/academy.module.ts` - Module NestJS

**Endpoints :**
- `GET /api/v1/academy/me` - Récupérer le profil de l'académie connectée
- `PUT /api/v1/academy/me` - Mettre à jour le profil de l'académie connectée

**Champs du modèle :**
- `userId` (string, unique) - Référence vers User._id
- `academyName` (string, required)
- `logoUrl` (string, optional)
- `address` (string, optional)
- `phone` (string, optional)
- `responsableName` (string, optional)
- `categories` (string[], optional) - ex: ["U10", "U12"]
- `createdAt` (Date)
- `updatedAt` (Date)

---

### 2. ⚽ Module Teams

**Fichiers créés :**
- `src/schemas/team.schema.ts` - Schéma MongoDB
- `src/teams/dto/create-team.dto.ts` - DTO de création
- `src/teams/dto/update-team.dto.ts` - DTO de mise à jour
- `src/teams/teams.service.ts` - Service métier
- `src/teams/teams.controller.ts` - Contrôleur REST
- `src/teams/teams.module.ts` - Module NestJS

**Endpoints :**
- `POST /api/v1/teams` - Créer une nouvelle équipe
- `GET /api/v1/teams` - Récupérer toutes les équipes de l'académie
- `GET /api/v1/teams/:id` - Récupérer une équipe par ID
- `PATCH /api/v1/teams/:id` - Mettre à jour une équipe
- `DELETE /api/v1/teams/:id` - Supprimer une équipe

**Champs du modèle :**
- `name` (string, required)
- `category` (string, required) - ex: "U10", "U12"
- `coachName` (string, required)
- `maxPlayers` (number, required, default: 20)
- `academyId` (ObjectId, required) - Référence vers User
- `players` (ObjectId[], default: []) - Références vers User
- `createdAt` (Date)

**Fonctionnalités :**
- Filtrage automatique par `academyId` de l'utilisateur connecté
- Vérification du nombre maximum de joueurs
- Prévention des doublons de joueurs

---

### 3. 📝 Module Join Requests

**Fichiers créés :**
- `src/schemas/join-request.schema.ts` - Schéma MongoDB
- `src/join-requests/join-requests.service.ts` - Service métier
- `src/join-requests/join-requests.controller.ts` - Contrôleur REST
- `src/join-requests/join-requests.module.ts` - Module NestJS

**Endpoints :**
- `GET /api/v1/teams/:teamId/requests` - Récupérer toutes les demandes d'adhésion d'une équipe
- `POST /api/v1/teams/:teamId/requests/:requestId/accept` - Accepter une demande
- `POST /api/v1/teams/:teamId/requests/:requestId/reject` - Refuser une demande

**Champs du modèle :**
- `playerId` (ObjectId, required) - Référence vers User
- `teamId` (ObjectId, required) - Référence vers Team
- `status` (enum: 'PENDING' | 'ACCEPTED' | 'REJECTED', default: 'PENDING')
- `createdAt` (Date)

**Fonctionnalités :**
- Vérification que l'équipe appartient à l'académie
- Vérification que la demande est en attente
- Vérification du nombre maximum de joueurs
- Prévention des doublons de joueurs
- Ajout automatique du joueur à l'équipe lors de l'acceptation

---

### 4. 🏆 Module Tournaments

**Fichiers créés :**
- `src/schemas/tournament.schema.ts` - Schéma MongoDB
- `src/tournaments/dto/create-tournament.dto.ts` - DTO de création
- `src/tournaments/dto/update-tournament.dto.ts` - DTO de mise à jour
- `src/tournaments/tournaments.service.ts` - Service métier
- `src/tournaments/tournaments.controller.ts` - Contrôleur REST
- `src/tournaments/tournaments.module.ts` - Module NestJS

**Endpoints :**
- `POST /api/v1/tournaments` - Créer un nouveau tournoi
- `GET /api/v1/tournaments?status=UPCOMING` - Récupérer tous les tournois (avec filtre optionnel par statut)
- `GET /api/v1/tournaments/:id` - Récupérer un tournoi par ID
- `PATCH /api/v1/tournaments/:id` - Mettre à jour un tournoi
- `DELETE /api/v1/tournaments/:id` - Supprimer un tournoi

**Champs du modèle :**
- `name` (string, required)
- `category` (string, required) - ex: "U10", "U12"
- `type` (enum: 'ELIMINATION' | 'POINTS', required)
- `maxTeams` (number, required, min: 2)
- `startDate` (Date, required)
- `endDate` (Date, required)
- `location` (string, required)
- `academyId` (ObjectId, required) - Référence vers User
- `status` (enum: 'UPCOMING' | 'ONGOING' | 'FINISHED', default: 'UPCOMING')
- `createdAt` (Date)

**Fonctionnalités :**
- Validation que la date de fin est après la date de début
- Filtrage par statut (query parameter)
- Tri par date de début (croissant)

---

### 5. 👨‍⚖️ Module Referees

**Fichiers créés :**
- `src/schemas/referee.schema.ts` - Schéma MongoDB
- `src/referees/dto/create-referee.dto.ts` - DTO de création
- `src/referees/dto/update-referee.dto.ts` - DTO de mise à jour
- `src/referees/referees.service.ts` - Service métier
- `src/referees/referees.controller.ts` - Contrôleur REST
- `src/referees/referees.module.ts` - Module NestJS

**Endpoints :**
- `POST /api/v1/referees` - Créer un nouvel arbitre
- `GET /api/v1/referees` - Récupérer tous les arbitres de l'académie
- `GET /api/v1/referees/:id` - Récupérer un arbitre par ID
- `PATCH /api/v1/referees/:id` - Mettre à jour un arbitre
- `DELETE /api/v1/referees/:id` - Supprimer un arbitre

**Champs du modèle :**
- `name` (string, required)
- `phone` (string, required)
- `email` (string, required)
- `academyId` (ObjectId, required) - Référence vers User
- `assignedMatches` (ObjectId[], default: []) - Références vers des matches (à créer plus tard)
- `createdAt` (Date)

**Fonctionnalités :**
- Vérification de l'unicité de l'email par académie
- Prévention des doublons d'email lors de la création et mise à jour

---

## 🔒 Système de Protection par Rôle

### Guards Utilisés

Tous les endpoints utilisent :
1. **JwtAuthGuard** - Vérifie l'authentification JWT
2. **RolesGuard** - Vérifie que l'utilisateur a le rôle requis

### Décorateur @Roles

Tous les endpoints du Dashboard Académie utilisent :
```typescript
@Roles('ACADEMY')
```

### Vérifications de Sécurité

- ✅ Tous les endpoints vérifient que `req.user.role === 'ACADEMY'`
- ✅ Filtrage automatique par `academyId = req.user.userId`
- ✅ Vérification de propriété pour toutes les opérations (GET, UPDATE, DELETE)
- ✅ Gestion des erreurs : NotFoundException, ForbiddenException, BadRequestException

---

## 📋 Gestion des Erreurs

### Exceptions Utilisées

- **NotFoundException** - Ressource non trouvée
- **ForbiddenException** - Accès refusé (rôle incorrect ou propriété)
- **BadRequestException** - Erreur de validation
- **ConflictException** - Conflit (doublon, etc.)

### Exemples d'Erreurs

```typescript
// Rôle incorrect
ForbiddenException('Required roles: ACADEMY')

// Ressource non trouvée
NotFoundException('Équipe non trouvée')

// Accès refusé (propriété)
ForbiddenException('Vous n\'êtes pas autorisé à accéder à cette équipe')

// Validation
BadRequestException('L\'équipe a atteint le nombre maximum de joueurs')

// Conflit
ConflictException('Un arbitre avec cet email existe déjà dans votre académie')
```

---

## 🚀 Intégration dans AppModule

Tous les modules ont été intégrés dans `src/app.module.ts` :

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

## ✅ Vérifications Effectuées

- ✅ Compilation TypeScript réussie
- ✅ Aucune erreur de linter
- ✅ Tous les modules intégrés dans AppModule
- ✅ Protection par rôle sur tous les endpoints
- ✅ Validation des DTOs avec class-validator
- ✅ Documentation Swagger complète
- ✅ Gestion d'erreurs complète

---

## 📝 Notes Importantes

1. **AcademyId** : Tous les modules utilisent `req.user.userId` comme `academyId` car l'utilisateur avec le rôle ACADEMY est l'académie elle-même.

2. **Relations MongoDB** : Les références utilisent `Types.ObjectId` et `ref: 'User'` ou `ref: 'Team'` pour les relations.

3. **Timestamps** : Tous les schémas utilisent `{ timestamps: true }` pour `createdAt` et `updatedAt` automatiques.

4. **Validation** : Tous les DTOs utilisent `class-validator` pour la validation des données.

5. **Swagger** : Tous les endpoints sont documentés avec `@ApiOperation`, `@ApiResponse`, etc.

---

## 🎯 Prochaines Étapes (Optionnel)

- [ ] Créer le module Matches pour gérer les matchs de tournoi
- [ ] Ajouter la gestion des inscriptions d'équipes aux tournois
- [ ] Implémenter le système de notation/évaluation
- [ ] Ajouter des statistiques pour les équipes et joueurs
- [ ] Créer des endpoints pour les joueurs (JOUEUR role)

---

## 📚 Documentation API

Tous les endpoints sont documentés et accessibles via Swagger UI :
- URL : `http://localhost:3001/api` (ou votre URL de base)
- Authentification : Bearer Token (JWT)

---

**✅ Backend Dashboard Académie - 100% Implémenté et Prêt à l'Emploi !**

