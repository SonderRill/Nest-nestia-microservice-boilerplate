FROM node:22-alpine AS base
# Install openssl for Prisma (required for runtime)
RUN apk add --no-cache openssl
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# CI=true skips prisma generate in postinstall (we'll run it explicitly after copying schema)
# postinstall will only run ts-patch install and typia patch (via prepare script)
ENV CI=true
# Install ALL dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copy Prisma schema and configuration
COPY prisma ./prisma
COPY prisma.config.ts ./
# Copy remaining source files
COPY . .
# Generate Prisma Client after copying schema
RUN pnpm prisma generate
RUN pnpm run build

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
# CI=true also for production dependencies (Prisma already generated in builder)
ENV CI=true
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

FROM node:22-alpine AS runner
# Install openssl for Prisma (required for runtime)
RUN apk add --no-cache openssl
WORKDIR /usr/src/app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /usr/src/app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/prisma ./prisma
COPY --from=prod-deps --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY package.json ./

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node -e "fetch('http://127.0.0.1:7000/health').then(()=>process.exit(0)).catch(()=>process.exit(1))"

USER nestjs
EXPOSE 7000

CMD ["node", "dist/src/bin/single"]
