import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

const Header = () => {
  const { t } = useTranslation();
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Manga Explorer</div>
      <div className={styles.navContainer}>
      <nav>
          <NavLink 
            to="/comics" 
            className={({ isActive }) => isActive ? styles.active : ''}
          >
            {t('comicsTitle')}
          </NavLink>
          <NavLink 
            to="/favorite"
            className={({ isActive }) => isActive ? styles.active : ''}
          >
            {t('favoritesTitle')}
          </NavLink>
        </nav>
        <div className={styles.controls}>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;