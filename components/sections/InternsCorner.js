import { useState } from 'react';
import styles from '@styles/InternsCorner.module.css';
import TruncateText from '@utils/truncateText';

const InternsCorner = ({ internsCorner: { title, interns } }) => {
  const [expandedInterns, setExpandedInterns] = useState({});

  const toggleInternContent = (index) => {
    setExpandedInterns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return (
    <>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.internsSection}>
        {interns.map((intern, index) => (
          <div key={index} className={styles.internColumn}>
            <img
              src={intern.image}
              alt={intern.name}
              className={styles.internImage}
            />
            <h3 className={styles.internName}>{intern.name}</h3>
            <div className={styles.internText}>
              {expandedInterns[index] ? (
                <div dangerouslySetInnerHTML={{ __html: intern.content }} />
              ) : (
                <TruncateText content={intern.content} />
              )}
              <br />
              {intern.content.length > 200 && (
                <button
                  onClick={() => toggleInternContent(index)}
                  className={styles.toggleButton}
                >
                  {expandedInterns[index] ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InternsCorner;
