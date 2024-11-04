import styles from '@styles/Podcast.module.css';

const Podcast = ({ podcast: { sectionTitle, title, description, subtitle } }) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <h3 className={styles.podcastTitle}>{title}</h3>
      <div className={styles.podcastSubtitle}>{subtitle}</div>
      <div className={styles.text}>{description}</div>
      

      <iframe 
        style={{ borderRadius: '12px', marginTop: '20px' }}
        src="https://open.spotify.com/embed/episode/68KNFYvib3spPv0rqB56aB?utm_source=generator&theme=0"
        width="100%"
        height="352"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
      <div className={styles.fallbackLink}>
        <p>Can't see the player? <a 
          href="https://open.spotify.com/episode/68KNFYvib3spPv0rqB56aB?si=YyhvygV2T9G3jpyiQG0OJg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Listen to Episode 5 with Dr. Joseph Hayes on Spotify
        </a></p>
      </div>
    </>
  );
};

export default Podcast;