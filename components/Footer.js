import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} Azalea Report - SGMC Health Internal
        Medicine Residency Newsletter
      </p>
    </footer>
  );
};

export default Footer;
