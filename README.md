# 🗺 Wanderboard

Персональная интерактивная карта путешествий. Отмечай места где побывал, прикрепляй фото и делись картой по публичной ссылке.

## Стек

**Фронтенд** — React + Vite, TanStack Query, React Leaflet, shadcn/ui + Tailwind, FSD архитектура

**Бэкенд** — Express + TypeScript, Sequelize + PostgreSQL, JWT auth, multer

**Инфраструктура** — npm workspaces (monorepo), Docker Compose

## Фичи

- 🗺 Интерактивная карта — двойной клик добавляет место
- 📍 Автоматическое определение страны по координатам
- 📸 Загрузка фото с drag-and-drop (до 10 фото на место)
- 🔗 Публичная страница профиля по ссылке `/map/:username`
- 🌙 Тёмная тема
- 📊 Статистика — места, страны, фото
- 🔐 JWT авторизация с refresh токенами

## Быстрый старт

### Требования

- Node.js 20+
- Docker

### Установка

```bash
# Клонируем репозиторий
git clone https://github.com/cronixXV/travel-board
cd wanderboard

# Устанавливаем зависимости
npm install

# Копируем env
cp .env.example .env
# Заполни .env своими значениями

# Поднимаем БД
docker-compose up -d

# Запускаем миграции
cd server && npx sequelize-cli db:migrate

# Опционально — тестовые данные
npx sequelize-cli db:seed:all
cd ..

# Запускаем проект
npm run dev
```

Открываем:

- Фронтенд: http://localhost:5173
- Бэкенд: http://localhost:3000
- Health check: http://localhost:3000/health

## Команды

```bash
npm run dev          # запуск в режиме разработки
npm run build        # сборка
npm run typecheck    # проверка типов
npm run lint         # линтинг
```

## Docker

```bash
# Только БД (рекомендуется для разработки)
docker-compose up -d

# Всё в Docker с hot reload
docker-compose -f docker-compose.dev.yml up
```
