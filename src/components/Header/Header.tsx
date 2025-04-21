import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
const Header = () => {
  const { t } = useTranslation();
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Marvel</div>
      <nav>
        <NavLink to="/comics">
          {t('comicsTitle')}
        </NavLink>
        <NavLink to="/favorite">
          {t('favoritesTitle')}
        </NavLink>
      </nav>
      <LanguageSwitcher />
    </header>
  );
};

export default Header;