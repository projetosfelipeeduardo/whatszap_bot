#!/bin/bash

echo "🚀 Configurando ambiente de desenvolvimento FrontZap..."

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

# Verificar se PostgreSQL está rodando
echo "🔍 Verificando PostgreSQL..."
if docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U frontzap; then
    echo "✅ PostgreSQL está rodando"
else
    echo "❌ Erro ao conectar com PostgreSQL"
    exit 1
fi

# Verificar se Redis está rodando
echo "🔍 Verificando Redis..."
if docker-compose -f docker-compose.dev.yml exec redis redis-cli ping | grep -q PONG; then
    echo "✅ Redis está rodando"
else
    echo "❌ Erro ao conectar com Redis"
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Executar migrações
echo "🗄️  Executando migrações do banco..."
npx prisma db push

# Executar seed (criar admin)
echo "🌱 Criando usuário administrador..."
docker-compose -f docker-compose.dev.yml exec postgres psql -U frontzap -d frontzap -f /docker-entrypoint-initdb.d/init-db.sql

echo ""
echo "🎉 Configuração concluída com sucesso!"
echo ""
echo "📋 Informações importantes:"
echo "   • PostgreSQL: localhost:5432"
echo "   • Redis: localhost:6379"
echo "   • Admin: admin@frontzap.com / admin123"
echo ""
echo "🚀 Para iniciar a aplicação:"
echo "   npm run dev"
echo ""
echo "🔗 Acesse: http://localhost:3000"
