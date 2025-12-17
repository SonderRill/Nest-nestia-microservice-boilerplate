# 🚀 NestJS Microservice Boilerplate

Современный шаблон для создания высокопроизводительных микросервисов на базе NestJS с полной типизацией, валидацией и автоматической генерацией SDK.

**[🇬🇧 English Documentation](#-english-documentation)** | **[🇷🇺 Русская Документация](#-содержание)**

## 📋 Содержание

- [Технологии](#-технологии)
- [Быстрый старт](#-быстрый-старт)
- [Основные возможности](#-основные-возможности)
  - [Промпты для Cursor AI](#-промпты-для-cursor-ai)
  - [Генерация SDK](#-генерация-sdk)
  - [Валидация входных данных](#-валидация-входных-данных)
  - [Генерация OpenAPI спецификации](#-генерация-openapi-спецификации)
  - [Поддержка работы в режиме кластера](#-поддержка-работы-в-режиме-кластера)
  - [Логи и метрики](#-логи-и-метрики)
- [Prisma 7](#-prisma-7)
- [Обновление зависимостей](#-обновление-зависимостей)
- [Проверки качества кода](#-проверки-качества-кода)

---

## 🛠 Технологии

Проект построен на современном стеке технологий:

- **[Node.js 22+](https://nodejs.org/)** — среда выполнения JavaScript
- **[pnpm](https://pnpm.io/)** — быстрый и эффективный менеджер пакетов
- **[NestJS 11+](https://nestjs.com/)** — прогрессивный Node.js фреймворк
- **[Fastify](https://fastify.dev/)** — высокопроизводительный веб-фреймворк ([NestJS Fastify Adapter](https://github.com/nestjs/nest/tree/master/packages/platform-fastify))
- **[Prisma 7](https://www.prisma.io/)** — современная ORM с типобезопасностью
- **[Nestia](https://nestia.io/)** — автоматическая генерация SDK и OpenAPI
- **[Typia](https://typia.io/)** — сверхбыстрая валидация и трансформация типов
- **[h2load](https://nghttp2.org/documentation/h2load-howto.html)** — инструмент для нагрузочного тестирования

### 🐳 Docker окружение

Проект включает полное Docker окружение для разработки и production развертывания.

#### Dockerfile

Проект содержит оптимизированный **multi-stage Dockerfile** для сборки production образа:

- **Multi-stage сборка** — разделение на этапы: `base`, `deps`, `builder`, `prod-deps`, `runner`
- **Минимальный production образ** — только необходимые зависимости и файлы
- **Безопасность** — запуск от непривилегированного пользователя
- **Healthcheck** — встроенная проверка здоровья приложения
- **Оптимизация размера** — использование Alpine Linux и удаление ненужных файлов

#### Docker Compose

Готовый `docker-compose.yml` включает все необходимые сервисы:

- **Приложение (app)** — NestJS приложение, собираемое из Dockerfile
- **PostgreSQL (db)** — база данных с healthcheck и персистентным хранилищем
- **[Grafana](https://grafana.com)** с предустановленными дашбордами и **[Loki](https://github.com/grafana/loki)** — http://localhost:3000
- **[Prometheus](https://prometheus.io/)** — http://localhost:9090
- **Swagger UI** — http://localhost:7000/api

#### Запуск через Docker Compose

```bash
# Запуск всех сервисов (app + db + мониторинг)
docker compose up -d --build

# Просмотр логов
docker compose logs -f app

# Остановка всех сервисов
docker compose down

# Остановка с удалением volumes
docker compose down -v
```

**Важно:** В Docker окружении `DATABASE_URL` должен указывать на имя сервиса `db`, а не на `localhost`.

#### Особенности Docker конфигурации

- ✅ **Healthchecks** — автоматическая проверка готовности сервисов
- ✅ **Read-only FS** — приложение работает в read-only режиме для безопасности (опционально, см. docker-compose.yml)
- ✅ **Зависимости** — приложение ждёт готовности базы данных перед запуском
- ✅ **Сети** — все сервисы в изолированной Docker сети
- ✅ **Все сервисы запускаются по умолчанию** — app, db, prometheus, grafana, loki

---

## 🚀 Быстрый старт

### Предварительные требования

- Node.js >= 22.0.0
- pnpm >= 8.0.0 ([установка](https://pnpm.io/installation))
- Docker и Docker Compose (для запуска инфраструктуры)
- PostgreSQL (через Docker Compose или локально)

### Установка и запуск

#### Вариант 1: Локальная разработка

```bash
# 1. Клонирование репозитория
git clone <repository-url>
cd example-nest-typia

# 2. Создание файла .env из примера
cp .env.example .env

# 3. Установка зависимостей
pnpm install

# 4. Запуск инфраструктуры (PostgreSQL, Grafana, Prometheus, Loki)
docker compose up -d db prometheus grafana loki

# 5. Применение миграций базы данных
pnpm run prisma:dev

# 6. Запуск приложения в режиме разработки
pnpm run start:dev

# Или в режиме отладки (с поддержкой debugger)
pnpm run start:debug
```

Приложение будет доступно по адресу: **http://localhost:7000**

#### Вариант 2: Запуск через Docker Compose

```bash
# 1. Клонирование репозитория
git clone <repository-url>
cd example-nest-typia

# 2. Создание файла .env из примера
cp .env.example .env
# Отредактируйте .env файл при необходимости

# 3. Запуск всех сервисов через Docker Compose
docker compose up -d --build

# Приложение автоматически соберётся и запустится в контейнере
```

Приложение будет доступно по адресу: **http://localhost:7000**

### Установка h2load (для нагрузочного тестирования)

```bash
apt install -y nghttp2
```

---

## ✨ Основные возможности

### 🤖 Промпты для Cursor AI

В проекте настроены промпты и правила для [Cursor AI](https://cursor.sh/), которые помогают AI-ассистенту лучше понимать структуру проекта и генерировать код в соответствии с принятыми соглашениями.

**Настроенные правила включают:**

- ✅ **Соглашения по именованию DTO** — автоматическое применение правил именования для Body, Query и Output DTO
- ✅ **Использование типов Prisma** — корректная работа с типами из `@prisma/client`
- ✅ **Работа с Fastify** — правильное использование типов Fastify вместо Express
- ✅ **Вспомогательные типы для списков** — автоматическое использование `GetManyParamsDto` и `GetManyResponseDto`
- ✅ **Nestia и декораторы** — правильное использование `@TypedQuery`, `@TypedBody`, `@TypedParam` вместо стандартных декораторов NestJS
- ✅ **OpenAPI документация** — автоматическое добавление JSDoc комментариев с `@tag` и `@summary`
- ✅ **Валидация с Typia** — правильное использование валидации из Typia

Эти правила помогают Cursor AI генерировать код, который соответствует стандартам проекта, что значительно ускоряет разработку и снижает количество ошибок.

### 📦 Генерация SDK

Проект поддерживает автоматическую генерацию TypeScript SDK на основе контроллеров с использованием [Nestia SDK](https://nestia.io/docs/sdk/).

SDK генерируется из всех контроллеров в директории `src/**/*.controller.ts` (исключая webhook контроллеры) и размещается в директории `nestia-api`. Готовая сборка SDK находится в `sdk-package/api`.

#### Команды для работы с SDK

| Команда | Описание |
|---------|----------|
| `pnpm run sdk:build` | Сборка SDK |
| `pnpm run sdk:build:hard` | Полная пересборка SDK (с очисткой структур) |
| `pnpm run sdk:push` | Публикация SDK в npm (минорная версия) |
| `pnpm run sdk:push:major` | Публикация SDK в npm (мажорная версия) |

<details>
<summary><strong>📤 Настройка публикации SDK в npm</strong></summary>

<blockquote>

#### 📤 Настройка публикации SDK в npm

Перед публикацией SDK в npm необходимо настроить `package.json` в директории `sdk-package/api` под ваш проект.

##### 1. Настройка package.json

Отредактируйте файл `sdk-package/api/package.json` и измените следующие поля:

```json
{
  "name": "@your-org/your-package-name",  // Имя вашего пакета в npm
  "version": "1.0.0",                     // Начальная версия
  "description": "Описание вашего SDK",   // Описание пакета
  "author": "Ваше имя или организация",   // Автор пакета
  "publishConfig": {
    "access": "public"                     // или "restricted" для приватных пакетов
  }
}
```

**Важные поля:**

- **`name`** — имя пакета в npm. Для scoped пакетов (начинающихся с `@`) используйте формат `@your-org/package-name`. Для публичных scoped пакетов обязательно укажите `"access": "public"` в `publishConfig`.
- **`version`** — версия пакета. При публикации версия автоматически увеличивается командой `pnpm version`.
- **`description`** — краткое описание пакета, которое будет отображаться на странице пакета в npm.
- **`author`** — информация об авторе (имя, email или организация).
- **`publishConfig.access`** — уровень доступа:
  - `"public"` — публичный пакет (доступен всем)
  - `"restricted"` — приватный пакет (требует платную подписку npm)

##### 2. Подключение к npm

Перед первой публикацией необходимо авторизоваться в npm:

```bash
# Авторизация в npm (откроется браузер для входа)
npm login

# Или через командную строку (без браузера)
npm login --auth-type=legacy

# Проверка текущего пользователя
npm whoami
```

**Для scoped пакетов (@your-org/package-name):**

Если вы публикуете scoped пакет впервые, убедитесь, что:
1. Организация `@your-org` существует в npm (или используйте свой username: `@username/package-name`)
2. Вы имеете права на публикацию в эту организацию
3. В `publishConfig` указан `"access": "public"` для публичных пакетов

**Создание организации в npm:**

1. Перейдите на [npmjs.com](https://www.npmjs.com/)
2. Войдите в свой аккаунт
3. Перейдите в Settings → Organizations
4. Создайте новую организацию (бесплатно для публичных пакетов)

##### 3. Публикация SDK

После настройки `package.json` и авторизации в npm:

```bash
# Публикация с увеличением минорной версии (1.0.0 → 1.1.0)
pnpm run sdk:push

# Публикация с увеличением мажорной версии (1.0.0 → 2.0.0)
pnpm run sdk:push:major
```

**Что происходит при публикации:**

1. Сборка SDK (`pnpm run build`)
2. Форматирование кода (`pnpm run format`)
3. Увеличение версии (`pnpm version minor` или `pnpm version major`)
4. Публикация в npm (`pnpm publish`)

**Проверка публикации:**

После успешной публикации пакет будет доступен по адресу:
```
https://www.npmjs.com/package/@your-org/your-package-name
```

**Установка опубликованного SDK:**

```bash
pnpm add @your-org/your-package-name
# или
npm install @your-org/your-package-name
```

##### 4. Использование приватного npm registry (опционально)

Если вы используете приватный npm registry (например, GitHub Packages, GitLab Package Registry, или корпоративный registry):

```bash
# Настройка registry для scoped пакетов
npm config set @your-org:registry https://npm.pkg.github.com

# Или через .npmrc файл в корне проекта
echo "@your-org:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> .npmrc
```

**Важно:** При использовании приватного registry убедитесь, что токен доступа настроен правильно и имеет права на публикацию пакетов.

</blockquote>

</details>

#### Пример использования SDK

```typescript
import { IConnection } from '@nestia/fetcher'
import api from '@baron-zemo/backend-api2'

// Создание соединения
const connection: IConnection = {
  host: 'http://localhost:7000',
  headers: {
    // Authorization: 'Bearer your-token-here'
  }
}

// GET запрос с query параметрами
const helloResponse = await api.functional.getHello(connection, {
  text: 'Hello World',
  num: 42
})

// POST запрос с телом
const post = await api.functional.post.createPost(connection, {
  title: 'My Post',
  body: 'Post content',
  email: 'user@example.com'
})
```

SDK обеспечивает полную типизацию всех запросов и ответов, автоматическую валидацию данных и поддержку авторизации через заголовки.

**Подробнее:** [Nestia SDK Documentation](https://nestia.io/docs/sdk/)

#### 🔌WebSocket RPC

Проект поддерживает двустороннюю коммуникацию через WebSocket RPC на основе [Nestia](https://nestia.io/) и [tgrid](https://github.com/samchon/tgrid). Это позволяет создавать типобезопасные WebSocket соединения с автоматической генерацией клиентского SDK.

**Архитектура WebSocket RPC:**

WebSocket RPC использует паттерн RPC (Remote Procedure Call) для двусторонней коммуникации между сервером и клиентами:

- **NestListener** — интерфейс методов, которые сервер предоставляет клиентам
- **RemoteListener** — интерфейс методов, которые клиенты предоставляют серверу
- **WebSocketRpcService** — сервис для управления подключенными клиентами и отправки сообщений


**Пример использования WebSocket RPC через SDK:**

```typescript
import { IConnection } from '@nestia/fetcher'
import api from '@baron-zemo/backend-api2'

// Создание соединения
const connection: IConnection = {
  host: 'ws://localhost:7000',
  headers: {
    // Authorization: 'Bearer your-token-here'
  }
}

// Подключение к WebSocket серверу
const { connector, driver, reconnect } = await api.functional.connect(connection, {
  // Реализация методов RemoteListener
  onSuccessConnection: async (message: string) => {
    console.log('Server message:', message)
  }
})

// Вызов методов сервера (NestListener)
const response = await driver.ping() // 'pong'

// Переподключение при разрыве соединения
try {
  await driver.ping()
} catch (error) {
  console.log('Connection lost, reconnecting...')
  await reconnect()
  // После переподключения можно продолжать использовать driver
  const newResponse = await driver.ping() // 'pong'
}

// Закрытие соединения
await connector.close()
```

**Особенности:**

- ✅ **Типобезопасность** — все методы и типы генерируются автоматически через Nestia
- ✅ **Автоматическая генерация SDK** — клиентский код генерируется вместе с остальным SDK
- ✅ **Управление подключениями** — сервер автоматически отслеживает подключенных клиентов
- ✅ **Обработка ошибок** — автоматическое удаление "мертвых" соединений
- ✅ **Ping/Pong** — встроенная поддержка keep-alive соединений

**Настройка авторизации:**

В контроллере `WebSocketRpcController.connect` можно добавить логику авторизации:

```typescript
if (header.xAuthToken !== this.xAuthToken) {
  return acceptor.reject(1008, 'Invalid token')
}
```

**Подробнее:** [Nestia WebSocketRoute Documentation](https://nestia.io/docs/core/WebSocketRoute/)

---

### ✅ Валидация входных данных

Для валидации входных данных в контроллерах используются декораторы из `@nestia/core` вместо стандартных. Внутри этот модуль использует **[Typia](https://typia.io/)** — самый быстрый валидатор TypeScript, который обеспечивает валидацию в runtime на основе типов TypeScript с производительностью, близкой к нативной.

Typia поддерживает полную валидацию типов, трансформацию данных и генерацию JSON Schema. Все валидации выполняются на этапе компиляции, что гарантирует типобезопасность и максимальную производительность.

**Полный список тегов для валидации:** [Typia Validators](https://typia.io/docs/validators/tags/)

---

### 📚 Генерация OpenAPI спецификации

Преднастроен генератор OpenAPI спецификации на основе `@nestia/sdk`, совместимый с валидацией `@nestia/core`.

- **Swagger UI:** http://localhost:7000/api
- **OpenAPI JSON:** http://localhost:7000/api-json
- **Генерация файла:** `pnpm run build:swagger`

Базовые настройки OpenAPI берутся из файла `src/openapi-base.const.ts`. Название проекта берётся из `package.json`.

**Подробнее:** [Nestia SDK Swagger](https://nestia.io/docs/sdk/swagger/)

---

### 🔄 Поддержка работы в режиме кластера

Изменена точка запуска приложения для опциональной поддержки работы в режиме кластера ([node:cluster](https://nodejs.org/api/cluster.html)).

`src/main.ts` перестал запускать веб-сервер, вместо этого он экспортирует функцию `bootstrap`.

**Файлы для запуска:**

- `src/bin/single` — стандартный запуск в однопоточном режиме
- `src/bin/cluster` — запуск в многопоточном режиме (кластер)

**Команды:**

```bash
# Продакшн (однопоточный)
pnpm run start:prod

# Продакшн (кластер)
pnpm run start:prod:cluster
```

**Настройка количества воркеров:**

Количество воркеров можно настроить через переменную окружения `CLUSTER_WORKERS`. По умолчанию используется количество доступных логических CPU ядер (определяется через `availableParallelism()`).

```bash
# Запуск с 4 воркерами
CLUSTER_WORKERS=4 pnpm run start:prod:cluster

# Запуск с 8 воркерами
CLUSTER_WORKERS=8 pnpm run start:prod:cluster
```

---

### 📊 Логи и метрики

#### Логирование на основе Pino

Проект использует [Pino](https://getpino.io/) как высокопроизводительный логер вместо стандартного `ConsoleLogger` из NestJS. При этом полностью сохраняется совместимость с API NestJS и контекст логирования.

**Пример использования:**

```typescript
export class MyService {
  private readonly logger = new Logger(MyService.name)
  
  someMethod() {
    this.logger.log('Processing data') // [MyService] Processing data
    this.logger.error('Error occurred', error)
  }
}
```

**Конфигурация логирования:**

Настройки находятся в `src/configs/logger.config.ts` и управляются через переменные окружения:

- `LOG_LEVEL` — уровень логирования (`silent`, `error`, `warn`, `info`, `debug`)
- `ENABLE_CONSOLE_LOGGING` — включение/выключение вывода в консоль
- `LOKI_URL` — URL для отправки логов в Loki (опционально)
- `LOKI_USERNAME` / `LOKI_PASSWORD` — учетные данные для Loki (опционально)

#### Метрики Prometheus

Настроен сбор метрик в [Prometheus](https://prometheus.io/) с возможностью использовать кастомные метрики через `MetricsService`.

---

## 🗄 Prisma 7

Проект использует **Prisma 7** — современную ORM с улучшенной производительностью, типобезопасностью и удобными инструментами для работы с базой данных.

### Особенности Prisma 7

- ✅ **Улучшенная производительность** — быстрее генерация клиента и выполнение запросов
- ✅ **Расширенная типобезопасность** — полная поддержка TypeScript
- ✅ **Гибкая конфигурация** — настройка через `prisma.config.ts`
- ✅ **Кастомный output** — клиент генерируется в `prisma/generated/prisma`

### Команды Prisma

| Команда | Описание |
|---------|----------|
| `pnpm run prisma:format` | Форматирование схемы Prisma |
| `pnpm run prisma:generate` | Генерация Prisma Client |
| `pnpm run prisma:create` | Создание новой миграции (без применения) |
| `pnpm run prisma:dev` | Создание и применение миграции в dev режиме |
| `pnpm run prisma:deploy` | Применение миграций в продакшн |
| `pnpm run prisma:down` | Генерация SQL для отката миграций |
| `pnpm run prisma:seed` | Заполнение базы данных тестовыми данными |

### Работа с Prisma Client

Prisma Client генерируется в кастомную директорию `prisma/generated/prisma` и автоматически генерируется при установке зависимостей (`postinstall`).

**Пример использования:**

```typescript
import { PrismaClient } from '../../prisma/generated/prisma/client'

// В сервисе
const prisma = new PrismaClient()
const posts = await prisma.post.findMany()
```

**Конфигурация:** `prisma.config.ts`

**Схема:** `prisma/schema.prisma`

**Документация:** [Prisma Documentation](https://www.prisma.io/docs)

---

## 🔄 Обновление зависимостей

Проект предоставляет удобные команды для проверки и обновления зависимостей.

### Команды для обновления

| Команда | Описание |
|---------|----------|
| `pnpm run update` | Проверка доступных обновлений (без установки) |
| `pnpm run update:run` | Автоматическое обновление всех зависимостей |
| `pnpm run sdk:update` | Проверка обновлений для SDK пакета |
| `pnpm run sdk:update:run` | Автоматическое обновление SDK зависимостей |

### Процесс обновления

1. **Проверка обновлений:**
   ```bash
   pnpm run update
   ```
   Команда покажет список пакетов, для которых доступны обновления.

2. **Обновление всех зависимостей:**
   ```bash
   pnpm run update:run
   ```
   Или вручную:
   ```bash
   pnpm dlx npm-check-updates -u && pnpm install
   ```

3. **Обновление конкретного пакета:**
   ```bash
   pnpm add package-name@latest
   ```

4. **Проверка после обновления:**
   ```bash
   pnpm run build
   pnpm run test
   ```

### Рекомендации

- ⚠️ Всегда проверяйте changelog перед обновлением мажорных версий
- ✅ Обновляйте зависимости постепенно, особенно в продакшн проектах
- ✅ Запускайте тесты после обновления
- ✅ Проверяйте совместимость с другими зависимостями

---

## 🔍 Проверки качества кода

Проект использует [Husky](https://typicode.github.io/husky/) для автоматического запуска проверок перед каждым коммитом. Это гарантирует, что в репозиторий попадает только качественный код.

### Автоматические проверки перед коммитом

При выполнении `git commit` автоматически запускаются следующие проверки:

1. **Форматирование кода** (`pnpm run format`)
   - Автоматическое форматирование всех файлов с помощью [Prettier](https://prettier.io/)
   - Обрабатываются файлы: `src/**/*.ts`, `prisma/generated/**/*.ts`, `nestia-api/**/*.ts`, `sdk-package/api/lib/**/*.ts`

2. **Линтинг кода** (`pnpm run lint`)
   - Проверка кода с помощью [ESLint](https://eslint.org/)
   - Автоматическое исправление найденных проблем (где возможно)
   - Проверка правильности импортов и их сортировка
   - Проверка на неиспользуемые переменные и другие проблемы

3. **Проверка циклических зависимостей** (`pnpm run lint:deps`)
   - Анализ зависимостей с помощью [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)
   - Обнаружение циклических импортов между модулями
   - Проверка циклических зависимостей через barrel-файлы (index.ts)

### Проверка циклических импортов

Проект использует два уровня проверки циклических зависимостей:

1. **ESLint правило `import/no-cycle`**
   - Проверяет циклические импорты на уровне отдельных файлов
   - Ошибка при обнаружении циклической зависимости
   - Настроено в `eslint.config.mjs`

2. **Dependency Cruiser**
   - Глубокий анализ графа зависимостей всего проекта
   - Обнаружение скрытых циклических зависимостей через barrel-файлы
   - Конфигурация находится в `dependency-cruiser.js`
   - Правила:
     - `no-circular` — строгая проверка (error) на любые циклические зависимости
     - `no-circular-via-barrel` — предупреждение (warn) о циклических зависимостях через index.ts

### Ручной запуск проверок

Вы можете запустить проверки вручную в любой момент:

```bash
# Форматирование кода
pnpm run format

# Линтинг с автоисправлением
pnpm run lint

# Только проверка циклических зависимостей
pnpm run lint:deps
```

### Важно

- ❌ Если проверки не проходят, коммит будет отклонен
- ✅ Все проверки должны пройти успешно перед коммитом
- ✅ Это помогает поддерживать качество кода и избегать проблем с инициализацией модулей в NestJS

---

#### Dev Containers (опционально)

В проекте присутствует конфигурация для [Dev Containers](https://containers.dev/) (`.devcontainer/devcontainer.json`), но он как рудимент, может долго открываться, можно работать и без него

## 📋 TODO List

### ✅ Завершено

- [x] Добавить pino как движок для логирования + опциональное логирование в Loki
- [x] Добавить мониторинг с помощью Prometheus:
  - стандартных метрик nodejs
  - метрик fastify ([fastify-metrics](https://github.com/SkeLLLa/fastify-metrics))
  - кастомных метрик в стиле NestJS
- [x] Добавить health checks
- [x] Добавить Prisma 7
- [x] Привести ошибки к единому виду и добавить их в генерацию OpenAPI документа

---

## 🤝 Вклад в проект

Если вы хотите предложить изменения или улучшения, создайте новый issue или pull request.

---

## 📄 Лицензия

MIT

---

**Сделано с ❤️ для разработчиков**

---

## 🇬🇧 English Documentation

# 🚀 NestJS Microservice Boilerplate

Modern template for creating high-performance microservices based on NestJS with full typing, validation, and automatic SDK generation.

**[🇬🇧 English Documentation](#-english-documentation)** | **[🇷🇺 Русская Документация](#-содержание)**

## 📋 Table of Contents

- [Technologies](#-technologies)
- [Quick Start](#-quick-start)
- [Key Features](#-key-features)
  - [Cursor AI Prompts](#-cursor-ai-prompts)
  - [SDK Generation](#-sdk-generation)
  - [Input Validation](#-input-validation)
  - [OpenAPI Specification Generation](#-openapi-specification-generation)
  - [Cluster Mode Support](#-cluster-mode-support)
  - [Logs and Metrics](#-logs-and-metrics)
- [Prisma 7](#-prisma-7-1)
- [Dependency Updates](#-dependency-updates)
- [Code Quality Checks](#-code-quality-checks)

---

## 🛠 Technologies

The project is built on a modern technology stack:

- **[Node.js 22+](https://nodejs.org/)** — JavaScript runtime environment
- **[pnpm](https://pnpm.io/)** — fast and efficient package manager
- **[NestJS 11+](https://nestjs.com/)** — progressive Node.js framework
- **[Fastify](https://fastify.dev/)** — high-performance web framework ([NestJS Fastify Adapter](https://github.com/nestjs/nest/tree/master/packages/platform-fastify))
- **[Prisma 7](https://www.prisma.io/)** — modern ORM with type safety
- **[Nestia](https://nestia.io/)** — automatic SDK and OpenAPI generation
- **[Typia](https://typia.io/)** — ultra-fast validation and type transformation
- **[h2load](https://nghttp2.org/documentation/h2load-howto.html)** — tool for load testing

### 🐳 Docker Environment

The project includes a complete Docker environment for development and production deployment.

#### Docker Compose

The ready-to-use `docker-compose.yml` includes all necessary services:

- **Application (app)** — NestJS application built from Dockerfile
- **PostgreSQL (db)** — database with healthcheck and persistent storage
- **[Grafana](https://grafana.com)** with pre-installed dashboards and **[Loki](https://github.com/grafana/loki)** — http://localhost:3000
- **[Prometheus](https://prometheus.io/)** — http://localhost:9090
- **Swagger UI** — http://localhost:7000/api

#### Running via Docker Compose

```bash
# Start all services (app + db + monitoring)
docker compose up -d --build

# View logs
docker compose logs -f app

# Stop all services
docker compose down

# Stop with volume removal
docker compose down -v
```

**Important:** In Docker environment, `DATABASE_URL` should point to the service name `db`, not `localhost`.

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 8.0.0 ([installation](https://pnpm.io/installation))
- Docker and Docker Compose (for infrastructure)
- PostgreSQL (via Docker Compose or locally)

### Installation and Setup

#### Option 1: Local Development

```bash
# 1. Clone repository
git clone <repository-url>
cd example-nest-typia

# 2. Create .env file from example
cp .env.example .env

# 3. Install dependencies
pnpm install

# 4. Start infrastructure (PostgreSQL, Grafana, Prometheus, Loki)
docker compose up -d db prometheus grafana loki

# 5. Apply database migrations
pnpm run prisma:dev

# 6. Start application in development mode
pnpm run start:dev

# Or in debug mode (with debugger support)
pnpm run start:debug
```

The application will be available at: **http://localhost:7000**

#### Option 2: Run via Docker Compose

```bash
# 1. Clone repository
git clone <repository-url>
cd example-nest-typia

# 2. Create .env file from example
cp .env.example .env
# Edit .env file if needed

# 3. Start all services via Docker Compose
docker compose up -d --build

# Application will be automatically built and started in container
```

The application will be available at: **http://localhost:7000**

---

## ✨ Key Features

### 🤖 Cursor AI Prompts

The project includes configured prompts and rules for [Cursor AI](https://cursor.sh/) that help the AI assistant better understand the project structure and generate code according to accepted conventions.

**Configured rules include:**

- ✅ **DTO naming conventions** — automatic application of naming rules for Body, Query, and Output DTOs
- ✅ **Prisma types usage** — correct work with types from `@prisma/client`
- ✅ **Fastify work** — proper use of Fastify types instead of Express
- ✅ **Helper types for lists** — automatic use of `GetManyParamsDto` and `GetManyResponseDto`
- ✅ **Nestia and decorators** — proper use of `@TypedQuery`, `@TypedBody`, `@TypedParam` instead of standard NestJS decorators
- ✅ **OpenAPI documentation** — automatic addition of JSDoc comments with `@tag` and `@summary`
- ✅ **Typia validation** — proper use of validation from Typia

These rules help Cursor AI generate code that matches project standards, significantly speeding up development and reducing errors.

### 📦 SDK Generation

The project supports automatic TypeScript SDK generation based on controllers using [Nestia SDK](https://nestia.io/docs/sdk/).

SDK is generated from all controllers in the `src/**/*.controller.ts` directory (excluding webhook controllers) and placed in the `nestia-api` directory. The ready SDK build is located in `sdk-package/api`.

#### SDK Commands

| Command | Description |
|---------|-------------|
| `pnpm run sdk:build` | Build SDK |
| `pnpm run sdk:build:hard` | Full SDK rebuild (with structure cleanup) |
| `pnpm run sdk:push` | Publish SDK to npm (minor version) |
| `pnpm run sdk:push:major` | Publish SDK to npm (major version) |

<details>
<summary><strong>📤 Configuring SDK Publication to npm</strong></summary>

#### 📤 Configuring SDK Publication to npm

Before publishing SDK to npm, you need to configure `package.json` in the `sdk-package/api` directory for your project.

##### 1. Configuring package.json

Edit the `sdk-package/api/package.json` file and change the following fields:

```json
{
  "name": "@your-org/your-package-name",  // Your package name in npm
  "version": "1.0.0",                     // Initial version
  "description": "Your SDK description",  // Package description
  "author": "Your name or organization",  // Package author
  "publishConfig": {
    "access": "public"                     // or "restricted" for private packages
  }
}
```

**Important fields:**

- **`name`** — package name in npm. For scoped packages (starting with `@`) use the format `@your-org/package-name`. For public scoped packages, be sure to specify `"access": "public"` in `publishConfig`.
- **`version`** — package version. Version is automatically incremented by `pnpm version` command during publication.
- **`description`** — brief package description that will be displayed on the package page in npm.
- **`author`** — author information (name, email, or organization).
- **`publishConfig.access`** — access level:
  - `"public"` — public package (available to everyone)
  - `"restricted"` — private package (requires paid npm subscription)

##### 2. Connecting to npm

Before the first publication, you need to authenticate in npm:

```bash
# Authentication in npm (will open browser for login)
npm login

# Or via command line (without browser)
npm login --auth-type=legacy

# Check current user
npm whoami
```

**For scoped packages (@your-org/package-name):**

If you're publishing a scoped package for the first time, make sure:
1. The `@your-org` organization exists in npm (or use your username: `@username/package-name`)
2. You have publishing rights to this organization
3. `"access": "public"` is specified in `publishConfig` for public packages

##### 3. Publishing SDK

After configuring `package.json` and authenticating in npm:

```bash
# Publish with minor version increment (1.0.0 → 1.1.0)
pnpm run sdk:push

# Publish with major version increment (1.0.0 → 2.0.0)
pnpm run sdk:push:major
```

**What happens during publication:**

1. SDK build (`pnpm run build`)
2. Code formatting (`pnpm run format`)
3. Version increment (`pnpm version minor` or `pnpm version major`)
4. Publication to npm (`pnpm publish`)

**Verifying publication:**

After successful publication, the package will be available at:
```
https://www.npmjs.com/package/@your-org/your-package-name
```

**Installing published SDK:**

```bash
pnpm add @your-org/your-package-name
# or
npm install @your-org/your-package-name
```

</details>

#### SDK Usage Example

```typescript
import { IConnection } from '@nestia/fetcher'
import api from '@baron-zemo/backend-api2'

// Create connection
const connection: IConnection = {
  host: 'http://localhost:7000',
  headers: {
    // Authorization: 'Bearer your-token-here'
  }
}

// GET request with query parameters
const helloResponse = await api.functional.getHello(connection, {
  text: 'Hello World',
  num: 42
})

// POST request with body
const post = await api.functional.post.createPost(connection, {
  title: 'My Post',
  body: 'Post content',
  email: 'user@example.com'
})
```

SDK provides full typing for all requests and responses, automatic data validation, and authorization support through headers.

**More details:** [Nestia SDK Documentation](https://nestia.io/docs/sdk/)

### ✅ Input Validation

For input validation in controllers, decorators from `@nestia/core` are used instead of standard ones. This module uses **[Typia](https://typia.io/)** internally — the fastest TypeScript validator that provides runtime validation based on TypeScript types with near-native performance.

Typia supports full type validation, data transformation, and JSON Schema generation. All validations are performed at compile time, ensuring type safety and maximum performance.

**Full list of validation tags:** [Typia Validators](https://typia.io/docs/validators/tags/)

---

### 📚 OpenAPI Specification Generation

Pre-configured OpenAPI specification generator based on `@nestia/sdk`, compatible with `@nestia/core` validation.

- **Swagger UI:** http://localhost:7000/api
- **OpenAPI JSON:** http://localhost:7000/api-json
- **File generation:** `pnpm run build:swagger`

Basic OpenAPI settings are taken from the `src/openapi-base.const.ts` file. Project name is taken from `package.json`.

**More details:** [Nestia SDK Swagger](https://nestia.io/docs/sdk/swagger/)

---

### 🔄 Cluster Mode Support

The application startup point has been changed for optional cluster mode support ([node:cluster](https://nodejs.org/api/cluster.html)).

`src/main.ts` no longer starts the web server, instead it exports a `bootstrap` function.

**Startup files:**

- `src/bin/single` — standard single-threaded startup
- `src/bin/cluster` — multi-threaded startup (cluster)

**Commands:**

```bash
# Production (single-threaded)
pnpm run start:prod

# Production (cluster)
pnpm run start:prod:cluster
```

**Configuring worker count:**

The number of workers can be configured via the `CLUSTER_WORKERS` environment variable. By default, the number of available logical CPU cores is used (determined via `availableParallelism()`).

```bash
# Run with 4 workers
CLUSTER_WORKERS=4 pnpm run start:prod:cluster

# Run with 8 workers
CLUSTER_WORKERS=8 pnpm run start:prod:cluster
```

---

### 📊 Logs and Metrics

#### Pino-based Logging

The project uses [Pino](https://getpino.io/) as a high-performance logger instead of the standard `ConsoleLogger` from NestJS. Full compatibility with NestJS API and logging context is maintained.

**Configuration:**

Settings are located in `src/configs/logger.config.ts` and managed via environment variables:

- `LOG_LEVEL` — logging level (`silent`, `error`, `warn`, `info`, `debug`)
- `ENABLE_CONSOLE_LOGGING` — enable/disable console output
- `LOKI_URL` — URL for sending logs to Loki (optional)
- `LOKI_USERNAME` / `LOKI_PASSWORD` — Loki credentials (optional)

#### Prometheus Metrics

Configured metrics collection in [Prometheus](https://prometheus.io/) with the ability to use custom metrics via `MetricsService`.

---

## 🗄 Prisma 7

The project uses **Prisma 7** — a modern ORM with improved performance, type safety, and convenient tools for working with databases.

### Prisma 7 Features

- ✅ **Improved performance** — faster client generation and query execution
- ✅ **Extended type safety** — full TypeScript support
- ✅ **Flexible configuration** — configuration via `prisma.config.ts`
- ✅ **Custom output** — client is generated in `prisma/generated/prisma`

### Prisma Commands

| Command | Description |
|---------|-------------|
| `pnpm run prisma:format` | Format Prisma schema |
| `pnpm run prisma:generate` | Generate Prisma Client |
| `pnpm run prisma:create` | Create new migration (without applying) |
| `pnpm run prisma:dev` | Create and apply migration in dev mode |
| `pnpm run prisma:deploy` | Apply migrations in production |
| `pnpm run prisma:down` | Generate SQL for migration rollback |
| `pnpm run prisma:seed` | Seed database with test data |

**Documentation:** [Prisma Documentation](https://www.prisma.io/docs)

---

## 🔄 Dependency Updates

The project provides convenient commands for checking and updating dependencies.

### Update Commands

| Command | Description |
|---------|-------------|
| `pnpm run update` | Check available updates (without installation) |
| `pnpm run update:run` | Automatically update all dependencies |
| `pnpm run sdk:update` | Check updates for SDK package |
| `pnpm run sdk:update:run` | Automatically update SDK dependencies |

### Recommendations

- ⚠️ Always check changelog before updating major versions
- ✅ Update dependencies gradually, especially in production projects
- ✅ Run tests after updating
- ✅ Check compatibility with other dependencies

---

## 🔍 Code Quality Checks

The project uses [Husky](https://typicode.github.io/husky/) for automatic checks before each commit. This ensures that only quality code enters the repository.

### Automatic Pre-commit Checks

When executing `git commit`, the following checks are automatically run:

1. **Code formatting** (`pnpm run format`)
   - Automatic formatting of all files using [Prettier](https://prettier.io/)

2. **Code linting** (`pnpm run lint`)
   - Code checking using [ESLint](https://eslint.org/)
   - Automatic fixing of found issues (where possible)

3. **Circular dependency check** (`pnpm run lint:deps`)
   - Dependency analysis using [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)
   - Detection of circular imports between modules

### Important

- ❌ If checks fail, the commit will be rejected
- ✅ All checks must pass successfully before commit
- ✅ This helps maintain code quality and avoid module initialization issues in NestJS

---

## 📄 License

MIT

---

**Made with ❤️ for developers**
