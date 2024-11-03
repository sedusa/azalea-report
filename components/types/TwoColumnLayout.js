import styles from '../../styles/TwoColumnLayout.module.css';

const TwoColumnLayout = ({ leftColumn, rightColumn }) => {
  return (
    <section className={styles.twoColumns}>
      <div className={styles.column}>{leftColumn}</div>
      <div className={styles.column}>{rightColumn}</div>
    </section>
  );
};

export default TwoColumnLayout;