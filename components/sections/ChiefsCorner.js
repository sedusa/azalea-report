import { useState } from 'react';
import styles from '../../styles/ChiefsCorner.module.css';
import TruncateText from '../../utils/truncateText';

const ChiefsCorner = ({ chiefsCorner: { title, chiefs } }) => {
  const [expandedChiefs, setExpandedChiefs] = useState({});

  const toggleChiefContent = (index) => {
    setExpandedChiefs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return (
    <>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.chiefsSection}>
        {chiefs.map((chief, index) => (
          <div key={index} className={styles.chiefColumn}>
            <img
              src={chief.image}
              alt={chief.name}
              className={styles.chiefImage}
            />
            <h3 className={styles.chiefName}>{chief.name}</h3>
            <div className={styles.chiefText}>
              {expandedChiefs[index] ? (
                <div dangerouslySetInnerHTML={{ __html: chief.content }} />
              ) : (
                <TruncateText content={chief.content} />
              )}
              <br />
              {chief.content.length > 200 && (
                <button
                  onClick={() => toggleChiefContent(index)}
                  className={styles.toggleButton}
                >
                  {expandedChiefs[index] ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChiefsCorner;
