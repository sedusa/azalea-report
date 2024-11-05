import styles from '@styles/Culturosity.module.css';

const Culturosity = ({
  culturosity: {
    sectionTitle,
    description,
    title,
    author,
    coverImage,
    imageCaption,
    content,
  },
}) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <div className={styles.culturosityContent}>
        <h3 className={styles.culturosityTitle}>{title}</h3>
        <div className={styles.culturosityAuthor}>
          By: {author}
        </div>
        <div className={styles.culturosityImageWrapper}>
          <img
            src={coverImage}
            alt={sectionTitle}
            className={styles.culturosityCoverImage}
          />
          <small className={styles.culturosityCoverImageCaption}>
            {imageCaption}
          </small>
        </div>    
        <div className={styles.culturosityText}>
          <div
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </div>
        <div className={styles.culturosityDescription}>{description}</div>
      </div>
    </>
  );
};

export default Culturosity;
