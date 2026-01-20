FROM node:22.20.0-alpine AS build
WORKDIR /app

COPY package*.json ./

COPY package-lock.json ./

RUN npm ci

COPY angular.json ./
COPY tsconfig*.json ./
COPY public ./public
COPY src ./src

# 3) Aumentar heap de Node SOLO para el build
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN npm run build 

FROM nginx:alpine

COPY --from=build /app/dist/aplicacionweb-facturacion-no-estructurada /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
