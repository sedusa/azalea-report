import styles from '../../styles/WellnessCorner.module.css';

const WellnessCorner = ({
  wellnessCorner: {
    sectionTitle,
    title,
    altImageText,
    image,
    content
  },
}) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <div className={styles.wellnessTipSection}>
        <h2 className={styles.wellnessTipTitle}>{title}</h2>
        <div className={styles.wellnessTipContent}>
          <div className={styles.wellnessTipText}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          <img
            src={image}
            alt={altImageText}
            className={styles.wellnessTipImage}
          />
        </div>
      </div>
    </>
  );
};

export default WellnessCorner;
