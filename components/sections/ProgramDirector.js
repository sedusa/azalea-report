import styles from '../../styles/ProgramDirector.module.css';

const ProgramDirector = ({
  programDirector: {
    sectionTitle,
    name,
    title,
    image,
    message
  },
}) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <div className={styles.programDirectorSection}>
        <img
          src={image}
          alt={name}
          className={styles.programDirectorImage}
        />
        <div className={styles.programDirectorContent}>
          <h2 className={styles.programDirectorName}>{name}</h2>
          <p className={styles.programDirectorTitle}>{title}</p>
          <div
            className={styles.programDirectorMessage}
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>
      </div>
    </>
  );
};

export default ProgramDirector;
