#!/bin/bash

echo "🚀 Configurando ambiente de desenvolvimento Frontzap..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.dev.yml down

# Remover volumes antigos (opcional)
read -p "🗑️  Deseja remover dados antigos do banco? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose -f docker-compose.dev.yml down -v
    echo "✅ Dados antigos removidos"
fi

# Iniciar serviços
echo "🐳 Iniciando PostgreSQL e Redis..."
docker-compose -f docker-compose.dev.yml up -d

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 10

# Verificar se PostgreSQL está pronto
echo "🔍 Verificando PostgreSQL..."
until docker exec frontzap-postgres pg_isready -U frontzap; do
    echo "⏳ Aguardando PostgreSQL..."
    sleep 2
done

# Verificar se Redis está pronto
echo "🔍 Verificando Redis..."
until docker exec frontzap-redis redis-cli ping; do
    echo "⏳ Aguardando Redis..."
    sleep 2
done

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Executar migrações
echo "🗄️  Executando migrações do banco..."
npx prisma db push

# Criar usuário administrador
echo "👤 Criando usuário administrador..."
docker exec -i frontzap-postgres psql -U frontzap -d frontzap < scripts/create-admin.sql

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "🌐 Serviços disponíveis:"
echo "   - Aplicação: http://localhost:3000"
echo "   - Adminer (DB): http://localhost:8080"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo ""
echo "👤 Credenciais de login:"
echo "   - Email: admin@frontzap.com"
echo "   - Senha: admin123"
echo ""
echo "🚀 Para iniciar a aplicação:"
echo "   npm run dev"
echo ""
echo "🛑 Para parar os serviços:"
echo "   docker-compose -f docker-compose.dev.yml down"
