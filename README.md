# Frontzapp - Plataforma de Agentes IA para WhatsApp

Uma plataforma completa para criação e gerenciamento de agentes de IA para WhatsApp, com automações avançadas, chatbots inteligentes e análise de dados.

## 🚀 Funcionalidades

- **Conexões WhatsApp**: Conecte múltiplos números WhatsApp
- **Automações Inteligentes**: Crie fluxos automatizados com IA
- **Chatbot Avançado**: Respostas inteligentes com processamento de linguagem natural
- **Gerenciamento de Contatos**: Organize e segmente sua audiência
- **Análise de Dados**: Relatórios detalhados e métricas de performance
- **Integrações**: Conecte com suas ferramentas favoritas
- **Multi-tenant**: Suporte para múltiplas empresas

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Caching**: Redis
- **Deployment**: Vercel, Docker

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase
- Conta Stripe (para pagamentos)
- Instância N8N (para automações WhatsApp)

## 🚀 Instalação e Deploy

### 1. Clone o repositório

\`\`\`bash
git clone https://github.com/seu-usuario/frontzapp.git
cd frontzapp
\`\`\`

### 2. Instale as dependências

\`\`\`bash
npm install
\`\`\`

### 3. Configure as variáveis de ambiente

\`\`\`bash
cp .env.example .env.local
\`\`\`

Preencha as variáveis no arquivo `.env.local`:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Stripe
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_stripe
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret

# N8N (opcional)
N8N_WEBHOOK_URL=https://sua-instancia-n8n.com/webhook
N8N_API_KEY=sua_chave_api_n8n
\`\`\`

### 4. Configure o banco de dados

Execute os scripts SQL no Supabase:

\`\`\`bash
# No painel do Supabase, execute os arquivos:
# scripts/create-tables.sql
# scripts/seed-plans.sql
\`\`\`

### 5. Execute em desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

Acesse [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy em Produção

### Deploy na Vercel (Recomendado)

1. **Conecte seu repositório à Vercel**
2. **Configure as variáveis de ambiente**
3. **Deploy automático**

\`\`\`bash
# Ou usando Vercel CLI
npm i -g vercel
vercel --prod
\`\`\`

### Deploy com Docker

\`\`\`bash
# Build da imagem
docker build -t frontzapp .

# Execute o container
docker run -p 3000:3000 --env-file .env frontzapp
\`\`\`

### Deploy com Docker Compose

\`\`\`bash
docker-compose up -d
\`\`\`

## 🧪 Testes

### Executar testes

\`\`\`bash
npm run test
\`\`\`

### Testes de cobertura

\`\`\`bash
npm run test:coverage
\`\`\`

### Health Check

Após o deploy, teste a saúde da aplicação:

\`\`\`bash
curl https://sua-app.vercel.app/api/health
\`\`\`

### Teste das funcionalidades

\`\`\`bash
curl https://sua-app.vercel.app/api/test
\`\`\`

## 📊 Monitoramento

### Métricas disponíveis

- `/api/health` - Status da aplicação
- `/api/test` - Testes de funcionalidade
- Dashboard com métricas em tempo real

### Logs

- Logs de aplicação via Vercel
- Logs de banco via Supabase
- Logs de pagamento via Stripe

## 🔧 Configuração Avançada

### Supabase Setup

1. **Crie um novo projeto no Supabase**
2. **Execute os scripts SQL**
3. **Configure RLS (Row Level Security)**
4. **Configure webhooks se necessário**

### Stripe Setup

1. **Crie produtos e preços no Stripe**
2. **Configure webhooks para `/api/webhook/stripe`**
3. **Teste pagamentos em modo sandbox**

### N8N Setup (Opcional)

1. **Configure instância N8N**
2. **Crie workflows para WhatsApp**
3. **Configure webhooks**

## 🚨 Troubleshooting

### Problemas comuns

1. **Erro de conexão com banco**
   - Verifique as credenciais do Supabase
   - Confirme se as tabelas foram criadas

2. **Erro de autenticação**
   - Verifique as chaves do Supabase
   - Confirme configuração de RLS

3. **Erro de pagamento**
   - Verifique chaves do Stripe
   - Confirme configuração de webhooks

### Debug

\`\`\`bash
# Logs detalhados
NODE_ENV=development npm run dev

# Teste de conectividade
curl -X GET https://sua-app.com/api/health
\`\`\`

## 📈 Melhorias Implementadas

### Performance
- ✅ Caching com Redis
- ✅ Otimização de queries
- ✅ Lazy loading de componentes
- ✅ Compressão de assets

### Segurança
- ✅ Row Level Security (RLS)
- ✅ Validação de entrada
- ✅ Rate limiting
- ✅ CORS configurado

### Monitoramento
- ✅ Health checks
- ✅ Logs estruturados
- ✅ Métricas de performance
- ✅ Error tracking

### UX/UI
- ✅ Loading states
- ✅ Error boundaries
- ✅ Responsive design
- ✅ Dark mode support

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- Email: suporte@frontzapp.com
- Discord: [Link do Discord]
- Documentação: [Link da documentação]
