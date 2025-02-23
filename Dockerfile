# Используем официальный образ Node.js
FROM node:22

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json (если есть) в рабочую директорию
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы приложения в рабочую директорию
COPY . .

# Открываем порт, на котором будет работать приложение (например, 3000)
# EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "run", "start:prod"]
