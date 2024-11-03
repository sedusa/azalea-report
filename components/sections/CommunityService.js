import { useState, useEffect } from 'react';
import styles from '../../styles/CommunityService.module.css';
import { truncateText } from '../../utils/truncateText';

const CommunityService = ({
  communityServiceCorner: {
    sectionTitle,
    title,
    author,
    image,
    imageCaption,
    content,
  },
}) => {
  const [expandedCommunityService, setExpandedCommunityService] =
    useState(false);

  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <div className={styles.communityServiceCornerContent}>
        <h3 className={styles.communityServiceCornerTitle}>{title}</h3>
        <div className={styles.communityServiceCornerSubTitle}>
          By: {author}
        </div>
        <div className={styles.communityServiceCornerImageWrapper}>
          <img
            src={image}
            alt={sectionTitle}
            className={styles.communityServiceCornerImage}
          />
          <small className={styles.communityServiceCornerCaption}>
            {imageCaption}
          </small>
        </div>
        <div className={styles.communityServiceCornerText}>
          <div
            dangerouslySetInnerHTML={{
              __html: expandedCommunityService
                ? content
                : truncateText(content, 645),
            }}
          />
          {content.length > 240 && (
            <button
              onClick={() =>
                setExpandedCommunityService(!expandedCommunityService)
              }
              className={styles.communityServiceCornerToggleButton}
            >
              {expandedCommunityService ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CommunityService;
