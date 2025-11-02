import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../styles/Carousel.module.css';

const Carousel = ({ onBackground, images, interval = 8000, showCaption = true, showArrows = true, aspectRatio = '16:9' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + images.length) % images.length
    );
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Use a class for 1:1 aspect ratio instead of inline style
  const isSquare = aspectRatio === '1:1';
  let containerStyle = {};
  if (!isSquare) {
    const [aspectRatioWidth, aspectRatioHeight] = aspectRatio.split(':').map(Number);
    containerStyle = { paddingBottom: `${(aspectRatioHeight / aspectRatioWidth) * 100}%` };
  }

  return (
    <div className={styles.carouselWrapper}>
      <div
        className={
          isSquare
            ? `${styles.carouselContainer} ${styles.squareCarousel}`
            : styles.carouselContainer
        }
        style={containerStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles.carouselContent}>
          {showArrows && (
            <button 
              className={`${styles.carouselButton} ${styles.prevButton}`} 
              onClick={prevSlide}
              aria-label="Previous image"
              type="button"
            >
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
            <button 
              className={`${styles.carouselButton} ${styles.nextButton}`} 
              onClick={nextSlide}
              aria-label="Next image"
              type="button"
            >
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