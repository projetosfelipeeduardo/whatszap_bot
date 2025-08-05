# 🚀 Deploy Frontzap Stack - Portainer + Traefik

Este guia mostra como fazer o deploy do Frontzap usando uma stack no Portainer com Traefik já configurado.

## 📋 Pré-requisitos

- ✅ Docker instalado
- ✅ Traefik rodando
- ✅ Portainer instalado
- ✅ Domínio configurado

## 🔧 Configuração Rápida

### 1. Preparar Arquivos

\`\`\`bash
# Clone o repositório
git clone https://github.com/seu-usuario/frontzap.git
cd frontzap

# Configure as variáveis
cp .env.stack .env
nano .env
\`\`\`

### 2. Configurar Variáveis (.env)

\`\`\`env
# Seu domínio
DOMAIN=seudominio.com

# Senhas seguras
POSTGRES_PASSWORD=senha_super_segura_postgres
REDIS_PASSWORD=senha_super_segura_redis
N8N_PASSWORD=senha_super_segura_n8n
NEXTAUTH_SECRET=chave_muito_longa_e_segura_nextauth

# Configurações Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Configurações Stripe
STRIPE_SECRET_KEY=sk_test_ou_live_sua_chave
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_ou_live_sua_chave
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook
\`\`\`

### 3. Deploy Automático

\`\`\`bash
# Dar permissão e executar
chmod +x deploy-stack.sh
./deploy-stack.sh
\`\`\`

## 🎛️ Deploy via Portainer

### Opção 1: Via Interface Web

1. Acesse seu Portainer
2. Vá em **Stacks** → **Add Stack**
3. Nome: `frontzap`
4. Cole o conteúdo do `docker-compose.stack.yml`
5. Configure as variáveis de ambiente
6. Clique em **Deploy**

### Opção 2: Via Git Repository

1. No Portainer, vá em **Stacks** → **Add Stack**
2. Selecione **Repository**
3. URL: `https://github.com/seu-usuario/frontzap`
4. Compose file: `docker-compose.stack.yml`
5. Environment file: `.env.stack`
6. **Deploy**

## 🌐 Acessos

Após o deploy:

- **🏠 Aplicação**: `https://seudominio.com`
- **🤖 N8N**: `https://n8n.seudominio.com`

## 🔧 Comandos Úteis

\`\`\`bash
# Ver logs
docker-compose -f docker-compose.stack.yml logs -f

# Parar stack
docker-compose -f docker-compose.stack.yml down

# Reiniciar serviço específico
docker-compose -f docker-compose.stack.yml restart frontzap

# Backup
./backup-stack.sh

# Status dos serviços
docker-compose -f docker-compose.stack.yml ps
\`\`\`

## 🛡️ Segurança

A stack inclui:

- ✅ **SSL automático** via Traefik
- ✅ **Headers de segurança**
- ✅ **Redes isoladas**
- ✅ **Health checks**
- ✅ **Senhas criptografadas**

## 🔄 Backup Automático

Configure backup diário no cron:

\`\`\`bash
# Editar crontab
crontab -e

# Adicionar linha (backup às 2h da manhã)
0 2 * * * /caminho/para/frontzap/backup-stack.sh
\`\`\`

## 🚨 Troubleshooting

### Problema: Serviço não inicia
\`\`\`bash
# Ver logs específicos
docker logs frontzap-app
docker logs frontzap-postgres
\`\`\`

### Problema: SSL não funciona
- Verifique se o domínio aponta para o servidor
- Confirme se Traefik está configurado corretamente
- Aguarde alguns minutos para o certificado ser gerado

### Problema: Banco não conecta
\`\`\`bash
# Testar conexão
docker-compose -f docker-compose.stack.yml exec postgres psql -U frontzap -d frontzap
\`\`\`

## 📊 Monitoramento

Para monitoramento avançado, use a stack de monitoramento:

\`\`\`bash
docker-compose -f docker-compose.monitoring.yml up -d
\`\`\`

Isso adiciona:
- **Prometheus** (métricas)
- **Grafana** (dashboards)
- **AlertManager** (alertas)
