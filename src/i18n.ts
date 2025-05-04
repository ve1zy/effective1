import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          "searchPlaceholder": "Search comics...",
          "searchButton": "Search",
          "comicsTitle": "Marvel Comics",
          "favoriteComics": "Favorite Comics",
          "favoritesTitle": "Favorites",
          "noFavorites": "No favorites yet. Add some comics to your favorites!",
          "loading": "Loading...",
          "noComics": "No comics found",
          "loadMore": "Load more",
          "noMore": "No more comics",
          "backButton": "Back to Comics",
          "description": "Description",
          "noDescription": "No description available",
          "relatedComics": "You Might Also Like",
          "noRelated": "No related comics found",
          "issueNumber": "Issue #{{number}}",
          "addFavorite": "Added to favorites",
          "removeFavorite": "Removed from favorites"
        }
      },
      ru: {
        translation: {
          "searchPlaceholder": "Поиск комиксов...",
          "searchButton": "Поиск",
          "comicsTitle": "Комиксы Marvel",
          "favoriteComics": "Избранные комиксы",
          "favoritesTitle": "Избранное",
          "noFavorites": "Пока нет избранного. Добавьте комиксы в избранное!",
          "loading": "Загрузка...",
          "noComics": "Комиксы не найдены",
          "loadMore": "Загрузить ещё",
          "noMore": "Больше нет комиксов",
          "backButton": "Назад к комиксам",
          "description": "Описание",
          "noDescription": "Описание отсутствует",
          "relatedComics": "Вам может понравиться",
          "noRelated": "Похожие комиксы не найдены",
          "issueNumber": "Выпуск #{{number}}",
          "addFavorite": "Добавлено в избранное",
          "removeFavorite": "Удалено из избранного"
        }
      }
    }
  });

export default i18n;