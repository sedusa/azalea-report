import styles from '@styles/About.module.css';

const AboutSection = ({ about: { sectionTitle, content, signature } }) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
      <div className={styles.signature}>{signature}</div>
      <br />
    </>
  );
};

export default AboutSection;
