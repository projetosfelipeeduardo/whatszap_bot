# 🚀 Frontzap Stack - Guia de Deploy

Este guia explica como fazer o deploy da stack Frontzap usando Docker Compose com Traefik e Portainer já instalados.

## 📋 Pré-requisitos

- ✅ Docker e Docker Compose instalados
- ✅ Traefik configurado e funcionando
- ✅ Portainer instalado
- ✅ Domínio configurado apontando para o servidor
- ✅ Rede `traefik` criada

## 🔧 Configuração

### 1. Preparar Ambiente

\`\`\`bash
# Clone o repositório
git clone https://github.com/seu-usuario/frontzap.git
cd frontzap

# Copiar arquivo de configuração
cp .env.stack .env
\`\`\`

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env` com suas configurações:

\`\`\`bash
nano .env
\`\`\`

**Variáveis obrigatórias:**
- `DOMAIN` - Seu domínio (ex: frontzap.seudominio.com)
- `POSTGRES_PASSWORD` - Senha do PostgreSQL
- `REDIS_PASSWORD` - Senha do Redis
- `NEXTAUTH_SECRET` - Chave secreta para autenticação
- `JWT_SECRET` - Chave secreta para JWT

**Variáveis opcionais mas recomendadas:**
- Configurações do Supabase
- Configurações do Stripe
- Configurações do N8N

### 3. Gerar Senhas Seguras

\`\`\`bash
# Gerar senhas aleatórias
openssl rand -base64 32  # Para NEXTAUTH_SECRET
openssl rand -base64 32  # Para JWT_SECRET
openssl rand -base64 16  # Para POSTGRES_PASSWORD
openssl rand -base64 16  # Para REDIS_PASSWORD
\`\`\`

## 🚀 Deploy

### Opção 1: Deploy Automático (Recomendado)

\`\`\`bash
# Dar permissão de execução
chmod +x deploy-stack.sh

# Executar deploy
./deploy-stack.sh
\`\`\`

### Opção 2: Deploy Manual

\`\`\`bash
# Criar rede se não existir
docker network create traefik

# Fazer pull das imagens
docker compose -f docker-compose.stack.yml pull

# Build da aplicação
docker compose -f docker-compose.stack.yml build

# Iniciar stack
docker compose -f docker-compose.stack.yml up -d
\`\`\`

### Opção 3: Deploy via Portainer

1. Acesse Portainer → **Stacks** → **Add Stack**
2. Nome: `frontzap`
3. Cole o conteúdo do `docker-compose.stack.yml`
4. Configure as variáveis de ambiente
5. Clique em **Deploy the stack**

## 🌐 Acessos

Após o deploy bem-sucedido:

- **Aplicação Principal**: `https://seudominio.com`
- **N8N (Automações)**: `https://n8n.seudominio.com`

## 🔍 Verificação

### Verificar Status dos Serviços

\`\`\`bash
# Ver status
docker compose -f docker-compose.stack.yml ps

# Ver logs
docker compose -f docker-compose.stack.yml logs -f

# Verificar saúde da aplicação
curl -f https://seudominio.com/api/health
\`\`\`

### Verificar Banco de Dados

\`\`\`bash
# Conectar ao PostgreSQL
docker compose -f docker-compose.stack.yml exec postgres psql -U postgres -d frontzap

# Listar tabelas
\dt

# Verificar usuários
SELECT email, full_name, plan_type FROM users;
\`\`\`

## 🔄 Backup

### Backup Manual

\`\`\`bash
# Executar backup
./backup-stack.sh
\`\`\`

### Backup Automático

\`\`\`bash
# Adicionar ao crontab
crontab -e

# Adicionar linha para backup diário às 2h
0 2 * * * /caminho/para/frontzap/backup-stack.sh
\`\`\`

## 🛠️ Manutenção

### Comandos Úteis

\`\`\`bash
# Parar stack
docker compose -f docker-compose.stack.yml down

# Reiniciar stack
docker compose -f docker-compose.stack.yml restart

# Atualizar aplicação
git pull
docker compose -f docker-compose.stack.yml build frontzap
docker compose -f docker-compose.stack.yml up -d frontzap

# Ver logs específicos
docker compose -f docker-compose.stack.yml logs -f frontzap
docker compose -f docker-compose.stack.yml logs -f postgres
docker compose -f docker-compose.stack.yml logs -f redis
docker compose -f docker-compose.stack.yml logs -f n8n
\`\`\`

### Limpeza

\`\`\`bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Remover volumes não utilizados (CUIDADO!)
docker volume prune
\`\`\`

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Erro de Rede Traefik
\`\`\`bash
# Verificar se a rede existe
docker network ls | grep traefik

# Criar se não existir
docker network create traefik
\`\`\`

#### 2. Erro de Permissões
\`\`\`bash
# Ajustar permissões
sudo chown -R $USER:$USER .
chmod +x *.sh
\`\`\`

#### 3. Erro de SSL
- Aguarde alguns minutos para o Let's Encrypt gerar os certificados
- Verifique se o domínio está apontando corretamente
- Verifique os logs do Traefik

#### 4. Banco de Dados não Conecta
\`\`\`bash
# Verificar logs do PostgreSQL
docker compose -f docker-compose.stack.yml logs postgres

# Verificar se o banco foi criado
docker compose -f docker-compose.stack.yml exec postgres psql -U postgres -l
\`\`\`

#### 5. Aplicação não Responde
\`\`\`bash
# Verificar logs da aplicação
docker compose -f docker-compose.stack.yml logs frontzap

# Verificar se as variáveis estão corretas
docker compose -f docker-compose.stack.yml exec frontzap env | grep -E "(DATABASE_URL|REDIS_URL)"
\`\`\`

## 📊 Monitoramento

### Health Checks

A stack inclui health checks automáticos para todos os serviços:

- **PostgreSQL**: Verifica conexão com o banco
- **Redis**: Verifica resposta do servidor
- **Aplicação**: Verifica endpoint `/api/health`

### Logs

\`\`\`bash
# Logs em tempo real
docker compose -f docker-compose.stack.yml logs -f

# Logs específicos
docker compose -f docker-compose.stack.yml logs -f frontzap

# Logs com timestamp
docker compose -f docker-compose.stack.yml logs -f -t
\`\`\`

## 🔐 Segurança

### Recomendações

1. **Senhas Fortes**: Use senhas complexas para todos os serviços
2. **Firewall**: Configure firewall para permitir apenas portas necessárias
3. **Backups**: Configure backups automáticos
4. **Updates**: Mantenha as imagens atualizadas
5. **Monitoramento**: Configure alertas para falhas

### Portas Utilizadas

- **80/443**: Traefik (HTTP/HTTPS)
- **3000**: Aplicação Frontzap (interno)
- **5432**: PostgreSQL (interno)
- **6379**: Redis (interno)
- **5678**: N8N (interno)

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs dos serviços
2. Consulte a documentação do Traefik
3. Verifique as configurações de DNS
4. Entre em contato com o suporte

---

**Frontzap Stack** - Plataforma completa de automação WhatsApp com IA
