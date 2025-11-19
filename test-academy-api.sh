#!/bin/bash

# Script de test pour le Dashboard Académie
# Usage: ./test-academy-api.sh

BASE_URL="http://localhost:3001/api/v1"
EMAIL="academy@test.com"
PASSWORD="password123"

echo "🧪 Test du Dashboard Académie Backend"
echo "======================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# 1. Test de connexion au serveur
echo "1️⃣  Test de connexion au serveur..."
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/../api" | grep -q "200\|301\|302"; then
    print_success "Serveur accessible"
else
    print_error "Serveur non accessible. Assurez-vous que l'application est démarrée."
    exit 1
fi
echo ""

# 2. Créer un utilisateur ACADEMY
echo "2️⃣  Création d'un utilisateur ACADEMY..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"prenom\": \"Académie\",
    \"nom\": \"Test\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"age\": \"2000-01-01\",
    \"tel\": 123456789,
    \"role\": \"ACADEMY\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q "access_token\|created"; then
    print_success "Utilisateur créé (ou existe déjà)"
else
    print_error "Erreur lors de la création de l'utilisateur"
    echo "$REGISTER_RESPONSE"
fi
echo ""

# 3. Se connecter et obtenir le token
echo "3️⃣  Connexion et obtention du token JWT..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    print_error "Impossible d'obtenir le token. Vérifiez vos identifiants."
    echo "$LOGIN_RESPONSE"
    exit 1
else
    print_success "Token JWT obtenu"
    print_info "Token: ${TOKEN:0:50}..."
fi
echo ""

# 4. Tester GET /api/v1/academy/me
echo "4️⃣  Test GET /api/v1/academy/me..."
ACADEMY_RESPONSE=$(curl -s -X GET "$BASE_URL/academy/me" \
  -H "Authorization: Bearer $TOKEN")

if echo "$ACADEMY_RESPONSE" | grep -q "userId\|_id"; then
    print_success "Profil académie récupéré"
else
    print_error "Erreur lors de la récupération du profil"
    echo "$ACADEMY_RESPONSE"
fi
echo ""

# 5. Tester PUT /api/v1/academy/me
echo "5️⃣  Test PUT /api/v1/academy/me..."
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/academy/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "academyName": "Académie de Football Paris",
    "categories": ["U10", "U12", "U15"]
  }')

if echo "$UPDATE_RESPONSE" | grep -q "academyName"; then
    print_success "Profil académie mis à jour"
else
    print_error "Erreur lors de la mise à jour du profil"
    echo "$UPDATE_RESPONSE"
fi
echo ""

# 6. Créer une équipe
echo "6️⃣  Test POST /api/v1/teams..."
TEAM_RESPONSE=$(curl -s -X POST "$BASE_URL/teams" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Équipe U12 A",
    "category": "U12",
    "coachName": "Marc Dubois",
    "maxPlayers": 20
  }')

TEAM_ID=$(echo "$TEAM_RESPONSE" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -z "$TEAM_ID" ]; then
    print_error "Erreur lors de la création de l'\''équipe"
    echo "$TEAM_RESPONSE"
else
    print_success "Équipe créée (ID: $TEAM_ID)"
fi
echo ""

# 7. Récupérer toutes les équipes
echo "7️⃣  Test GET /api/v1/teams..."
TEAMS_LIST=$(curl -s -X GET "$BASE_URL/teams" \
  -H "Authorization: Bearer $TOKEN")

if echo "$TEAMS_LIST" | grep -q "\[\|name"; then
    print_success "Liste des équipes récupérée"
else
    print_error "Erreur lors de la récupération des équipes"
    echo "$TEAMS_LIST"
fi
echo ""

# 8. Créer un tournoi
echo "8️⃣  Test POST /api/v1/tournaments..."
TOURNAMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/tournaments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tournoi de Printemps 2024",
    "category": "U12",
    "type": "ELIMINATION",
    "maxTeams": 16,
    "startDate": "2024-05-01T10:00:00Z",
    "endDate": "2024-05-05T18:00:00Z",
    "location": "Stade Municipal, Paris"
  }')

if echo "$TOURNAMENT_RESPONSE" | grep -q "_id\|name"; then
    print_success "Tournoi créé"
else
    print_error "Erreur lors de la création du tournoi"
    echo "$TOURNAMENT_RESPONSE"
fi
echo ""

# 9. Créer un arbitre
echo "9️⃣  Test POST /api/v1/referees..."
REFEREE_RESPONSE=$(curl -s -X POST "$BASE_URL/referees" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Martin",
    "phone": "+33123456789",
    "email": "jean.martin@example.com"
  }')

if echo "$REFEREE_RESPONSE" | grep -q "_id\|name"; then
    print_success "Arbitre créé"
else
    print_error "Erreur lors de la création de l'\''arbitre"
    echo "$REFEREE_RESPONSE"
fi
echo ""

# 10. Test d'erreur : Accès sans token
echo "🔟 Test d'\''erreur : Accès sans authentification..."
ERROR_RESPONSE=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/academy/me" -o /dev/null)

if [ "$ERROR_RESPONSE" = "401" ]; then
    print_success "Erreur 401 correctement retournée (non authentifié)"
else
    print_error "Erreur attendue : 401, reçu : $ERROR_RESPONSE"
fi
echo ""

echo "======================================"
echo "🎉 Tests terminés !"
echo ""
echo "📝 Pour tester manuellement :"
echo "   1. Ouvrez Swagger UI : http://localhost:3001/api"
echo "   2. Connectez-vous avec : $EMAIL / $PASSWORD"
echo "   3. Copiez le token JWT"
echo "   4. Cliquez sur 'Authorize' et collez le token"
echo "   5. Testez tous les endpoints !"
echo ""

