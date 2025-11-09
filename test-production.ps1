# Script de test pour la production (Windows PowerShell)
# Remplacez BACKEND_URL par votre URL Render

$BACKEND_URL = "https://votre-backend.onrender.com"

Write-Host "🧪 Test de l'API de base..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/api/v1" -Method GET
    Write-Host "✅ API accessible" -ForegroundColor Green
    Write-Host $response | ConvertTo-Json
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
}

Write-Host "`n📝 Création d'un utilisateur..." -ForegroundColor Cyan
$registerBody = @{
    email = "faidifakhri9@gmail.com"
    password = "12345699"
    prenom = "Test"
    nom = "User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/api/v1/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    Write-Host "✅ Utilisateur créé" -ForegroundColor Green
    Write-Host $response | ConvertTo-Json
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "ℹ️ Utilisateur existe déjà" -ForegroundColor Yellow
    }
}

Write-Host "`n🔐 Test de login..." -ForegroundColor Cyan
$loginBody = @{
    email = "faidifakhri9@gmail.com"
    password = "12345699"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/api/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    Write-Host "✅ Login réussi!" -ForegroundColor Green
    Write-Host "Token: $($response.access_token)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}

