import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Marvel</div>
      <nav>
        <NavLink
          to="/comics"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Comics
        </NavLink>
        <NavLink
          to="/favorite"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Favorite
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;