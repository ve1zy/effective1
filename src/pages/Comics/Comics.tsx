import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import ComicCard from '../../components/ComicCard/ComicCard';
import { comicsStore } from '../../stores/comicsStore';
import styles from './Comics.module.scss';
import { useTranslation } from 'react-i18next';
const Comics = observer(() => {
  const { t } = useTranslation();
  const { 
    comics, 
    loading, 
    loadMoreComics, 
    hasMore,
    isLoadingMore,
    resetComics
  } = comicsStore;

  useEffect(() => {
    resetComics();
    loadMoreComics();
    return () => resetComics();
  }, []);

  if (loading && !comics.length) {
    return (
      <div className={styles.comics}>
        <h1>{t('comicsTitle')}</h1>
        <div className={styles.loadingMessage}>{t('loading')}</div>
      </div>
    );
  }

  if (comics.length === 0) {
    return (
      <div className={styles.comics}>
        <h1>{t('comicsTitle')}</h1>
        <div className={styles.emptyMessage}>{t('noComics')}</div>
      </div>
    );
  }

  return (
    <div className={styles.comics}>
      <h1>{t('comicsTitle')}</h1>
      
      <VirtuosoGrid
        useWindowScroll
        totalCount={hasMore ? comics.length + 1 : comics.length}
        endReached={loadMoreComics}
        overscan={200}
        listClassName={styles.comicsGrid}
        itemClassName={styles.comicCardWrapper}
        itemContent={(index) => {
          if (index >= comics.length) {
            return (
              <div className={styles.loadingMore}>
                {isLoadingMore ? t('loading') : t('noMore')}
              </div>
            );
          }
          
          return <ComicCard comic={comics[index]} />;
        }}
      />
    </div>
  );
});

export default Comics;