import styles from '@styles/Musings.module.css';
import { useState, useRef } from 'react';
import { truncateText } from '@utils/truncateText';

const Musings = ({
  musings: {
    sectionTitle,
    title,
    image,
    author,
    content
  },
}) => {
  const [expandedMusings, setExpandedMusings] = useState(false);
  const buttonRef = useRef(null);
  const shouldTruncate = content.length > 645;

  const handleToggle = () => {
    setExpandedMusings(!expandedMusings);
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
      <div className={styles.musingsContainer}>
        <h3 className={styles.musingsTitle}>{title}</h3>
        <div className={styles.musingsSubTitle}>
          By: {author}
        </div>
        <img src={image} alt={'musings-image'} className={styles.musingsImage} />
        <div className={styles.musingsText}>
          <div
            dangerouslySetInnerHTML={{
              __html: expandedMusings ? content : truncateText(content, 620),
            }}
          />
          {shouldTruncate && (
            <button
              ref={buttonRef}
              onClick={handleToggle}
              className={styles.musingsToggleButton}
            >
              {expandedMusings ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Musings;
