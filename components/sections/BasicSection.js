import { useState, useRef } from 'react';
import styles from '@styles/BasicSection.module.css';
import { truncateText } from '@utils/truncateText';

const BasicSection = ({
  basicSection: {
    sectionColor,
    sectionTitle,
    description,
    title,
    author,
    content,
  },
}) => {
  const [expandedBasic, setExpandedBasic] = useState(false);
  const buttonRef = useRef(null);
  const shouldTruncate = content.length > 645;

  const handleToggle = () => {
    setExpandedBasic(!expandedBasic);
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
      <div 
        className={styles.basicContent}
        style={sectionColor ? { backgroundColor: sectionColor } : undefined}
      >
        <h3 className={styles.basicTitle}>{title}</h3>
        <div className={styles.basicAuthor}>By: {author}</div>
        <div className={styles.basicText}>
          <div
            dangerouslySetInnerHTML={{
              __html: expandedBasic
                ? content
                : truncateText(content, 645),
            }}
          />
          {(!shouldTruncate || expandedBasic) && (
            <div className={styles.basicDescription}>{description}</div>
          )}
          {shouldTruncate && (
            <button
              ref={buttonRef}
              onClick={handleToggle}
              className={styles.basicToggleButton}
            >
              {expandedBasic ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default BasicSection;
