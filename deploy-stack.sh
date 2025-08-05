#!/bin/bash

# Frontzap Stack Deployment Script
# This script deploys the Frontzap application stack

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
STACK_NAME="frontzap"
COMPOSE_FILE="docker-compose.stack.yml"
ENV_FILE=".env"

echo -e "${BLUE}🚀 Frontzap Stack Deployment${NC}"
echo "=================================="

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not available${NC}"
    exit 1
fi

# Check if Traefik network exists
if ! docker network ls | grep -q "traefik"; then
    echo -e "${YELLOW}⚠️  Creating Traefik network...${NC}"
    docker network create traefik
fi

# Check if environment file exists
if [[ ! -f "$ENV_FILE" ]]; then
    if [[ -f ".env.stack" ]]; then
        echo -e "${YELLOW}⚠️  Copying .env.stack to .env${NC}"
        cp .env.stack .env
    else
        echo -e "${RED}❌ Environment file not found. Please create .env file${NC}"
        echo "You can use .env.stack as a template"
        exit 1
    fi
fi

# Validate required environment variables
echo -e "${BLUE}🔍 Validating environment variables...${NC}"
source .env

required_vars=(
    "DOMAIN"
    "POSTGRES_PASSWORD"
    "REDIS_PASSWORD"
    "NEXTAUTH_SECRET"
    "JWT_SECRET"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        missing_vars+=("$var")
    fi
done

if [[ ${#missing_vars[@]} -gt 0 ]]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables validated${NC}"

# Create necessary directories
echo -e "${BLUE}📁 Creating directories...${NC}"
mkdir -p logs backups uploads

# Set proper permissions
chmod 755 logs backups uploads

# Pull latest images
echo -e "${BLUE}📥 Pulling Docker images...${NC}"
docker compose -f $COMPOSE_FILE pull

# Build application image
echo -e "${BLUE}🔨 Building application image...${NC}"
docker compose -f $COMPOSE_FILE build --no-cache frontzap

# Stop existing stack if running
if docker compose -f $COMPOSE_FILE ps -q | grep -q .; then
    echo -e "${YELLOW}⏹️  Stopping existing stack...${NC}"
    docker compose -f $COMPOSE_FILE down
fi

# Start the stack
echo -e "${BLUE}🚀 Starting Frontzap stack...${NC}"
docker compose -f $COMPOSE_FILE up -d

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"

# Function to check service health
check_service_health() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if docker compose -f $COMPOSE_FILE ps $service | grep -q "healthy\|Up"; then
            echo -e "${GREEN}✅ $service is ready${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Waiting for $service... (attempt $attempt/$max_attempts)${NC}"
        sleep 10
        ((attempt++))
    done
    
    echo -e "${RED}❌ $service failed to start properly${NC}"
    return 1
}

# Check database health
check_service_health "postgres"

# Check Redis health
check_service_health "redis"

# Check application health
echo -e "${BLUE}🔍 Checking application health...${NC}"
sleep 30

# Test application endpoint
if curl -f -s "http://localhost:3000/api/health" > /dev/null; then
    echo -e "${GREEN}✅ Application is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Application might still be starting...${NC}"
fi

# Show running services
echo -e "${BLUE}📊 Stack Status:${NC}"
docker compose -f $COMPOSE_FILE ps

# Show logs for any failed services
failed_services=$(docker compose -f $COMPOSE_FILE ps --filter "status=exited" --format "table {{.Service}}" | tail -n +2)
if [[ -n "$failed_services" ]]; then
    echo -e "${RED}❌ Failed services detected:${NC}"
    echo "$failed_services"
    echo -e "${YELLOW}📋 Showing logs for failed services:${NC}"
    for service in $failed_services; do
        echo -e "${YELLOW}--- Logs for $service ---${NC}"
        docker compose -f $COMPOSE_FILE logs --tail=50 $service
    done
fi

# Display access information
echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo "=================================="
echo -e "${BLUE}📱 Application URL:${NC} https://${DOMAIN}"
echo -e "${BLUE}🤖 N8N URL:${NC} https://n8n.${DOMAIN}"
echo -e "${BLUE}🐳 Portainer:${NC} https://portainer.${DOMAIN} (if configured)"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Configure your domain DNS to point to this server"
echo "2. Wait for SSL certificates to be issued (may take a few minutes)"
echo "3. Access the application and complete the setup"
echo "4. Configure your first WhatsApp connection"
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo "- View logs: docker compose -f $COMPOSE_FILE logs -f"
echo "- Stop stack: docker compose -f $COMPOSE_FILE down"
echo "- Restart stack: docker compose -f $COMPOSE_FILE restart"
echo "- Update stack: ./deploy-stack.sh"
echo ""
echo -e "${GREEN}✅ Frontzap is now running!${NC}"
