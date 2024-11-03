import styles from '../../styles/Home.module.css';

const Welcome = ({ welcome: { title, message, team } }) => {
  return (
    <section className={styles.fullWidth}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{
          __html: message,
        }}
      />
      <div className={styles.text}>{team}</div>
    </section>
  );
};

export default Welcome;
