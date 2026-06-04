# 🗺 Wanderboard

[![CI](https://github.com/cronixXV/travel-board/actions/workflows/ci.yml/badge.svg)](https://github.com/cronixXV/travel-board/actions/workflows/ci.yml)

**Wanderboard** — персональная интерактивная карта путешествий.

Отмечай места, где побывал, добавляй описания и фотографии, собирай статистику по странам и делись своей картой с друзьями по публичной ссылке.

## Demo

- Frontend: https://travel-board-seven.vercel.app
- Backend health check: https://travel-board-production.up.railway.app/health

## Фичи

- 🗺 Интерактивная карта — двойной клик добавляет место
- 📍 Автоматическое определение страны по координатам
- 📸 Загрузка фото с drag-and-drop
- 🖼 Галерея фото с lightbox-просмотром
- 🔗 Публичная страница карты по ссылке `/map/:username`
- 👁 Переключение видимости места: публичное / скрытое
- 📊 Статистика — места, страны, фотографии
- 🌙 Светлая и тёмная тема
- 🔐 JWT авторизация с refresh token в httpOnly cookie
- 🛡 Rate limiting на auth endpoints
- 🧱 Monorepo на npm workspaces
- 🚀 Деплой: Railway backend + PostgreSQL, Vercel frontend
- ✅ GitHub Actions CI
- 🧪 E2E-тесты на Playwright: auth, places, photo upload, public map

## Стек

### Frontend

- React
- TypeScript
- Feature-Sliced Design
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- React Leaflet
- Tailwind CSS
- shadcn/ui-style components
- lucide-react
- yet-another-react-lightbox

### Backend

- Node.js
- Express
- TypeScript
- Sequelize
- PostgreSQL
- JWT auth
- bcrypt
- multer
- helmet
- express-rate-limit
- Zod validation

### Infrastructure

- npm workspaces
- Docker Compose
- Railway
- Vercel
- GitHub Actions

## Структура проекта

```txt
travel-board/
├── client/                 # Frontend-приложение
│   ├── src/
│   │   ├── app/             # Инициализация приложения, роутинг, стили
│   │   ├── pages/           # Страницы
│   │   ├── widgets/         # Крупные UI-блоки
│   │   ├── features/        # Пользовательские сценарии
│   │   ├── entities/        # Бизнес-сущности
│   │   └── shared/          # Общие UI, lib, api, config
│   └── public/
│
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/          # env и конфигурация
│   │   ├── database/        # Sequelize models, migrations, DB init
│   │   ├── middleware/      # auth, error-handler, rate-limit
│   │   ├── routes/          # auth, places, photos, spa
│   │   ├── types/           # типы
│   │   └── utils/           # jwt, geocoding, render html
│
├── shared/                 # Общие схемы и типы
│   └── schemas/
│
├── .github/workflows/      # GitHub Actions CI
├── docker-compose.yml      # Локальная PostgreSQL БД
├── docker-compose.dev.yml  # Полное dev-окружение в Docker
├── .env.example
├── vercel.json             # SPA fallback для Vercel
└── package.json
```

## Быстрый старт

### Требования

- Node.js 20.19+
- npm 10+
- Docker
- Docker Compose

### Установка

```bash
git clone https://github.com/cronixXV/travel-board.git
cd travel-board

npm install

cp .env.example .env
```

Заполни `.env` локальными значениями.

Для локальной разработки, когда база запущена в Docker, а frontend/backend запускаются локально, `DATABASE_URL` должен смотреть на `localhost`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wanderboard
CLIENT_URL=http://localhost:5173
APP_PUBLIC_URL=http://localhost:3000
API_PUBLIC_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000
VITE_PUBLIC_APP_URL=http://localhost:3000
```

### Запуск локально

Подними PostgreSQL:

```bash
docker compose up -d
```

Запусти миграции:

```bash
cd server
npx sequelize-cli db:migrate
cd ..
```

Запусти frontend и backend:

```bash
npm run dev
```

Открыть:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health check: http://localhost:3000/health

## Команды

```bash
npm run dev          # запуск client + server в dev-режиме
npm run build        # сборка всех workspaces
npm run typecheck    # проверка типов
npm run lint         # линтинг
npm run format       # форматирование prettier
npm run clean        # очистка dist-директорий
```

Анализ client bundle:

```bash
npm run analyze -w client
```

## Docker

```bash
# Только PostgreSQL для локальной разработки
docker compose up -d

# Остановить локальную БД
docker compose down

# Полное dev-окружение в Docker
docker compose -f docker-compose.dev.yml up --build

# Остановить полное dev-окружение
docker compose -f docker-compose.dev.yml down
```

Удалить локальную БД вместе с volume:

```bash
docker compose down -v
```

> Осторожно: команда удалит локальные данные PostgreSQL.

## Environment variables

Пример находится в `.env.example`.

### Backend

```env
PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wanderboard

JWT_SECRET=your-secret-minimum-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-chars

CLIENT_URL=http://localhost:5173

APP_PUBLIC_URL=http://localhost:3000
API_PUBLIC_URL=http://localhost:3000

CLIENT_DIST_PATH=../client/dist
UPLOADS_DIR=./uploads
```

### Frontend

```env
VITE_API_URL=http://localhost:3000
VITE_PUBLIC_APP_URL=http://localhost:3000
```

## API routes

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

### Places

```txt
GET    /api/places
GET    /api/places/:id
POST   /api/places
PATCH  /api/places/:id
DELETE /api/places/:id
```

### Public map

```txt
GET /api/places/public/:username
GET /map/:username
```

### Photos

```txt
POST   /api/places/:id/photos
DELETE /api/places/:placeId/photos/:photoId
GET    /uploads/:filename
```

## Авторизация

Проект использует:

- Access token в памяти клиента
- Refresh token в httpOnly cookie
- Axios interceptor для автоматического refresh
- Protected routes на frontend
- `authenticate` middleware на backend

Для production-деплоя с разными доменами frontend/backend используются cookie-настройки:

```ts
secure: true;
sameSite: 'none';
```

## Работа с фото

Фото загружаются через `multer` и сохраняются в директорию `UPLOADS_DIR`.

Локально:

```env
UPLOADS_DIR=./uploads
```

На Railway:

```env
UPLOADS_DIR=/app/uploads
```

Для хранения фото в Railway используется persistent Volume. Изображения сохраняются после redeploy/restart backend service.

## Публичная карта

Каждый пользователь получает публичную ссылку:

```txt
/map/:username
```

В личном dashboard можно:

- скопировать публичную ссылку
- включить или выключить публичность отдельного места
- скрытые места не отображаются на публичной карте

## Security

На сервере используются:

- `helmet`
- `express-rate-limit` для auth routes
- `cors` с `credentials: true`
- httpOnly refresh cookie
- password hashing через `bcrypt`
- Zod validation
- protected private routes
- global error handler

## CI

GitHub Actions запускается на push и pull request в `main`.

Pipeline:

```txt
typecheck → lint → build
```

Workflow находится в:

```txt
.github/workflows/ci.yml
```

Перед коммитом можно локально проверить:

```bash
npm run typecheck
npm run lint
npm run build
```

## Deploy

### Backend — Railway

Backend задеплоен на Railway:

```txt
https://travel-board-production.up.railway.app
```

Используется:

- Railway service для Express backend
- Railway PostgreSQL
- Railway Volume для `/app/uploads`

Основные переменные Railway:

```env
NODE_ENV=production
PORT=3000

DATABASE_URL=${{Postgres.DATABASE_URL}}

JWT_SECRET=...
JWT_REFRESH_SECRET=...

CLIENT_URL=https://travel-board-seven.vercel.app
APP_PUBLIC_URL=https://travel-board-seven.vercel.app
API_PUBLIC_URL=https://travel-board-production.up.railway.app

UPLOADS_DIR=/app/uploads
CLIENT_DIST_PATH=/app/client/dist
```

Миграции:

```bash
DATABASE_URL="<DATABASE_PUBLIC_URL>" NODE_ENV=production npm run migrate -w server
```

### Frontend — Vercel

Frontend задеплоен на Vercel:

```txt
https://travel-board-seven.vercel.app
```

Основные переменные Vercel:

```env
VITE_API_URL=https://travel-board-production.up.railway.app
VITE_PUBLIC_APP_URL=https://travel-board-seven.vercel.app
```

Для SPA routes используется `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
