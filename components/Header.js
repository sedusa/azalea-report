import Link from 'next/link';
import Logo from '@components/Logo';
import styles from '../styles/Header.module.css';

const Header = () => {
  return (
    <header className={styles.fixedHeader}>
      <div className={styles.headerContent}>
        <Link href='/' className={styles.headerLeft}>
          <div className={styles.headerLogo}>
            <Logo />
          </div>
          <span className={styles.headerTitle}>Azalea Report</span>
        </Link>

        <nav className={styles.desktopNav}>
          <span className={styles.disabledLink}>Previous Issues</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;
