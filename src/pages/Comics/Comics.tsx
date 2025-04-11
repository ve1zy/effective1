import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import ComicCard from '../../components/ComicCard/ComicCard';
import { comicsStore } from '../../stores/comicsStore';
import styles from './Comics.module.scss';

const Comics = observer(() => {
  const { comics, offset, total, limit, loading, loadComics } = comicsStore;

  useEffect(() => {
    loadComics(0);
  }, []);

  const handlePageChange = (newOffset: number) => {
    loadComics(newOffset);     window.scrollTo(0, 0);
  };

  const renderPagination = () => {
    const pageCount = Math.ceil(total / limit);
    const currentPage = offset / limit + 1;
    const pagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(pageCount, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(0)}
          disabled={offset === 0}
        >
          « First
        </button>
        <button
          onClick={() => handlePageChange(offset - limit)}
          disabled={offset === 0}
        >
          ‹ Prev
        </button>
        {Array.from({ length: endPage - startPage + 1 }).map((_, i) => (
          <button
            key={startPage + i}
            onClick={() => handlePageChange((startPage + i - 1) * limit)}
            className={offset === (startPage + i - 1) * limit ? styles.active : ''}
          >
            {startPage + i}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(offset + limit)}
          disabled={offset + limit >= total}
        >
          Next ›
        </button>
        <button
          onClick={() => handlePageChange((pageCount - 1) * limit)}
          disabled={offset + limit >= total}
        >
          Last »
        </button>
      </div>
    );
  };

  if (loading && !comics.length) {
    return <div className={styles.comics}>Loading...</div>;
  }

  return (
    <div className={styles.comics}>
      <h1>Marvel Comics</h1>
      <div className={styles.list}>
        {comics.map(comic => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>
      {total > limit && renderPagination()}
    </div>
  );
});

export default Comics;