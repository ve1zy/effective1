import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import ComicCard from '../../components/ComicCard/ComicCard';
import { comicsStore } from '../../stores/comicsStore';
import { Comic } from '../../api/marvel';
import styles from './Favorite.module.scss';
import { useTranslation } from 'react-i18next';
const Favorite = observer(() => {
  const { favorites} = comicsStore;
  const { t } = useTranslation();
  useEffect(() => {
    comicsStore.loadFavorites();
  }, []);

  if (favorites.length === 0) {
    return (
      <div className={styles.favorite}>
        <h1>{t('favoriteComics')}</h1>
        <p>{t('noFavorites')}</p>
      </div>
    );
  }

  return (
    <div className={styles.favorite}>
      <h1>{t('favoriteComics')}</h1>
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