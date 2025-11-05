import styles from "./Footer.module.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>Manga Explorer</div>
      <p>Data provided by Jikan. {currentYear} JIKAN</p>
      <a href="https://docs.api.jikan.moe/" target="_blank" rel="noopener noreferrer">
        docs.api.jikan.moe
      </a>
    </footer>
  );
};

export default Footer;