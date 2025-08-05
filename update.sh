#!/bin/bash

# Frontzap Update Script
echo "🔄 Atualizando Frontzap..."

# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose down
docker-compose up -d --build

# Run migrations
docker-compose exec frontzap npx prisma migrate deploy

echo "✅ Atualização concluída!"
