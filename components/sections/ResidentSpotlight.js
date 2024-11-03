import styles from '../../styles/ResidentSpotlight.module.css';

const ResidentSpotlight = ({
  spotlight: {
    image,
    name,
    birthplace,
    funFact,
    favoriteDish,
    interests,
    postResidencyPlans,
  },
}) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>Resident Spotlight</h2>
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
      </div>
    </>
  );
};

export default ResidentSpotlight;
