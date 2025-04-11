import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import ComicCard from '../../components/ComicCard/ComicCard';
import { comicsStore } from '../../stores/comicsStore';
import styles from './Comics.module.scss';

const Comics = observer(() => {
  const { 
    comics, 
    currentPage, 
    total, 
    limit, 
    loading, 
    loadComics, 
    setCurrentPage 
  } = comicsStore;

  useEffect(() => {
    loadComics(currentPage);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    loadComics(newPage);
    window.scrollTo(0, 0);
  };

  const renderPagination = () => {
    const pageCount = Math.ceil(total / limit);
    const pagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(pageCount, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          « First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹ Prev
        </button>
        {Array.from({ length: endPage - startPage + 1 }).map((_, i) => (
          <button
            key={startPage + i}
            onClick={() => handlePageChange(startPage + i)}
            className={currentPage === startPage + i ? styles.active : ''}
          >
            {startPage + i}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          Next ›
        </button>
        <button
          onClick={() => handlePageChange(pageCount)}
          disabled={currentPage === pageCount}
        >
          Last »
        </button>
      </div>
    );
  };

  return (
    <div className={styles.comics}>
      <h1>Marvel Comics</h1>
      
      {loading && !comics.length ? (
        <div className={styles.loadingMessage}>Loading comics...</div>
      ) : comics.length === 0 ? (
        <div className={styles.emptyMessage}>No comics found</div>
      ) : (
        <>
          <div className={styles.comicsGrid}>
            {comics.map(comic => (
              <div key={comic.id} className={styles.comicCardWrapper}>
                <ComicCard comic={comic} />
              </div>
            ))}
          </div>
          
          {total > limit && renderPagination()}
        </>
      )}
    </div>
  );
});

export default Comics;