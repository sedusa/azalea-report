import { useState, useRef } from 'react';
import styles from '@styles/Culturosity.module.css';
import { truncateText } from '@utils/truncateText';

const Culturosity = ({
  culturosity: {
    sectionTitle,
    description,
    title,
    author,
    coverImage,
    imageCaption,
    content,
  },
}) => {
  const [expandedCulturosity, setExpandedCulturosity] = useState(false);
  const buttonRef = useRef(null);
  const shouldTruncate = content.length > 645;

  const handleToggle = () => {
    setExpandedCulturosity(!expandedCulturosity);
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
      <div className={styles.culturosityContent}>
        <h3 className={styles.culturosityTitle}>{title}</h3>
        <div className={styles.culturosityAuthor}>By: {author}</div>
        <div className={styles.culturosityImageWrapper}>
          <img
            src={coverImage}
            alt={sectionTitle}
            className={styles.culturosityCoverImage}
          />
          <small className={styles.culturosityCoverImageCaption}>
            {imageCaption}
          </small>
        </div>
        <div className={styles.culturosityText}>
          <div
            dangerouslySetInnerHTML={{
              __html: expandedCulturosity
                ? content
                : truncateText(content, 645),
            }}
          />
          {(!shouldTruncate || expandedCulturosity) && (
            <div className={styles.culturosityDescription}>{description}</div>
          )}
          {shouldTruncate && (
            <button
              ref={buttonRef}
              onClick={handleToggle}
              className={styles.culturosityToggleButton}
            >
              {expandedCulturosity ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Culturosity;
