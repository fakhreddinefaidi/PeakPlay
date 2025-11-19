# Script PowerShell de test pour le Dashboard Académie
# Usage: .\test-academy-api.ps1

$BASE_URL = "http://localhost:3001/api/v1"
$EMAIL = "academy@test.com"
$PASSWORD = "password123"

Write-Host "🧪 Test du Dashboard Académie Backend" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 1. Test de connexion au serveur
Write-Host "1️⃣  Test de connexion au serveur..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/../api" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Serveur accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Serveur non accessible. Assurez-vous que l'application est démarrée." -ForegroundColor Red
    exit 1
}
Write-Host ""

# 2. Créer un utilisateur ACADEMY
Write-Host "2️⃣  Création d'un utilisateur ACADEMY..." -ForegroundColor Yellow
$registerBody = @{
    prenom = "Académie"
    nom = "Test"
    email = $EMAIL
    password = $PASSWORD
    age = "2000-01-01"
    tel = 123456789
    role = "ACADEMY"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/register" -Method POST -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ Utilisateur créé (ou existe déjà)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Utilisateur existe peut-être déjà ou erreur lors de la création" -ForegroundColor Yellow
}
Write-Host ""

# 3. Se connecter et obtenir le token
Write-Host "3️⃣  Connexion et obtention du token JWT..." -ForegroundColor Yellow
$loginBody = @{
    email = $EMAIL
    password = $PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $TOKEN = $loginResponse.access_token
    
    if ($TOKEN) {
        Write-Host "✅ Token JWT obtenu" -ForegroundColor Green
        Write-Host "ℹ️  Token: $($TOKEN.Substring(0, [Math]::Min(50, $TOKEN.Length)))..." -ForegroundColor Cyan
    } else {
        Write-Host "❌ Impossible d'obtenir le token" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur lors de la connexion. Vérifiez vos identifiants." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

# 4. Tester GET /api/v1/academy/me
Write-Host "4️⃣  Test GET /api/v1/academy/me..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $TOKEN"
}

try {
    $academyResponse = Invoke-RestMethod -Uri "$BASE_URL/academy/me" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "✅ Profil académie récupéré" -ForegroundColor Green
    Write-Host "   Academy Name: $($academyResponse.academyName)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur lors de la récupération du profil" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# 5. Tester PUT /api/v1/academy/me
Write-Host "5️⃣  Test PUT /api/v1/academy/me..." -ForegroundColor Yellow
$updateBody = @{
    academyName = "Académie de Football Paris"
    categories = @("U10", "U12", "U15")
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "$BASE_URL/academy/me" -Method PUT -Body $updateBody -Headers $headers -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ Profil académie mis à jour" -ForegroundColor Green
    Write-Host "   Academy Name: $($updateResponse.academyName)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur lors de la mise à jour du profil" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# 6. Créer une équipe
Write-Host "6️⃣  Test POST /api/v1/teams..." -ForegroundColor Yellow
$teamBody = @{
    name = "Équipe U12 A"
    category = "U12"
    coachName = "Marc Dubois"
    maxPlayers = 20
} | ConvertTo-Json

try {
    $teamResponse = Invoke-RestMethod -Uri "$BASE_URL/teams" -Method POST -Body $teamBody -Headers $headers -ContentType "application/json" -ErrorAction Stop
    $TEAM_ID = $teamResponse._id
    Write-Host "✅ Équipe créée (ID: $TEAM_ID)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la création de l'équipe" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# 7. Récupérer toutes les équipes
Write-Host "7️⃣  Test GET /api/v1/teams..." -ForegroundColor Yellow
try {
    $teamsList = Invoke-RestMethod -Uri "$BASE_URL/teams" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "✅ Liste des équipes récupérée ($($teamsList.Count) équipe(s))" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la récupération des équipes" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# 8. Créer un tournoi
Write-Host "8️⃣  Test POST /api/v1/tournaments..." -ForegroundColor Yellow
$tournamentBody = @{
    name = "Tournoi de Printemps 2024"
    category = "U12"
    type = "ELIMINATION"
    maxTeams = 16
    startDate = "2024-05-01T10:00:00Z"
    endDate = "2024-05-05T18:00:00Z"
    location = "Stade Municipal, Paris"
} | ConvertTo-Json

try {
    $tournamentResponse = Invoke-RestMethod -Uri "$BASE_URL/tournaments" -Method POST -Body $tournamentBody -Headers $headers -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ Tournoi créé" -ForegroundColor Green
    Write-Host "   Nom: $($tournamentResponse.name)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur lors de la création du tournoi" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# 9. Créer un arbitre
Write-Host "9️⃣  Test POST /api/v1/referees..." -ForegroundColor Yellow
$refereeBody = @{
    name = "Jean Martin"
    phone = "+33123456789"
    email = "jean.martin@example.com"
} | ConvertTo-Json

try {
    $refereeResponse = Invoke-RestMethod -Uri "$BASE_URL/referees" -Method POST -Body $refereeBody -Headers $headers -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ Arbitre créé" -ForegroundColor Green
    Write-Host "   Nom: $($refereeResponse.name)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur lors de la création de l'arbitre" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# 10. Test d'erreur : Accès sans token
Write-Host "🔟 Test d'erreur : Accès sans authentification..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$BASE_URL/academy/me" -Method GET -ErrorAction Stop | Out-Null
    Write-Host "❌ Erreur : L'accès devrait être refusé" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Erreur 401 correctement retournée (non authentifié)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Erreur inattendue : $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "🎉 Tests terminés !" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Pour tester manuellement :" -ForegroundColor Cyan
Write-Host "   1. Ouvrez Swagger UI : http://localhost:3001/api" -ForegroundColor White
Write-Host "   2. Connectez-vous avec : $EMAIL / $PASSWORD" -ForegroundColor White
Write-Host "   3. Copiez le token JWT" -ForegroundColor White
Write-Host "   4. Cliquez sur 'Authorize' et collez le token" -ForegroundColor White
Write-Host "   5. Testez tous les endpoints !" -ForegroundColor White
Write-Host ""

