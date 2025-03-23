import { useParams, Link } from "react-router-dom";
import { comics } from "../../mocks/comics";
import styles from "./ComicDetails.module.scss";

const ComicDetails = () => {
  const { id } = useParams<{ id: string }>();
  const comicId = Number(id);
  const comic = comics.find((c) => c.id === comicId);

  const prevComic = comics.find((c) => c.id === comicId - 1);
  const nextComic = comics.find((c) => c.id === comicId + 1);

  const randomComics = comics
    .filter((c) => c.id !== comicId)
    .sort(() => Math.random() - 0.5) 
    .slice(0, 2);

  if (!comic) {
    return <div>Comic not found</div>;
  }

  return (
    <div className={styles.details}>
      <h1>{comic.title}</h1>
      <img src={comic.thumbnail} alt={comic.title} />
      <p>{comic.description}</p>

      <div className={styles.navigation}>
        {prevComic && (
          <Link to={`/comic/${prevComic.id}`} className={styles.navLink}>
            ← Предыдущий: {prevComic.title}
          </Link>
        )}
        {nextComic && (
          <Link to={`/comic/${nextComic.id}`} className={styles.navLink}>
            Следующий: {nextComic.title} →
          </Link>
        )}
      </div>

      <div className={styles.related}>
        <h2>Другие комиксы</h2>
        <div className={styles.relatedList}>
          {randomComics.map((randomComic) => (
            <Link
              key={randomComic.id}
              to={`/comic/${randomComic.id}`}
              className={styles.relatedLink}
            >
              <img src={randomComic.thumbnail} alt={randomComic.title} />
              <p>{randomComic.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComicDetails;