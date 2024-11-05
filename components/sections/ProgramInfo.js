import styles from '@styles/ProgramInfo.module.css';

const ProgramInfo = ({
  program: {
    title,
    about,
    sgmcImage,
    sgmcImageCaption,
    statistics: {
      sectionTitle,
      residentCount,
      countryCount,
      languageCount,
      partnership,
      continuityClinic
    }
  },
}) => {
  return (
    <>
      <div className={styles.aboutProgram}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <img src={sgmcImage} alt='SGMC Building' className={styles.sgmcImage} />
        <small className={styles.sgmcImageCaption}>{sgmcImageCaption}</small>
        <p className={styles.text}>{about}</p>
      </div>
      <h2 className={`${styles.sectionTitle} ${styles.facts}`}>{sectionTitle}</h2>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          Number of current residents: {residentCount}
        </li>
        <li className={styles.listItem}>
          Our diversity: Residents from {countryCount} different
          countries
        </li>
        <li className={styles.listItem}>
          Number of languages: We speak {languageCount} different
          languages
        </li>
        <li className={styles.listItem}>
          Partnership:  {partnership}
        </li>
        <li className={styles.listItem}>
          Continuity clinic:  {continuityClinic}
        </li>
      </ul>
    </>
  );
};

export default ProgramInfo;
