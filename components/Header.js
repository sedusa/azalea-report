import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';
import styles from '../styles/Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
            <Link href="/archives">Previous Issues</Link>
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
            <Link href="/archives" onClick={() => setIsMenuOpen(false)}>Previous Issues</Link> 
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;