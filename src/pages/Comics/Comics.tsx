import { useState } from "react";
import ComicCard from "../../components/ComicCard/ComicCard";
import { comics } from "../../mocks/comics";
import styles from "./Comics.module.scss";

const Comics = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.comics}>
      <h1>Comics</h1>
      <div className={styles.list}>
        {comics.map((comic) => (
          <ComicCard
            key={comic.id}
            comic={comic}
            isFavorite={favorites.includes(comic.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default Comics;