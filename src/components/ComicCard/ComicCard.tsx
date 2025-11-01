import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { comicsStore } from '../../stores/comicsStore';
import { Superhero } from '../../api/superhero';
import styles from './ComicCard.module.scss';
import { useState } from 'react';

interface ComicCardProps {
  comic: Superhero;
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
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onTouchStart={() => setIsHovered(!isHovered)}>
      <Link to={`/comic/${comic.id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img
            src={getSafeImageUrl(
              (comic.image && typeof comic.image === 'object' && 'url' in comic.image && comic.image.url)
              || (comic as any)['image']
              || '/placeholder-comic.jpg'
            )}
            alt={comic.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-comic.jpg';
            }}
          />
        </div>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{comic.name}</h3>
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