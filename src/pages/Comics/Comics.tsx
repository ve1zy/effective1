import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import ComicCard from '../../components/ComicCard/ComicCard';
import { comicsStore } from '../../stores/comicsStore';
import styles from './Comics.module.scss';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '../../hooks/useDebounce';

const Comics = observer(() => {
  const { t } = useTranslation();
  const { 
    comics, 
    loading, 
    loadMoreComics, 
    hasMore,
    isLoadingMore,
    resetComics,
    searchComics,
    loadComics
  } = comicsStore;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 2000);

  useEffect(() => {
    resetComics();
    loadMoreComics();
    return () => resetComics();
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery === '') {
      setIsSearching(true);
      resetComics();
      loadComics().finally(() => setIsSearching(false));
    } else if (debouncedSearchQuery) {
      setIsSearching(true);
      resetComics();
      searchComics(debouncedSearchQuery).finally(() => setIsSearching(false));
    }
  }, [debouncedSearchQuery]);

  const handleSearch = () => {
    setIsSearching(true);
    resetComics();
    if (searchQuery) {
      searchComics(searchQuery).finally(() => setIsSearching(false));
    } else {
      loadComics().finally(() => setIsSearching(false));
    }
  };

  const handleClearSearch = () => {
    setSearchQuery(''); 
  };

  if (loading && !comics.length) {
    return (
      <div className={styles.comics}>
        <h1>{t('comicsTitle')}</h1>
        <div className={styles.loadingContainer}><div className={styles.loadingMessage}>{t('loading')}</div></div>
      </div>
    );
  }

  return (
    <div className={styles.comics}>
      <h1>{t('comicsTitle')}</h1>
      
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
        />
        <button 
          onClick={handleSearch} 
          disabled={isSearching}
          className={styles.searchButton}
        >
          {t('searchButton')}
        </button>
        {searchQuery && (
          <button 
            onClick={handleClearSearch}
            className={styles.clearButton}
            title={t('clearSearch')}
          >
            ×
          </button>
        )}
      </div>

      {comics.length === 0 && !isSearching && !loading ? (
        <div className={styles.emptyMessage}>{t('noComics')}</div>
      ) : (
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
      )}
    </div>
  );
});

export default Comics;