import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import ComicCard from '../../components/ComicCard/ComicCard';
import { comicsStore } from '../../stores/comicsStore';
import { Comic } from '../../api/marvel';
import styles from './Favorite.module.scss';

const Favorite = observer(() => {
  const { favorites} = comicsStore;

  // Загрузка избранных комиксов при монтировании
  useEffect(() => {
    comicsStore.loadFavorites();
  }, []);

  if (favorites.length === 0) {
    return (
      <div className={styles.favorite}>
        <h1>Favorite Comics</h1>
        <p>No favorites yet. Add some comics to your favorites!</p>
      </div>
    );
  }

  return (
    <div className={styles.favorite}>
      <h1>Favorite Comics</h1>
      <div className={styles.list}>
        {favorites.map((comic: Comic) => (
          <ComicCard 
            key={comic.id}
            comic={comic}
            showFavoriteButton={true}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
});

export default Favorite;
