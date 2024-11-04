import { useState, useEffect } from 'react';
import Carousel from '@components/Carousel';
import styles from '@styles/CommunityService.module.css';
import { truncateText } from '@utils/truncateText';

const CommunityService = ({
  communityServiceCorner: {
    sectionTitle,
    title,
    author,
    image,
    imageCaption,
    content,
    content2,
    photos,
  },
}) => {
  const [expandedCommunityService, setExpandedCommunityService] =
    useState(false);

  const showFullContent = photos?.length > 0 && content2;

  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <div className={styles.communityServiceCornerContent}>
        <h3 className={styles.communityServiceCornerTitle}>{title}</h3>
        {author && (
          <div className={styles.communityServiceCornerSubTitle}>
            By: {author}
          </div>
        )}
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
              __html:
                showFullContent || expandedCommunityService
                  ? content
                  : truncateText(content, 645),
            }}
          />
          {photos && photos.length > 0 && (
            <Carousel images={photos} interval={8000} />
          )}
          {content2 && (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  showFullContent || expandedCommunityService
                    ? content2
                    : truncateText(content2, 645),
              }}
            />
          )}
          {!showFullContent &&
            (content.length > 240 || (content2 && content2.length > 240)) && (
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
