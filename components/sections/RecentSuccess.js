import styles from '../../styles/RecentSuccess.module.css';
import Carousel from '../../components/Carousel';

const RecentSuccess = ({
  recentSuccess: {
    sectionTitle,
    title,
    image,
    imageCaption,
    content,
    posterImage,
  },
}) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
        <div className={styles.recentSuccessContent}>
          <h3 className={styles.recentSuccessTitle}>{title}</h3>
          <div className={styles.recentSuccessImageWrapper}>
            <img
              src={image}
              alt={sectionTitle}
              className={styles.recentSuccessImage}
            />
            <small className={styles.recentSuccessCaption}>
              {imageCaption}
            </small>
          </div>
          <div
            className={styles.recentSuccessText}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <h3 className={styles.recentSuccessTitle}>
            Poster Presentation Highlights
          </h3>
          <Carousel
            images={posterImage}
            interval={12000}
            aspectRatio='1:1'
          />
        </div>
    </>
  );
};

export default RecentSuccess;
