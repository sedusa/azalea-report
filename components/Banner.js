import React from 'react';
import styles from '@styles/Banner.module.css'

const Banner = ({ banner: {
  headerImage,
  title,
  subtitle,
  edition,
  date,
  overlay
}
}) => {
  const renderOverlay = () => {
    if (!overlay || !overlay.show) {
      return null;
    }

    const overlayType = overlay.type || 'halloween';

    switch (overlayType) {
      case 'halloween':
        return (
          <div className={styles.halloweenOverlay}>
            <div className={styles.halloweenText}>
              {overlay.text || 'Halloween edition'}
              {overlay.showPumpkin !== false && (
                <span className={styles.pumpkin}>🎃</span>
              )}
            </div>
          </div>
        );
      // Add more overlay types here in the future
      // case 'christmas':
      //   return <ChristmasOverlay {...overlay} />;
      // case 'custom':
      //   return <CustomOverlay {...overlay} />;
      default:
        return null;
    }
  };

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
          {renderOverlay()}
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