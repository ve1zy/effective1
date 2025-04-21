import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
      <button 
        onClick={() => changeLanguage('en')}
        style={{ fontWeight: i18n.language === 'en' ? 'bold' : 'normal' }}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('ru')}
        style={{ fontWeight: i18n.language === 'ru' ? 'bold' : 'normal' }}
      >
        RU
      </button>
    </div>
  );
};

export default LanguageSwitcher;