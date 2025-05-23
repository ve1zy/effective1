# Marvel Comics

[Ссылка на проект](https://effective1.vercel.app/)

Приложение для просмотра комиксов Marvel с возможностью добавления в избранное и переключения тем.

---

## Запуск приложения

1. **Установка зависимостей**:
   ```bash
   npm install
   ```

2. **Настройка окружения**:
   - Создайте файл `.env` в корне проекта.
   - Добавьте в него следующие переменные окружения:
     ```env
     VITE_MARVEL_PUBLIC_KEY=your_public_key
     VITE_MARVEL_PRIVATE_KEY=your_private_key
     ```

3. **Запуск в режиме разработки**:
   ```bash
   npm run dev
   ```

4. **Сборка для production**:
   ```bash
   npm run build
   ```

---

## Возможности

1. **Просмотр комиксов**:
   - Список последних комиксов Marvel.
   - Поиск по названию.
   - Бесконечная прокрутка.

2. **Детальная информация**:
   - Просмотр описания комикса.
   - Похожие комиксы.
   - Добавление в избранное.

3. **Избранное**:
   - Сохранение любимых комиксов.
   - Просмотр списка избранного.
   - Удаление из избранного.

4. **Настройки**:
   - Переключение между светлой и темной темой.
   - Поддержка двух языков (английский/русский).

---

## Скриншоты

![Светлая тема](screenshots/light-theme.png)
![Темная тема](screenshots/dark-theme.png)
![Детали комикса](screenshots/comic-details.png)
![Детали комикса 2](screenshots/comic-details2.png)
![Избранное](screenshots/favorites.png)

---

## Технологии

- React + TypeScript
- Vite
- MobX (стейт-менеджмент)
- SCSS (стилизация)
- React Router (навигация)
- react-i18next (локализация)
- Marvel API (данные комиксов)