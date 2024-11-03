import React from 'react';
import styles from '@styles/Banner.module.css'

const Banner = ({ banner: {
  headerImage,
  title,
  subtitle,
  edition,
  date
}
}) => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerContent}>
        <div className={styles.bannerImageContainer}>
          <img
            src={headerImage}
            alt="Newsletter header"
            className={styles.bannerImage}
          />
          <div className={styles.bannerOverlay}></div>
        </div>
        <div className={styles.bannerText}>
          <h1 className={styles.bannerTitle}>{title}</h1>
          <h2 className={styles.bannerSubtitle}>{subtitle}</h2>
          <div className={styles.bannerMetadata}>
            <span className={styles.bannerEdition}>Edition {edition} | {date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;