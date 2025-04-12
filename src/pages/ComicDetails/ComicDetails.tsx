import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComicCard from '../../components/ComicCard/ComicCard';
import { comicsStore } from '../../stores/comicsStore';
import styles from './ComicDetails.module.scss';

const ComicDetails = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    return <div className={styles.detailsContainer}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.detailsContainer}>
        <div className={styles.errorMessage}>{error}</div>
        <button 
          onClick={() => navigate('/comics')} 
          className={styles.backButton}
        >
          Back to Comics
        </button>
      </div>
    );
  }

  if (!currentComic) {
    return (
      <div className={styles.detailsContainer}>
        <h2>Comic not found</h2>
        <button 
          onClick={() => navigate('/comics')} 
          className={styles.backButton}
        >
          Back to Comics
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.comicMain}>
        <div className={styles.comicHeader}>
          <h1>{currentComic.title}</h1>
          {currentComic.issueNumber && (
            <p className={styles.issueNumber}>Issue #{currentComic.issueNumber}</p>
          )}
        </div>

        <div className={styles.comicContent}>
          <div className={styles.comicImageContainer}>
            <img
              src={currentComic.thumbnail}
              alt={currentComic.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-comic.jpg';
              }}
            />
          </div>

          <div className={styles.comicDescription}>
            <h2>Description</h2>
            <p>{currentComic.description || "No description available"}</p>
          </div>
        </div>
      </div>

      <div className={styles.relatedSection}>
        <h2>You Might Also Like</h2>
        {relatedComics.length > 0 ? (
          <div className={styles.relatedGrid}>
            {relatedComics.map(comic => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        ) : (
          !loading && <p className={styles.noRelated}>No related comics found</p>
        )}
      </div>

      <button 
        onClick={() => navigate('/comics')} 
        className={styles.backButton}
      >
        Back to Comics
      </button>
    </div>
  );
});

export default ComicDetails;