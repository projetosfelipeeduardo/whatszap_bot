#!/bin/bash

# Frontzap Stack Backup Script
# This script creates backups of the database and important files

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
COMPOSE_FILE="docker-compose.stack.yml"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="frontzap_backup_${TIMESTAMP}"

echo -e "${BLUE}💾 Frontzap Backup Script${NC}"
echo "=========================="

# Load environment variables
if [[ -f ".env" ]]; then
    source .env
else
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup subdirectory
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
mkdir -p "$BACKUP_PATH"

echo -e "${BLUE}📁 Backup location: $BACKUP_PATH${NC}"

# Backup database
echo -e "${BLUE}🗄️  Backing up PostgreSQL database...${NC}"
docker compose -f $COMPOSE_FILE exec -T postgres pg_dump \
    -U "${POSTGRES_USER:-postgres}" \
    -d "${POSTGRES_DB:-frontzap}" \
    --no-owner --no-privileges \
    > "$BACKUP_PATH/database.sql"

if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ Database backup completed${NC}"
else
    echo -e "${RED}❌ Database backup failed${NC}"
    exit 1
fi

# Backup Redis data
echo -e "${BLUE}🔄 Backing up Redis data...${NC}"
docker compose -f $COMPOSE_FILE exec -T redis redis-cli \
    --rdb /data/dump.rdb \
    BGSAVE

# Wait for Redis backup to complete
sleep 5

# Copy Redis dump
docker cp $(docker compose -f $COMPOSE_FILE ps -q redis):/data/dump.rdb "$BACKUP_PATH/redis_dump.rdb" 2>/dev/null || echo -e "${YELLOW}⚠️  Redis backup may not be available${NC}"

# Backup application files
echo -e "${BLUE}📄 Backing up application files...${NC}"

# Backup environment file
cp .env "$BACKUP_PATH/env_backup"

# Backup docker-compose file
cp $COMPOSE_FILE "$BACKUP_PATH/"

# Backup logs if they exist
if [[ -d "logs" ]]; then
    cp -r logs "$BACKUP_PATH/"
fi

# Backup uploads if they exist
if [[ -d "uploads" ]]; then
    cp -r uploads "$BACKUP_PATH/"
fi

# Create backup info file
cat > "$BACKUP_PATH/backup_info.txt" << EOF
Frontzap Backup Information
===========================
Backup Date: $(date)
Backup Name: $BACKUP_NAME
Server: $(hostname)
Docker Compose File: $COMPOSE_FILE

Services Status at Backup Time:
$(docker compose -f $COMPOSE_FILE ps)

Database Info:
- Database: ${POSTGRES_DB:-frontzap}
- User: ${POSTGRES_USER:-postgres}

Backup Contents:
- database.sql: PostgreSQL database dump
- redis_dump.rdb: Redis data dump
- env_backup: Environment variables
- docker-compose.stack.yml: Docker compose configuration
- logs/: Application logs (if available)
- uploads/: Uploaded files (if available)
EOF

# Compress backup
echo -e "${BLUE}🗜️  Compressing backup...${NC}"
cd "$BACKUP_DIR"
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"

if [[ $? -eq 0 ]]; then
    # Remove uncompressed backup
    rm -rf "$BACKUP_NAME"
    
    # Get backup size
    BACKUP_SIZE=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
    
    echo -e "${GREEN}✅ Backup compressed successfully${NC}"
    echo -e "${BLUE}📦 Backup file: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz${NC}"
    echo -e "${BLUE}📏 Backup size: $BACKUP_SIZE${NC}"
else
    echo -e "${RED}❌ Backup compression failed${NC}"
    exit 1
fi

# Cleanup old backups (keep last 7 days)
echo -e "${BLUE}🧹 Cleaning up old backups...${NC}"
find "$BACKUP_DIR" -name "frontzap_backup_*.tar.gz" -mtime +7 -delete

# Count remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "frontzap_backup_*.tar.gz" | wc -l)
echo -e "${GREEN}✅ Cleanup completed. $BACKUP_COUNT backups retained${NC}"

# Upload to S3 if configured
if [[ -n "$AWS_ACCESS_KEY_ID" && -n "$AWS_SECRET_ACCESS_KEY" && -n "$BACKUP_S3_BUCKET" ]]; then
    echo -e "${BLUE}☁️  Uploading backup to S3...${NC}"
    
    if command -v aws &> /dev/null; then
        aws s3 cp "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" "s3://$BACKUP_S3_BUCKET/frontzap-backups/"
        
        if [[ $? -eq 0 ]]; then
            echo -e "${GREEN}✅ Backup uploaded to S3${NC}"
        else
            echo -e "${YELLOW}⚠️  S3 upload failed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  AWS CLI not installed, skipping S3 upload${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Backup completed successfully!${NC}"
echo "=================================="
echo -e "${BLUE}📦 Backup file:${NC} ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo -e "${BLUE}📏 Size:${NC} $BACKUP_SIZE"
echo -e "${BLUE}📅 Date:${NC} $(date)"
echo ""
echo -e "${YELLOW}💡 To restore from this backup:${NC}"
echo "1. Extract: tar -xzf ${BACKUP_NAME}.tar.gz"
echo "2. Restore database: docker compose exec -T postgres psql -U postgres -d frontzap < database.sql"
echo "3. Restore Redis: docker cp redis_dump.rdb container:/data/"
echo "4. Restart services: docker compose restart"
