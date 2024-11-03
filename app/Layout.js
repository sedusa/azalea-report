import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.pageBackground}>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}