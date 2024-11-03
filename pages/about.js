import Head from 'next/head';
import { attributes, react as HomeContent } from '../content/home.md';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const { team, welcome } = attributes;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.pageBackground}>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <section className={styles.fullWidth}>
            <h2 className={styles.sectionTitle}>About the Azalea Report</h2>
            <div
              className={styles.text}
              dangerouslySetInnerHTML={{
                __html: welcome,
              }}
            />
            <div className={styles.text}>{team}</div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
