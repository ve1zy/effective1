import { useState } from "react";
import ComicCard from "../../components/ComicCard/ComicCard";
import { comics } from "../../mocks/comics";
import useFavorites from "../../hooks/useFavorites";
import styles from "./Comics.module.scss";

const Comics = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(1);
  const comicsPerPage = 4;

  const indexOfLastComic = currentPage * comicsPerPage;
  const indexOfFirstComic = indexOfLastComic - comicsPerPage;
  const currentComics = comics.slice(indexOfFirstComic, indexOfLastComic);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(comics.length / comicsPerPage);
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.comics}>
      <h1>Comics</h1>
      <div className={styles.list}>
        {currentComics.map((comic) => (
          <ComicCard
            key={comic.id}
            comic={comic}
            isFavorite={favorites.includes(comic.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
      <div className={styles.pagination}>
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
        >
          Первая
        </button>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Назад
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? styles.active : ""} 
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages} 
        >
          Вперед
        </button>
        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages} 
        >
          Последняя
        </button>
      </div>
    </div>
  );
};

export default Comics;