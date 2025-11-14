# Script PowerShell pour démarrer MongoDB avec Docker
# Usage: .\start-mongodb.ps1

Write-Host "=== Démarrage de MongoDB avec Docker ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker est en cours d'exécution
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Desktop n'est pas démarré!" -ForegroundColor Red
    Write-Host "⚠️  Veuillez démarrer Docker Desktop et réessayer" -ForegroundColor Yellow
    exit 1
}

# Vérifier si le conteneur existe déjà
$containerExists = docker ps -a --filter "name=mongodb" --format "{{.Names}}"
if ($containerExists -eq "mongodb") {
    Write-Host "📦 Conteneur MongoDB existe déjà" -ForegroundColor Yellow
    
    # Vérifier s'il est en cours d'exécution
    $containerRunning = docker ps --filter "name=mongodb" --format "{{.Names}}"
    if ($containerRunning -eq "mongodb") {
        Write-Host "✅ MongoDB est déjà en cours d'exécution!" -ForegroundColor Green
        Write-Host "   URI: mongodb://localhost:27017/dam_backend" -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host "🔄 Démarrage du conteneur existant..." -ForegroundColor Yellow
        docker start mongodb
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ MongoDB démarré avec succès!" -ForegroundColor Green
            Write-Host "   URI: mongodb://localhost:27017/dam_backend" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Erreur lors du démarrage" -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "📦 Création et démarrage d'un nouveau conteneur MongoDB..." -ForegroundColor Yellow
    docker run -d `
        --name mongodb `
        -p 27017:27017 `
        -e MONGO_INITDB_DATABASE=dam_backend `
        mongo:latest
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB démarré avec succès!" -ForegroundColor Green
        Write-Host "   URI: mongodb://localhost:27017/dam_backend" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 Votre .env devrait contenir:" -ForegroundColor Yellow
        Write-Host "   MONGODB_URI=mongodb://localhost:27017/dam_backend" -ForegroundColor White
    } else {
        Write-Host "❌ Erreur lors de la création du conteneur" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "💡 Pour arrêter MongoDB: docker stop mongodb" -ForegroundColor Cyan
Write-Host "💡 Pour redémarrer: docker start mongodb" -ForegroundColor Cyan

