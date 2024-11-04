import Carousel from '@components/Carousel';
import styles from '@styles/PhotosOfMonth.module.css';

const PhotosOfTheMonth = ({
  photosOfMonth: {
    sectionTitle,
    subTitle,
    photos
  },
}) => {
  return (
    <>
      <h2 className={styles.lensSectionTitle}>
        {sectionTitle}
      </h2>
      <p className={styles.lensSectionSubTitle}>
        {subTitle}
      </p>
      <Carousel images={photos} interval={8000} />
    </>
  );
};

export default PhotosOfTheMonth;
