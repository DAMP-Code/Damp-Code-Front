# syntax=docker/dockerfile:1

# Etapa de build: gera o dist/ com o Vite.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Vazio = chamadas relativas (/api/...), repassadas pelo nginx para a API.
# Para chamar uma API em outro domínio: --build-arg VITE_API_URL=https://api.exemplo.com
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Etapa final: nginx sem root servindo o dist/ na porta 8080.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS final

# O nginx troca ${API_UPSTREAM} no template ao iniciar o container.
ENV API_UPSTREAM=http://api:8080
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
