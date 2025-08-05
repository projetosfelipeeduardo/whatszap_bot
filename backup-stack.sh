#!/bin/bash

# Frontzap Stack Backup Script

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Carregar variáveis de ambiente
if [ -f ".env.stack" ]; then
    export $(cat .env.stack | grep -v '^#' | xargs)
fi

# Criar diretório de backup
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

log "🗄️ Iniciando backup da stack Frontzap..."

# Backup do PostgreSQL
log "Fazendo backup do PostgreSQL..."
docker-compose -f docker-compose.stack.yml exec -T postgres pg_dump -U ${POSTGRES_USER:-frontzap} ${POSTGRES_DB:-frontzap} > "$BACKUP_DIR/postgres_backup.sql"

# Backup do Redis
log "Fazendo backup do Redis..."
docker-compose -f docker-compose.stack.yml exec -T redis redis-cli --rdb /data/dump.rdb
docker cp frontzap-redis:/data/dump.rdb "$BACKUP_DIR/redis_backup.rdb"

# Backup dos volumes N8N
log "Fazendo backup dos dados do N8N..."
docker run --rm -v frontzap_n8n_data:/data -v $(pwd)/$BACKUP_DIR:/backup alpine tar czf /backup/n8n_backup.tar.gz -C /data .

# Backup dos arquivos de configuração
log "Fazendo backup das configurações..."
cp .env.stack "$BACKUP_DIR/"
cp docker-compose.stack.yml "$BACKUP_DIR/"

# Compactar backup
log "Compactando backup..."
tar -czf "backups/frontzap_backup_$(date +%Y%m%d_%H%M%S).tar.gz" -C "$BACKUP_DIR" .
rm -rf "$BACKUP_DIR"

log "✅ Backup concluído com sucesso!"
log "📁 Arquivo: backups/frontzap_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
