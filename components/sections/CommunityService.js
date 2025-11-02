import { useState, useRef } from 'react';
import Carousel from '@components/Carousel';
import styles from '@styles/CommunityService.module.css';
import { truncateText } from '@utils/truncateText';

const CommunityService = ({
  communityServiceCorner = {},
}) => {
  const {
    sectionTitle,
    title,
    author,
    image,
    imageCaption,
    content,
    content2,
    photosTitle,
    photos,
  } = communityServiceCorner;

  const [expandedCommunityService, setExpandedCommunityService] =
    useState(false);
  const buttonRef = useRef(null);

  // Return null if no data is provided
  if (!sectionTitle && !title) {
    return null;
  }

  const shouldTruncate = content && content.length > 645;

  const handleToggle = () => {
    setExpandedCommunityService(!expandedCommunityService);
    setTimeout(() => {
      const buttonPosition = buttonRef.current?.getBoundingClientRect().top;
      const offset = 1000;
      window.scrollTo({
        top: window.scrollY + buttonPosition - offset,
        behavior: 'smooth'
      });
    }, 0);
  };

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
          {content && (
            <div
              dangerouslySetInnerHTML={{
                __html: expandedCommunityService
                  ? content
                  : truncateText(content, 645),
              }}
            />
          )}
          {(!shouldTruncate || expandedCommunityService) && (
            <>
              <h3 className={styles.communityServiceCarouselTitle}>
                {photosTitle}
              </h3>
              {photos && photos.length > 0 && (
                <Carousel onBackground images={photos} interval={8000} />
              )}
              {content2 && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: content2
                  }}
                />
              )}
            </>
          )}
          {shouldTruncate && (
            <button
              ref={buttonRef}
              onClick={handleToggle}
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
