import styles from "./Footer.module.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>Marvel</div>
      <p>Data provided by Marvel. © {currentYear} MARVEL</p>
      <a href="https://developer.marvel.com" target="_blank" rel="noopener noreferrer">
        developer.marvel.com
      </a>
    </footer>
  );
};

export default Footer;