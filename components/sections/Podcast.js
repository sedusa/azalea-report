import { useState, useRef } from 'react';
import styles from '@styles/Podcast.module.css';

const Podcast = ({
  podcast: { sectionTitle, title, description, subtitle, episodes },
}) => {
  const [expandedEpisodes, setExpandedEpisodes] = useState(false);
  const buttonRef = useRef(null);

  const handleToggle = () => {
    setExpandedEpisodes(!expandedEpisodes);
    setTimeout(() => {
      const buttonPosition = buttonRef.current?.getBoundingClientRect().top;
      const offset = 1000;
      window.scrollTo({
        top: window.scrollY + buttonPosition - offset,
        behavior: 'smooth'
      });
    }, 0);
  };

  const displayedEpisodes = expandedEpisodes ? episodes : episodes.slice(0, 1);

  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <h3 className={styles.podcastTitle}>{title}</h3>
      <div className={styles.podcastSubtitle}>{subtitle}</div>
      {displayedEpisodes.map((episode, index) => (
        <div key={index} className={styles.episodeContainer}>
          <h4 className={styles.episodeTitle}>{episode.name}</h4>
          <div className={styles.text}>{episode.synopsis}</div>
          <iframe
            style={{ borderRadius: '12px', marginTop: '10px' }}
            src={episode.iframeUrl}
            width='100%'
            height='352'
            frameBorder='0'
            allowFullScreen=''
            allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
            loading='lazy'
          />
          <div className={styles.fallbackLink}>
            Can&apos;t see the player?
            <a
              href={episode.noPlayerLink}
              target='_blank'
              rel='noopener noreferrer'
            >
              {episode.noPlayerLinkText}
            </a>
          </div>
        </div>
      ))}
      {episodes.length > 1 && (
        <button
          ref={buttonRef}
          onClick={handleToggle}
          className={styles.toggleButton}
        >
          {expandedEpisodes ? 'Show Less' : 'Show More'}
        </button>
      )}
    </>
  );
};

export default Podcast;
