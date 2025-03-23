import { useState } from "react"; // Удалите React, если он не используется
import { Link } from "react-router-dom";
import styles from "./ComicCard.module.scss";

interface ComicCardProps {
  comic: {
    id: number;
    title: string;
    thumbnail: string;
  };
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const ComicCard = ({ comic, isFavorite, onToggleFavorite }: ComicCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

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
      {isHovered && (
        <button
          className={styles.favoriteButton}
          onClick={() => onToggleFavorite(comic.id)}
        >
          {isFavorite ? "❤️" : "♡"}
        </button>
      )}
    </div>
  );
};

export default ComicCard;