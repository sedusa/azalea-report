import Image from 'next/image';
import styles from '@styles/NewFromClinic.module.css';

const NewsFromClinic = ({
  newsFromClinic: {
    sectionTitle,
    employeeSpotlight: { subSectionTitle, name, image, title, profile },
  },
}) => {
  return (
    <>
      <div className={styles.spotlightIconContainer}>
        <Image
          src='/img/spotlight.svg'
          alt='Spotlight'
          width={50}
          height={50}
          className={styles.spotlightIcon}
        />
        <h2 className={styles.newsFromClinic}>{sectionTitle}</h2>
      </div>
      <div className={styles.employeeSpotlightContainer}>
        <h3 className={styles.employeeSpotlightHeader}>{subSectionTitle}</h3>
        <div className={styles.employeeSpotlightDivider}></div>
        <div className={styles.employeeSpotlightContent}>
          <div className={styles.employeeImageWrapper}>
            <img
              src={image || '/img/employee-placeholder.jpg'}
              alt={name}
              className={styles.employeeSpotlightImage}
            />
            <h3 className={styles.employeeName}>{name}</h3>
            <p className={styles.employeeTitle}>{title}</p>
          </div>
          <p className={styles.employeeSpotlightDescription}>
            {profile}
          </p>
        </div>
      </div>
    </>
  );
};

export default NewsFromClinic;
