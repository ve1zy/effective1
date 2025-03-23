import { Link, useParams } from "react-router-dom"; // Добавьте Link
import { comics } from "../../mocks/comics";
import styles from "./ComicDetails.module.scss";

const ComicDetails = () => {
  const { id } = useParams<{ id: string }>();
  const comic = comics.find((c) => c.id === Number(id));

  if (!comic) {
    return <div>Comic not found</div>;
  }

  return (
    <div className={styles.details}>
      <h1>{comic.title}</h1>
      <img src={comic.thumbnail} alt={comic.title} />
      <p>{comic.description}</p>
      <div className={styles.links}>
        <Link to={`/comic/${comic.id - 1}`}>Previous</Link>
        <Link to={`/comic/${comic.id + 1}`}>Next</Link>
      </div>
    </div>
  );
};

export default ComicDetails;