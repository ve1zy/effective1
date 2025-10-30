import styles from "./Footer.module.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>Marvel</div>
      <p>Data provided by Comic Vine. © {currentYear} COMIC VINE</p>
      <a href="https://comicvine.gamespot.com/api/" target="_blank" rel="noopener noreferrer">
        comicvine.gamespot.com/api/
      </a>
    </footer>
  );
};

export default Footer;