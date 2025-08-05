# Multi-stage build para otimização
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependências
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Build da aplicação
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

# Configurar variáveis de build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build da aplicação
RUN npm run build

# Imagem de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Criar diretórios necessários
RUN mkdir -p /app/logs /app/uploads
RUN chown -R nextjs:nodejs /app/logs /app/uploads

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
