FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY shared/package*.json ./shared/

RUN npm install

COPY shared/ ./shared/
COPY client/ ./client/

RUN npm run build -w shared
RUN npm run build -w client

FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80