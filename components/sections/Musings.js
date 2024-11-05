import styles from '@styles/Musings.module.css';
import { useState } from 'react';
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
  const shouldTruncate = content.length > 645;

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
              __html: expandedMusings ? content : truncateText(content, 645),
            }}
          />
          {shouldTruncate && (
            <button
              onClick={() => setExpandedMusings(!expandedMusings)}
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
