#!/bin/bash

# Frontzap Backup Script
BACKUP_DIR="/backups/frontzap"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 Iniciando backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
echo "📊 Backup do banco de dados..."
docker-compose exec -T postgres pg_dump -U frontzap_user frontzap > $BACKUP_DIR/postgres_$DATE.sql

# Backup Redis
echo "🔴 Backup do Redis..."
docker-compose exec -T redis redis-cli --rdb - > $BACKUP_DIR/redis_$DATE.rdb

# Backup volumes
echo "📁 Backup dos volumes..."
docker run --rm -v frontzap_postgres_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/postgres_volume_$DATE.tar.gz -C /data .
docker run --rm -v frontzap_redis_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/redis_volume_$DATE.tar.gz -C /data .
docker run --rm -v frontzap_n8n_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/n8n_volume_$DATE.tar.gz -C /data .

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup concluído em $BACKUP_DIR"
