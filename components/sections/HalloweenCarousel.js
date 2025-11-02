import Carousel from '@components/Carousel';
import styles from '@styles/HalloweenCarousel.module.css';

const HalloweenCarousel = ({
  halloweenCarousel: {
    photos = []
  },
}) => {
  return (
    <div className={styles.halloweenWrapper}>
      <h2 className={styles.halloweenTitle}>Halloween 2025</h2>
      <div className={styles.halloweenContainer}>
        {/* Blood drips from top border */}
        <div className={styles.bloodDrip}></div>
        <div className={styles.bloodDrip}></div>
        <div className={styles.bloodDrip}></div>
        <div className={styles.bloodDrip}></div>
        <div className={styles.bloodDrip}></div>
        
        {/* Decorative skeleton borders */}
        <div className={styles.skeletonCorner} style={{ top: '-10px', left: '-10px' }}>💀</div>
        <div className={styles.skeletonCorner} style={{ top: '-10px', right: '-10px' }}>💀</div>
        <div className={styles.skeletonCorner} style={{ bottom: '-10px', left: '-10px' }}>💀</div>
        <div className={styles.skeletonCorner} style={{ bottom: '-10px', right: '-10px' }}>💀</div>
        
        {/* Side skeleton decorations */}
        <div className={styles.skeletonSide} style={{ top: '20%', left: '-15px' }}>🦴</div>
        <div className={styles.skeletonSide} style={{ top: '50%', left: '-15px' }}>🦴</div>
        <div className={styles.skeletonSide} style={{ top: '80%', left: '-15px' }}>🦴</div>
        <div className={styles.skeletonSide} style={{ top: '20%', right: '-15px' }}>🦴</div>
        <div className={styles.skeletonSide} style={{ top: '50%', right: '-15px' }}>🦴</div>
        <div className={styles.skeletonSide} style={{ top: '80%', right: '-15px' }}>🦴</div>
        
        {/* Top and bottom skeleton decorations */}
        <div className={styles.skeletonTop} style={{ left: '15%', top: '-20px' }}>☠️</div>
        <div className={styles.skeletonTop} style={{ left: '50%', top: '-20px' }}>☠️</div>
        <div className={styles.skeletonTop} style={{ left: '85%', top: '-20px' }}>☠️</div>
        <div className={styles.skeletonTop} style={{ left: '15%', bottom: '-20px' }}>☠️</div>
        <div className={styles.skeletonTop} style={{ left: '50%', bottom: '-20px' }}>☠️</div>
        <div className={styles.skeletonTop} style={{ left: '85%', bottom: '-20px' }}>☠️</div>
        
        {/* Pumpkin decorations */}
        <div className={styles.pumpkin} style={{ top: '-25px', left: '8%' }}>🎃</div>
        <div className={styles.pumpkin} style={{ top: '-25px', left: '35%' }}>🎃</div>
        <div className={styles.pumpkin} style={{ top: '-25px', left: '62%' }}>🎃</div>
        <div className={styles.pumpkin} style={{ top: '-25px', left: '90%' }}>🎃</div>
        <div className={styles.pumpkin} style={{ bottom: '-25px', left: '8%' }}>🎃</div>
        <div className={styles.pumpkin} style={{ bottom: '-25px', left: '35%' }}>🎃</div>
        <div className={styles.pumpkin} style={{ bottom: '-25px', left: '62%' }}>🎃</div>
        <div className={styles.pumpkin} style={{ bottom: '-25px', left: '90%' }}>🎃</div>
        <div className={styles.pumpkin} style={{ top: '10%', left: '-30px' }}>🎃</div>
        <div className={styles.pumpkin} style={{ top: '50%', left: '-30px' }}>🎃</div>
        <div className={styles.pumpkin} style={{ top: '90%', left: '-30px' }}>🎃</div>
        <div className={styles.pumpkin} style={{ top: '10%', right: '-30px' }}>🎃</div>
        <div className={styles.pumpkin} style={{ top: '50%', right: '-30px' }}>🎃</div>
        <div className={styles.pumpkin} style={{ top: '90%', right: '-30px' }}>🎃</div>
        
        <div className={styles.carouselInner}>
          <Carousel images={photos} interval={8000} />
        </div>
      </div>
    </div>
  );
};

export default HalloweenCarousel;

