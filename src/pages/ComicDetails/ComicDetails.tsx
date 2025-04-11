import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ComicCard from '../../components/ComicCard/ComicCard';
import { comicsStore } from '../../stores/comicsStore';
import styles from './ComicDetails.module.scss';

const ComicDetails = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { 
    currentComic, 
    relatedComics,
    loading,
    error
  } = comicsStore;

  useEffect(() => {
    if (id) {
      comicsStore.loadComicDetails(Number(id));
    }
  }, [id]);

  if (loading && !currentComic) {
    return <div className={styles.details}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.details}>
        <div className="error-message">{error}</div>
        <Link to="/comics" className={styles.navLink}>
          ← Back to Comics
        </Link>
      </div>
    );
  }

  if (!currentComic) {
    return (
      <div className={styles.details}>
        <h2>Comic not found</h2>
        <Link to="/comics" className={styles.navLink}>
          ← Back to Comics
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.details}>
      <div className={styles.mainContent}>
        <h1>{currentComic.title}</h1>
        <img 
          src={currentComic.thumbnail} 
          alt={currentComic.title} 
          className={styles.comicImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-comic.jpg';
          }}
        />
        <p>{currentComic.description || "No description available"}</p>
      </div>

      <div className={styles.relatedSection}>
        <h2>Related Comics</h2>
        {relatedComics.length > 0 ? (
          <div className={styles.relatedGrid}>
            {relatedComics.map(comic => (
              <ComicCard
                key={comic.id}
                comic={comic}
                showFavoriteButton={true}
              />
            ))}
          </div>
        ) : (
          <p>No related comics found</p>
        )}
      </div>
    </div>
  );
});

export default ComicDetails;
