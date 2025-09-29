import styles from '@styles/GenericSingleImageCarouselTextSection.module.css';
import Carousel from '@components/Carousel';

const GenericSingleImageCarouselTextSection = ({
  genericSingleImageCarouselTextSection: {
    sectionTitle,
    description,
    title,
    author,
    coverImage,
    imageCaption,
    content,
    carouselTitle,
    posterImage,
  },
}) => {

  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <div className={styles.genericContent}>
        <h3 className={styles.genericTitle}>{title}</h3>
        <div className={styles.genericAuthor}>By: {author}</div>
        <div className={styles.genericImageWrapper}>
          <img
            src={coverImage}
            alt={sectionTitle}
            className={styles.genericCoverImage}
          />
          <small className={styles.genericCoverImageCaption}>
            {imageCaption}
          </small>
        </div>
        <div className={styles.genericText}>
          <div
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
          <div className={styles.genericDescription}>{description}</div>
        </div>
        {carouselTitle && posterImage && (
          <>
            <h3 className={styles.genericTitle}>
              {carouselTitle}
            </h3>
            <Carousel
              onBackground
              images={posterImage}
              interval={12000}
              aspectRatio='1:1'
            />
          </>
        )}
      </div>
    </>
  );
};

export default GenericSingleImageCarouselTextSection;
