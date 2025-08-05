#!/bin/bash

# Frontzap Deploy Script with Docker, Portainer and Traefik
echo "🚀 Iniciando deploy do Frontzap..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Execute como root: sudo ./deploy.sh"
    exit 1
fi

# Update system
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# Install Docker
echo "🐳 Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
echo "🔧 Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create traefik network
echo "🌐 Criando rede Traefik..."
docker network create traefik

# Create directories
echo "📁 Criando diretórios..."
mkdir -p traefik/acme
mkdir -p logs
chmod 600 traefik/acme

# Set permissions for acme.json
touch traefik/acme/acme.json
chmod 600 traefik/acme/acme.json

# Generate Traefik auth hash
echo "🔐 Configure a senha do Traefik:"
read -s -p "Digite a senha para admin: " password
echo
TRAEFIK_AUTH=$(htpasswd -nb admin "$password")

# Update .env file
echo "⚙️ Configurando variáveis de ambiente..."
cp .env.production .env
sed -i "s/TRAEFIK_AUTH=.*/TRAEFIK_AUTH=$TRAEFIK_AUTH/" .env

# Build and start services
echo "🏗️ Construindo e iniciando serviços..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 30

# Run database migrations
echo "🗄️ Executando migrações do banco..."
docker-compose exec frontzap npx prisma migrate deploy

# Show status
echo "📊 Status dos serviços:"
docker-compose ps

echo "✅ Deploy concluído!"
echo ""
echo "🌐 Acesse seus serviços:"
echo "   - Aplicação: https://$(grep DOMAIN .env | cut -d'=' -f2)"
echo "   - Portainer: https://portainer.$(grep DOMAIN .env | cut -d'=' -f2)"
echo "   - Traefik: https://traefik.$(grep DOMAIN .env | cut -d'=' -f2)"
echo "   - N8N: https://n8n.$(grep DOMAIN .env | cut -d'=' -f2)"
echo ""
echo "📝 Logs: docker-compose logs -f"
echo "🔄 Restart: docker-compose restart"
echo "🛑 Stop: docker-compose down"
