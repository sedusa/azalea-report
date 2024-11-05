import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Carousel.module.css';

const Carousel = ({ onBackground, images, interval = 8000, showCaption = true, showArrows = true, aspectRatio = '16:9' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + images.length) % images.length
    );
  };

  const [aspectRatioWidth, aspectRatioHeight] = aspectRatio.split(':').map(Number);
  const paddingBottom = `${(aspectRatioHeight / aspectRatioWidth) * 100}%`;

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselContainer} style={{ paddingBottom }}>
        <div className={styles.carouselContent}>
          {showArrows && (
            <button className={`${styles.carouselButton} ${styles.prevButton}`} onClick={prevSlide}>
              ‹
            </button>
          )}
          <div className={styles.carouselImageContainer}>
            {images.map((image, index) => (
              <Image
                key={index}
                src={image.image || image}
                alt={image.caption || `Slide ${index + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                className={`${styles.carouselImage} ${
                  index === currentIndex ? styles.active : ''
                }`}
              />
            ))}
          </div>
          {showArrows && (
            <button className={`${styles.carouselButton} ${styles.nextButton}`} onClick={nextSlide}>
              ›
            </button>
          )}
        </div>
      </div>
      {showCaption && (
        <p className={`${styles.photoCaption} ${onBackground ? styles.onBackground : ''}`}>
          {images[currentIndex].caption || ''}
        </p>
      )}
    </div>
  );
};

export default Carousel;