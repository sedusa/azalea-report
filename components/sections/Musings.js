import styles from '@styles/Musings.module.css';

const Musings= ({
  musings: {
    sectionTitle,
    image,
    author,
    content
  },
}) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <div className={styles.spotlightContainer}>
        <img src={image} alt={'musings-image'} className={styles.spotlightImage} />
        <div
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        <h4 className={styles.text}><i>By:</i> {author}</h4>
      </div>
    </>
  );
};

export default Musings;
