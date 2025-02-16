import { useState, useRef } from 'react';
import styles from '@styles/GenericSingleImageTextSection.module.css';
import { truncateText } from '@utils/truncateText';

const GenericSingleImageTextSection = ({
  genericSingleImageTextSection: {
    sectionTitle,
    description,
    title,
    author,
    coverImage,
    imageCaption,
    content,
  },
}) => {
  const [expandedGeneric, setExpandedGeneric] = useState(false);
  const buttonRef = useRef(null);
  const shouldTruncate = content.length > 645;

  const handleToggle = () => {
    setExpandedGeneric(!expandedGeneric);
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
      <div className={styles.genericContent}>
        <h3 className={styles.genericTitle}>{title}</h3>
        <div className={styles.genericAuthor}>By: {author}</div>
        <div className={styles.genericImageWrapper}>
          <img
            src={coverImage}
            alt={sectionTitle}
            className={styles.genericCoverImage}
          />
          <small className={styles.genericCoverImageCaption}>
            {imageCaption}
          </small>
        </div>
        <div className={styles.genericText}>
          <div
            dangerouslySetInnerHTML={{
              __html: expandedGeneric
                ? content
                : truncateText(content, 645),
            }}
          />
          {(!shouldTruncate || expandedGeneric) && (
            <div className={styles.genericDescription}>{description}</div>
          )}
          {shouldTruncate && (
            <button
              ref={buttonRef}
              onClick={handleToggle}
              className={styles.genericToggleButton}
            >
              {expandedGeneric ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default GenericSingleImageTextSection;
