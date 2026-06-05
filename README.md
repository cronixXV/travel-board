# 🗺 Wanderboard

**Wanderboard** — персональная интерактивная карта путешествий.
Отмечайте места, добавляйте описания, даты посещения и фотографии, фильтруйте поездки, смотрите статистику и делитесь публичной картой по ссылке.

## 🌐 Live

- **Frontend:** https://travel-board-seven.vercel.app
- **API:** https://travel-board-production.up.railway.app
- **Health check:** https://travel-board-production.up.railway.app/health

## ✨ Фичи

- 🗺 Интерактивная карта путешествий
- 📍 Добавление места двойным кликом по карте
- ✏️ Редактирование мест:
  - название
  - описание
  - дата посещения
  - координаты
  - публичность

- 🌍 Автоматическое определение страны и континента по координатам
- 🔎 Поиск мест по названию, стране, континенту и описанию
- 🧭 Фильтрация мест:
  - все
  - публичные
  - скрытые

- 📸 Загрузка фото к месту
- 🧾 Расширенная статистика:
  - места
  - страны
  - континенты
  - фото
  - публичные / скрытые места
  - топ стран
  - места по годам

- 🔗 Публичная карта пользователя по ссылке `/map/:username`
- 🌙 Тёмная тема
- 🔐 JWT-авторизация с refresh token cookie
- 📱 Адаптивный UI для мобильных устройств
- ✅ E2E-тесты на Playwright
- ⚙️ CI через GitHub Actions

## 🧱 Стек

### Frontend

- React
- TypeScript
- Vite
- Feature-Sliced Design
- TanStack Query
- React Router
- React Leaflet
- Tailwind CSS
- shadcn/ui

### Backend

- Node.js
- Express
- TypeScript
- Sequelize
- PostgreSQL
- JWT auth
- cookie-based refresh tokens
- multer для загрузки файлов
- Zod validation

### Infrastructure

- npm workspaces
- Docker Compose
- Railway для backend + PostgreSQL + uploads volume
- Vercel для frontend
- GitHub Actions CI
- Playwright E2E

## 🚀 Быстрый старт

### Требования

- Node.js 20+
- Docker
- npm

### Установка

```bash
git clone https://github.com/cronixXV/travel-board
cd travel-board

npm install
```

### Env

Создайте `.env` в корне проекта:

```bash
cp .env.example .env
```

Пример локальных переменных:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wanderboard

JWT_SECRET=your_jwt_secret_minimum_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_minimum_32_chars

CLIENT_URL=http://localhost:5173
APP_PUBLIC_URL=http://localhost:5173
API_PUBLIC_URL=http://localhost:3000

VITE_API_URL=http://localhost:3000
VITE_PUBLIC_APP_URL=http://localhost:5173

UPLOADS_DIR=./uploads
CLIENT_DIST_PATH=../client/dist
```

### База данных

```bash
docker compose up -d db
```

### Миграции

```bash
npm run migrate -w server
```

Проверить статус миграций:

```bash
npm run migrate:status -w server
```

### Запуск проекта

```bash
npm run dev
```

После запуска:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health check: http://localhost:3000/health

## 🧪 Тесты

### E2E

```bash
npm run e2e
```

### Playwright UI mode

```bash
npm run e2e:ui
```

### Запуск E2E против production frontend

```bash
E2E_BASE_URL=https://travel-board-seven.vercel.app E2E_SKIP_WEB_SERVER=1 npm run e2e
```

## 🛠 Команды

```bash
npm run dev              # запуск client + server в dev-режиме
npm run build            # сборка всех workspaces
npm run typecheck        # проверка TypeScript
npm run lint             # линтинг
npm run e2e              # Playwright E2E-тесты
npm run e2e:ui           # Playwright UI mode
```

## 🐳 Docker

Для локальной разработки обычно достаточно поднять только PostgreSQL:

```bash
docker compose up -d db
```

Остановить контейнеры:

```bash
docker compose down
```

Если нужно удалить volume с данными БД:

```bash
docker compose down -v
```

## 🔐 Auth

Авторизация построена на JWT:

- access token используется для API-запросов
- refresh token хранится в httpOnly cookie
- `/api/auth/refresh` обновляет access token
- `/api/auth/me` возвращает текущего пользователя
- username нормализуется в lowercase и используется в публичной ссылке

Пример публичной карты:

```txt
/map/testuser
```

## 📡 API

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
GET    /api/places?search=rome&visibility=public
GET    /api/places/stats
GET    /api/places/:id
POST   /api/places
PATCH  /api/places/:id
DELETE /api/places/:id
```

### Public map

```txt
GET /api/places/public/:username
```

### Photos

```txt
POST   /api/places/:placeId/photos
DELETE /api/places/:placeId/photos/:photoId
GET    /uploads/:filename
```

## 🔎 Поиск и фильтрация

Поиск выполняется на backend и поддерживает поля:

- название
- страна
- континент
- описание

Фильтр публичности:

```txt
all | public | private
```

Пример:

```txt
GET /api/places?search=италия&visibility=public
```

## 📊 Расширенная статистика

Endpoint:

```txt
GET /api/places/stats
```

Возвращает:

```ts
{
  totalPlaces: number;
  totalCountries: number;
  totalContinents: number;
  totalPhotos: number;

  visibility: {
    public: number;
    private: number;
  }

  byCountry: Array<{
    country: string;
    count: number;
  }>;

  byContinent: Array<{
    continent: string;
    count: number;
  }>;

  byYear: Array<{
    year: string;
    count: number;
  }>;
}
```

## 🚢 Deploy

### Frontend — Vercel

Production frontend:

```txt
https://travel-board-seven.vercel.app
```

Vercel env:

```env
VITE_API_URL=https://travel-board-production.up.railway.app
VITE_PUBLIC_APP_URL=https://travel-board-seven.vercel.app
```

### Backend — Railway

Production API:

```txt
https://travel-board-production.up.railway.app
```

Railway env:

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

Uploads хранятся в Railway Volume:

```txt
/app/uploads
```

## ✅ CI

GitHub Actions workflow запускается на `push` и `pull_request` в ветку `main`.

CI состоит из трёх job:

### Typecheck & Lint

- устанавливает зависимости через `npm ci`
- проверяет типы в `shared`
- собирает `shared` для workspace-потребителей
- проверяет типы в `server`
- проверяет типы в `client`
- запускает линтинг

### Build

- устанавливает зависимости через `npm ci`
- собирает `shared`
- собирает `server`
- собирает `client` с production env-переменными из GitHub Secrets

### E2E

- поднимает PostgreSQL service
- устанавливает зависимости через `npm ci`
- устанавливает Playwright Chromium
- собирает `shared`
- запускает миграции
- создаёт директорию `uploads`
- запускает Playwright E2E-тесты
- загружает Playwright report и test results как GitHub Actions artifacts

Workflow находится здесь:

```txt
.github/workflows/ci.yml
```

CI не выполняет deploy. Деплой frontend/backend выполняется отдельно через Vercel и Railway.

## 📄 License

MIT License.
