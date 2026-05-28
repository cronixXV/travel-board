FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/
COPY shared/package*.json ./shared/

RUN npm install

COPY shared/ ./shared/
COPY server/ ./server/

RUN npm run build -w shared
RUN npm run build -w server

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server/package*.json ./server/
COPY --from=builder /app/shared/package*.json ./shared/
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/shared/dist ./shared/dist

RUN npm install --omit=dev

CMD ["node", "server/dist/index.js"]