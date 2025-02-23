## NestJS Project Template

Этот шаблон проекта основан на следующих технологиях:

- [NodeJS 22+](https://nodejs.org/)
- [NestJS 10+](https://nestjs.com/)
- [Fastify](https://fastify.dev/) ([NestJS Fastify Adapter](https://github.com/nestjs/nest/tree/master/packages/platform-fastify))
- [Prisma](https://www.prisma.io/)
- [Nestia](https://nestia.io/)
- [Typia](https://typia.io/)
- [h2load](https://nghttp2.org/documentation/h2load-howto.html)
- [Visual Studio Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)

### Начало разработки

##### Установка зависимостей

```bash
npm install
```

##### Установка h2load (для нагрузочного тестирования)

```bash
apt install -y nghttp2
```

### Предустановленные фичи

#### Валидация входных данных

Для валидации входных данных в контроллерах используются декораторы, предоставленные @nestia/core вместо стандартных. Внутри этот модуль использует typia, поэтому поддерживается вся её валидация. Полный список тегов для валидации доступен [здесь](https://typia.io/docs/validators/tags/).

#### Генерация OpenAPI спецификации

Преднастроен генератор OpenAPI спецификации на основе @nestia/sdk, совместимый с валидацией @nestia/core.

- Swagger UI доступен по URL: `/api`
- OpenAPI документ доступен по URL `/api-json`
- Поддерживается генерация документа в виде файла с помощью команды:

```bash
npm run build:swagger
```

Подробнее про использование: [Nestia SDK Swagger](https://nestia.io/docs/sdk/swagger/)

Базовые настройки OpenAPI спеки берутся из файла: `src/openapi-base.const.ts`

Название проекта берётся из package.json.

#### Поддержка работы в режиме кластера

Изменена точка запуска приложения для опциональной поддержки работы в режиме кластера ([node:cluster](https://nodejs.org/api/cluster.html)).

`src/main.ts` перестал запускать веб-сервер, вместо этого он экспортирует функцию `bootstrap`.

Добавлены 2 файла для запуска:

- `src/bin/single` для стандартного запуска в однопоточном режиме
- `src/bin/cluster` для запуска в многопоточном режиме (кластера)

#### Логи и метрики

Настроен сбор метрик в [Prometheus](https://prometheus.io/) с возможностью использовать кастомные метрики через MetricsService

Автоматическая отправка логов в [Loki](https://github.com/grafana/loki?tab=readme-ov-file). Настройка логирования определяется в переменных окружения

<br>

# 📋 TODO List


## 🔨 Работа в процессе
- [ ] Mетрики socket.io


## 🚀 Завершено
- [x] Добавить pino как движок для логирования + опциональное логирование в Loki
- [x] Добавить мониторинг с помощью Prometheus:
   - стандартных метрик nodejs
   - метрик fastify ([fastify-metrics](https://github.com/SkeLLLa/fastify-metrics))
   - кастомных метрик в стиле NestJS
- [x] Добавить health checks
- [x] Добавить Prisma
- [x] Привести ошибки к единому виду и добавить их в генерацию OpenAPI документа


<!-- ---

### 📆 Приоритеты
- **🔥 Высокий приоритет**
  - [ ] Реализовать уведомления в реальном времени
  - [ ] Оптимизировать запросы к базе данных
- **✨ Средний приоритет**
  - [ ] Обновить дизайн сайта
  - [ ] Добавить документацию API
- **💡 Низкий приоритет**
  - [ ] Улучшить тестовое покрытие -->

---

### 🛠️ Примечания
- Если вы хотите предложить изменения или улучшения, создайте новый issue.

---

🎯 **Давайте сделаем это вместе!**
