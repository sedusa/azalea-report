import styles from '@styles/Musings.module.css';

const Musings= ({
  musings: {
    sectionTitle,
    title,
    image,
    author,
    content
  },
}) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <div className={styles.musingsContainer}>
        <h3 className={styles.musingsTitle}>{title}</h3>
        <div className={styles.musingsSubTitle}>
          By: {author}
        </div>
        <img src={image} alt={'musings-image'} className={styles.musingsImage} />
        <div
            className={styles.musingsText}
            dangerouslySetInnerHTML={{ __html: content }}
          />
      </div>
    </>
  );
};

export default Musings;
