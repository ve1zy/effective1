import ComicCard from "../../components/ComicCard/ComicCard";
import { comics } from "../../mocks/comics";
import useFavorites from "../../hooks/useFavorites";
import styles from "./Favorite.module.scss";

const Favorite = () => {
  const { favorites, toggleFavorite } = useFavorites();

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
            onToggleFavorite={() => toggleFavorite(comic.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Favorite;