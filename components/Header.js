import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';
import styles from '../styles/Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.fixedHeader}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.headerLeft}>
            <Image
              src="/img/azalea.svg"
              alt="azalea-logo"
              width={40}
              height={40}
              className={styles.headerLogo}
            />
            <span className={styles.headerTitle}>Azalea Report</span>
          </Link>
          
          <nav className={styles.desktopNav}>
            <Link href="/about">About</Link>
            <Link href="/feedback">Feedback</Link>
            <Link href="/previous">Previous Issues</Link>
          </nav>
          
          <button 
            className={styles.mobileMenuButton}
            onClick={() => setIsMenuOpen(true)}
          >
            <FiMenu size={24} />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <button 
            className={styles.closeButton}
            onClick={() => setIsMenuOpen(false)}
          >
            <FiX size={24} />
          </button>
          <nav className={styles.mobileNav}>
            <Link href="/previous" onClick={() => setIsMenuOpen(false)}>Previous Issues</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="/feedback" onClick={() => setIsMenuOpen(false)}>Feedback</Link>
            
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;