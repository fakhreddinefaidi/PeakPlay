#!/bin/bash

# Script de test pour la production (Linux/Mac)
# Remplacez BACKEND_URL par votre URL Render

BACKEND_URL="https://votre-backend.onrender.com"

echo "🧪 Test de l'API de base..."
curl -s "$BACKEND_URL/api/v1"
echo -e "\n"

echo "📝 Création d'un utilisateur..."
curl -X POST "$BACKEND_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "faidifakhri9@gmail.com",
    "password": "12345699",
    "prenom": "Test",
    "nom": "User"
  }'
echo -e "\n\n"

echo "🔐 Test de login..."
curl -X POST "$BACKEND_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "faidifakhri9@gmail.com",
    "password": "12345699"
  }' \
  -v

