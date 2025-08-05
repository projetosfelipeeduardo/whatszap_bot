# 🚀 Guia de Deploy - Frontzap com Docker, Portainer e Traefik

## 📋 Pré-requisitos

- Servidor Ubuntu/Debian com pelo menos 4GB RAM
- Domínio configurado apontando para o servidor
- Acesso root ao servidor

## 🔧 Configuração Inicial

### 1. Preparar o Servidor

\`\`\`bash
# Conectar ao servidor
ssh root@seu-servidor

# Clonar o repositório
git clone https://github.com/seu-usuario/frontzap.git
cd frontzap

# Dar permissão aos scripts
chmod +x deploy.sh update.sh backup.sh
\`\`\`

### 2. Configurar Domínio

Edite o arquivo `.env.production` e configure:

\`\`\`env
DOMAIN=seudominio.com
\`\`\`

Configure os DNS do seu domínio:
- `A` record: `seudominio.com` → IP do servidor
- `CNAME` record: `*.seudominio.com` → `seudominio.com`

### 3. Executar Deploy

\`\`\`bash
sudo ./deploy.sh
\`\`\`

O script irá:
- ✅ Instalar Docker e Docker Compose
- ✅ Criar redes e volumes necessários
- ✅ Configurar Traefik com SSL automático
- ✅ Subir todos os serviços
- ✅ Executar migrações do banco

## 🌐 Serviços Disponíveis

Após o deploy, você terá acesso a:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontzap** | `https://seudominio.com` | Aplicação principal |
| **Portainer** | `https://portainer.seudominio.com` | Gerenciamento Docker |
| **Traefik** | `https://traefik.seudominio.com` | Proxy reverso |
| **N8N** | `https://n8n.seudominio.com` | Automações WhatsApp |

## 🔐 Credenciais Padrão

- **Traefik**: admin / (senha definida no deploy)
- **N8N**: admin / (senha definida no .env)
- **Portainer**: Configurar no primeiro acesso

## 📊 Monitoramento (Opcional)

Para ativar monitoramento com Prometheus e Grafana:

\`\`\`bash
# Adicionar senha do Grafana no .env
echo "GRAFANA_PASSWORD=sua_senha_segura" >> .env

# Subir serviços de monitoramento
docker-compose -f docker-compose.monitoring.yml up -d
\`\`\`

Acesse:
- **Prometheus**: `https://prometheus.seudominio.com`
- **Grafana**: `https://grafana.seudominio.com`

## 🔄 Comandos Úteis

\`\`\`bash
# Ver logs
docker-compose logs -f frontzap

# Reiniciar serviços
docker-compose restart

# Atualizar aplicação
./update.sh

# Fazer backup
./backup.sh

# Parar todos os serviços
docker-compose down

# Ver status
docker-compose ps
\`\`\`

## 🛠️ Troubleshooting

### SSL não funciona
\`\`\`bash
# Verificar logs do Traefik
docker-compose logs traefik

# Verificar se o domínio está apontando corretamente
nslookup seudominio.com
\`\`\`

### Aplicação não carrega
\`\`\`bash
# Verificar logs da aplicação
docker-compose logs frontzap

# Verificar banco de dados
docker-compose exec postgres psql -U frontzap_user -d frontzap
\`\`\`

### Portainer não acessa
\`\`\`bash
# Reiniciar Portainer
docker-compose restart portainer

# Verificar rede
docker network ls
\`\`\`

## 🔒 Segurança

- ✅ SSL automático via Let's Encrypt
- ✅ Autenticação básica no Traefik
- ✅ Rede interna isolada
- ✅ Senhas seguras configuradas
- ✅ Backup automático

## 📈 Performance

- ✅ Redis para cache
- ✅ PostgreSQL otimizado
- ✅ Compressão Gzip
- ✅ Headers de segurança
- ✅ Healthchecks automáticos

## 🆘 Suporte

Em caso de problemas:

1. Verificar logs: `docker-compose logs`
2. Verificar status: `docker-compose ps`
3. Reiniciar serviços: `docker-compose restart`
4. Verificar recursos: `htop` ou `docker stats`
