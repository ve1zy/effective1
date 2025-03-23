import { useState } from "react";
import ComicCard from "../../components/ComicCard/ComicCard";
import { comics } from "../../mocks/comics";
import styles from "./Favorite.module.scss";

const Favorite = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const favoriteComics = comics.filter((comic) => favorites.includes(comic.id));

  return (
    <div className={styles.favorite}>
      <h1>Favorite</h1>
      <div className={styles.list}>
        {favoriteComics.map((comic) => (
          <ComicCard
            key={comic.id}
            comic={comic}
            isFavorite={true}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorite;