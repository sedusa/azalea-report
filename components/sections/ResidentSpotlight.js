import styles from '@styles/ResidentSpotlight.module.css';

const ResidentSpotlight = ({
  spotlight: {
    sectionTitle,
    image,
    name,
    birthplace,
    funFact,
    favoriteDish,
    interests,
    postResidencyPlans,
    wordsOfWisdom
  },
}) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <div className={styles.spotlightContainer}>
        <img src={image} alt={name} className={styles.spotlightImage} />
        <h3 className={styles.spotlightName}>{name}</h3>
        <p className={styles.spotlightText}>
          <strong>Birth place:</strong> {birthplace}
        </p>
        <p className={styles.spotlightText}>
          <strong>Fun fact:</strong> {funFact}
        </p>
        <p className={styles.spotlightText}>
          <strong>Favorite dish:</strong> {favoriteDish}
        </p>
        <p className={styles.spotlightText}>
          <strong>Interests:</strong> {interests}
        </p>
        <p className={styles.spotlightText}>
          <strong>Post-residency plans:</strong> {postResidencyPlans}
        </p>
        {wordsOfWisdom && (
          <p className={styles.spotlightText}>
            <strong>Advice to the incoming class:</strong> {wordsOfWisdom}
          </p>
        )}
      </div>
    </>
  );
};

export default ResidentSpotlight;
