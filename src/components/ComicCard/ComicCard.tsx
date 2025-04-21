import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { comicsStore } from '../../stores/comicsStore';
import { Comic } from '../../api/marvel';
import styles from './ComicCard.module.scss';

interface ComicCardProps {
  comic: Comic;
  showFavoriteButton?: boolean;
  isFavorite?: boolean; // Переименовали isFavoriteDefault в isFavorite
}

const ComicCard = observer(({
  comic,
  showFavoriteButton = true,
  isFavorite: isFavoriteProp
}: ComicCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleFavorite } = comicsStore;
  const getSafeImageUrl = (url: string) => {
    // 1. Принудительно используем HTTPS
    let safeUrl = url.replace('http://', 'https://');

    // 2. Добавляем временную метку для избежания кэширования
    safeUrl += `?t=${new Date().getTime()}`;

    return safeUrl;
  };
  // Используем переданное значение или получаем из store
  const isFavorite = isFavoriteProp ?? comicsStore.isFavorite(comic.id);

  return (
    <div className={styles.card} style={{ height: '400px' }}>
    <div
      className={styles.card}
      style={{ height: '100%' }} // Добавляем фиксированную высоту
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
    <div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/comic/${comic.id}`} className={styles.link}>
        <img src={getSafeImageUrl(comic.thumbnail)} alt={comic.title} />
        <h3>{comic.title}</h3>
      </Link>
      {showFavoriteButton && isHovered && (
        <button
          className={styles.favoriteButton}
          onClick={() => toggleFavorite(comic)}
        >
          {isFavorite ? "❤️" : "♡"}
        </button>
      )}
    </div>
    </div>
    </div>
  );
});

export default ComicCard;