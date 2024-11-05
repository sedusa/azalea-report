import styles from '@styles/Culturosity.module.css';

const Culturosity = ({
  culturosity: { sectionTitle, subtitle, author, coverImage, content },
}) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <p>{subtitle}</p>
      <div className={styles.communityServiceCornerContent}>
        <div className={styles.communityServiceCornerSubTitle}>
          By: {author}
        </div>
        <div className={styles.communityServiceCornerText}>
          <div
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Culturosity;
