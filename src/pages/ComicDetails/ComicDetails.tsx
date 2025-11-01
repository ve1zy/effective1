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
      comicsStore.loadComicDetails(id);
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
  const getSafeImageUrl = (url: string) => {
    let safeUrl = url.replace('http://', 'https://');

    safeUrl += `?t=${new Date().getTime()}`;

    return safeUrl;
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
          <h1>{currentComic.name}</h1>
        </div>

        <div className={styles.comicContent}>
          <div className={styles.comicImageContainer}>
            <img
              src={getSafeImageUrl(
                (currentComic.image && typeof currentComic.image === 'object' && 'url' in currentComic.image && currentComic.image.url)
                || (currentComic as any)['image']
                || (currentComic as any).image
                || '/placeholder-comic.jpg'
              )}
              alt={currentComic.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-comic.jpg';
              }}
            />
          </div>

          <div className={styles.comicDescription}>
            <h2>{t('description')}</h2>
            <div>
              <h3>Power Stats:</h3>
              <ul>
                <li>Intelligence: {currentComic.powerstats.intelligence}</li>
                <li>Strength: {currentComic.powerstats.strength}</li>
                <li>Speed: {currentComic.powerstats.speed}</li>
                <li>Durability: {currentComic.powerstats.durability}</li>
                <li>Power: {currentComic.powerstats.power}</li>
                <li>Combat: {currentComic.powerstats.combat}</li>
              </ul>
            </div>
            <div>
              <h3>Bio:</h3>
              <p><strong>Full Name:</strong> {currentComic.biography['full-name']}</p>
              <p><strong>Alter Egos:</strong> {currentComic.biography['alter-egos']}</p>
              <p><strong>Aliases:</strong> {currentComic.biography.aliases.join(', ')}</p>
              <p><strong>Place of Birth:</strong> {currentComic.biography['place-of-birth']}</p>
              <p><strong>First Appearance:</strong> {currentComic.biography['first-appearance']}</p>
              <p><strong>Publisher:</strong> {currentComic.biography.publisher}</p>
              <p><strong>Alignment:</strong> {currentComic.biography.alignment}</p>
            </div>
            <div>
              <h3>Appearance:</h3>
              <p><strong>Gender:</strong> {currentComic.appearance.gender}</p>
              <p><strong>Race:</strong> {currentComic.appearance.race}</p>
              <p><strong>Height:</strong> {currentComic.appearance.height.join(' / ')}</p>
              <p><strong>Weight:</strong> {currentComic.appearance.weight.join(' / ')}</p>
              <p><strong>Eye Color:</strong> {currentComic.appearance['eye-color']}</p>
              <p><strong>Hair Color:</strong> {currentComic.appearance['hair-color']}</p>
            </div>
            <div>
              <h3>Work:</h3>
              <p><strong>Occupation:</strong> {currentComic.work.occupation}</p>
              <p><strong>Base:</strong> {currentComic.work.base}</p>
            </div>
            <div>
              <h3>Connections:</h3>
              <p><strong>Group Affiliation:</strong> {currentComic.connections['group-affiliation']}</p>
              <p><strong>Relatives:</strong> {currentComic.connections.relatives}</p>
            </div>
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