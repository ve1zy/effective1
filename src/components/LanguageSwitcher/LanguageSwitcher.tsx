import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.scss'; 

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button 
        className={styles.dropdownToggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentLanguage.label}
        <span className={styles.arrow}>{isOpen ? '↑' : '↓'}</span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${styles.menuItem} ${i18n.language === language.code ? styles.active : ''}`}
              onClick={() => changeLanguage(language.code)}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;