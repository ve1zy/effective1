import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComicCard from '../../components/ComicCard/ComicCard';
import { comicsStore } from '../../stores/comicsStore';
import styles from './ComicDetails.module.scss';
import { useTranslation } from 'react-i18next';
const ComicDetails = observer(() => {
  const { t } = useTranslation();
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
    return <div className={styles.detailsContainer}>{t('loading')}</div>;
  }

  if (error) {
    return (
      <div className={styles.detailsContainer}>
        <div className={styles.errorMessage}>{error}</div>
        <button 
          onClick={() => navigate('/comics')} 
          className={styles.backButton}
        >
          {t('backButton')}
        </button>
      </div>
    );
  }

  const getSafeImageUrl = (url?: string) => {
    if (!url) {
      return '/placeholder-comic.jpg';
    }

    if (url.startsWith('http://')) {
      return `https://${url.substring('http://'.length)}`;
    }

    return url;
  };

  if (!currentComic) {
    return (
      <div className={styles.detailsContainer}>
        <h2>{t('noComics')}</h2>
        <button 
          onClick={() => navigate('/comics')} 
          className={styles.backButton}
        >
          {t('backButton')}
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
            <p className={styles.issueNumber}>{t('issueNumber', { number: currentComic.issueNumber })}</p>
          )}
        </div>

        <div className={styles.comicContent}>
          <div className={styles.comicImageContainer}>
            <img
              src={getSafeImageUrl(currentComic.thumbnail)}
              alt={currentComic.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-comic.jpg';
              }}
            />
          </div>

          <div className={styles.comicDescription}>
            <h2>{t('description')}</h2>
            <p>{currentComic.description || t('noDescription')}</p>
          </div>
        </div>
      </div>

      <div className={styles.relatedSection}>
        <h2>{t('relatedComics')}</h2>
        {relatedComics.length > 0 ? (
          <div className={styles.relatedGrid}>
            {relatedComics.map(comic => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        ) : (
          !loading && <p className={styles.noRelated}>{t('noRelated')}</p>
        )}
      </div>

      <button 
        onClick={() => navigate('/comics')} 
        className={styles.backButton}
      >
        {t('backButton')}
      </button>
    </div>
  );
});

export default ComicDetails;