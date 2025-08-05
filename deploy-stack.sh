#!/bin/bash

# Frontzap Stack Deployment Script
# Para uso com Traefik e Portainer já instalados

set -e

echo "🚀 Iniciando deploy do Frontzap Stack..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    error "Docker não está rodando!"
    exit 1
fi

# Verificar se a rede traefik existe
if ! docker network ls | grep -q "traefik"; then
    warn "Rede 'traefik' não encontrada. Criando..."
    docker network create traefik
fi

# Verificar se arquivo .env existe
if [ ! -f ".env.stack" ]; then
    error "Arquivo .env.stack não encontrado!"
    echo "Copie o arquivo .env.stack e configure suas variáveis:"
    echo "cp .env.stack .env"
    echo "nano .env"
    exit 1
fi

# Carregar variáveis de ambiente
log "Carregando variáveis de ambiente..."
export $(cat .env.stack | grep -v '^#' | xargs)

# Verificar variáveis obrigatórias
required_vars=("DOMAIN" "POSTGRES_PASSWORD" "REDIS_PASSWORD" "NEXTAUTH_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        error "Variável $var não está definida no .env.stack"
        exit 1
    fi
done

# Criar diretórios necessários
log "Criando diretórios necessários..."
mkdir -p logs
mkdir -p backups

# Build da aplicação
log "Fazendo build da aplicação Frontzap..."
docker build -t frontzap:latest .

# Deploy da stack
log "Fazendo deploy da stack..."
docker-compose -f docker-compose.stack.yml up -d

# Aguardar serviços ficarem prontos
log "Aguardando serviços ficarem prontos..."
sleep 30

# Verificar status dos serviços
log "Verificando status dos serviços..."
docker-compose -f docker-compose.stack.yml ps

# Executar migrações do banco
log "Executando migrações do banco de dados..."
docker-compose -f docker-compose.stack.yml exec -T postgres psql -U ${POSTGRES_USER:-frontzap} -d ${POSTGRES_DB:-frontzap} -f /docker-entrypoint-initdb.d/init-db.sql || warn "Migrações já executadas ou erro na execução"

# Verificar saúde dos serviços
log "Verificando saúde dos serviços..."
services=("frontzap-postgres" "frontzap-redis" "frontzap-app" "frontzap-n8n")
for service in "${services[@]}"; do
    if docker ps --filter "name=$service" --filter "status=running" | grep -q "$service"; then
        log "✅ $service está rodando"
    else
        error "❌ $service não está rodando"
    fi
done

# Mostrar URLs de acesso
log "🎉 Deploy concluído com sucesso!"
echo ""
echo -e "${BLUE}📱 Frontzap App: ${GREEN}https://${DOMAIN}${NC}"
echo -e "${BLUE}🤖 N8N Automations: ${GREEN}https://n8n.${DOMAIN}${NC}"
echo ""
echo -e "${YELLOW}📋 Para monitorar os logs:${NC}"
echo "docker-compose -f docker-compose.stack.yml logs -f"
echo ""
echo -e "${YELLOW}📋 Para parar a stack:${NC}"
echo "docker-compose -f docker-compose.stack.yml down"
echo ""
echo -e "${YELLOW}📋 Para fazer backup:${NC}"
echo "./backup-stack.sh"
