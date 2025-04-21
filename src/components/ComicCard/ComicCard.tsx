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

  // Используем переданное значение или получаем из store
  const isFavorite = isFavoriteProp ?? comicsStore.isFavorite(comic.id);

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/comic/${comic.id}`} className={styles.link}>
        <img src={comic.thumbnail} alt={comic.title} />
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
  );
});

export default ComicCard;