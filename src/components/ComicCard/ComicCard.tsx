import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { comicsStore } from '../../stores/comicsStore';
import { Comic } from '../../api/marvel';
import styles from './ComicCard.module.scss';
import { useState } from 'react';
interface ComicCardProps {
  comic: Comic;
  showFavoriteButton?: boolean;
  isFavorite?: boolean; 
}

const ComicCard = observer(({
  comic,
  showFavoriteButton = true,
  isFavorite: isFavoriteProp
}: ComicCardProps) => {
  const { toggleFavorite } = comicsStore;
  const [isHovered, setIsHovered] = useState(false);
  const getSafeImageUrl = (url: string) => {
    let safeUrl = url.replace('http://', 'https://');

    safeUrl += `?t=${new Date().getTime()}`;

    return safeUrl;
  };
  const isFavorite = isFavoriteProp ?? comicsStore.isFavorite(comic.id);

  return (
    <div className={`${styles.card} ${isHovered ? 'show-favorite-button' : ''}`}
    onMouseEnter={() => setIsHovered(true)} // Показать кнопку при наведении
    onMouseLeave={() => setIsHovered(false)} // Скрыть кнопку при уходе курсора
    onTouchStart={() => setIsHovered(!isHovered)}>
      <Link to={`/comic/${comic.id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img 
            src={getSafeImageUrl(comic.thumbnail)} 
            alt={comic.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-comic.jpg';
            }}
          />
        </div>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{comic.title}</h3>
        </div>
      </Link>
      {showFavoriteButton && (
        <button
          className={styles.favoriteButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(comic);
          }}
        >
          {isFavorite ? "❤️" : "♡"}
        </button>
      )}
    </div>
  );
});

export default ComicCard;
