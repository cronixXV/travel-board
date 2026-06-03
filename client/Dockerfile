FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_URL
ARG VITE_PUBLIC_APP_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PUBLIC_APP_URL=$VITE_PUBLIC_APP_URL

COPY package*.json ./
COPY client/package*.json ./client/
COPY shared/package*.json ./shared/

RUN npm ci

COPY shared/ ./shared/
COPY client/ ./client/

RUN npm run build -w shared
RUN npm run build -w client

FROM nginx:alpine

COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]