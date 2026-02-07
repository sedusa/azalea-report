'use client';

import type { PhotosOfMonthSectionData } from '@azalea/shared/types';
import { useAutoPlayCarousel } from './useAutoPlayCarousel';

interface PhotosOfMonthSectionProps {
  data: PhotosOfMonthSectionData;
  backgroundColor?: string;
}

/**
 * PhotosOfMonthSection - Displays featured photos in a carousel
 * Layout:
 * - Section title at top
 * - Optional title
 * - Image carousel with captions and navigation
 */
export function PhotosOfMonthSection({ data, backgroundColor }: PhotosOfMonthSectionProps) {
  const { sectionTitle, title, images = [] } = data;

  // When backgroundColor is set, use dark text for readability on pastel backgrounds
  const hasBackground = !!backgroundColor;

  // Filter out empty images
  const carouselImages = images.filter(img => img.mediaId);

  // Text colors based on background
  const headingColor = '#016f53';
  const mutedColor = hasBackground ? '#666666' : 'var(--muted-foreground)';

  const {
    currentIndex: currentImageIndex,
    isTransitioning,
    goToPrevious,
    goToNext,
    goToSlide,
    hoverProps,
  } = useAutoPlayCarousel({ totalSlides: carouselImages.length });

  // Don't render if no images
  if (carouselImages.length === 0) {
    return null;
  }

  return (
    <section
      className={hasBackground ? 'section-card section-with-bg' : 'section-transparent'}
      style={{
        marginBottom: '2rem',
        backgroundColor: backgroundColor || 'transparent',
        borderRadius: hasBackground ? 'var(--radius, 0.75rem)' : undefined,
        padding: hasBackground ? '2rem' : undefined,
      }}
    >
      {/* Section Title */}
      {sectionTitle && (
        <h2
          className="section-title"
          style={{
            color: headingColor,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
          }}
        >
          {sectionTitle}
        </h2>
      )}

      {/* Title */}
      {title && (
        <h3
          style={{
            color: headingColor,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.3rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
          }}
        >
          {title}
        </h3>
      )}

      {/* Image Carousel */}
      <div
        style={{
          position: 'relative',
        }}
        {...hoverProps}
      >
        {/* Image Container - Full width */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            backgroundColor: hasBackground ? '#f0f0f0' : 'var(--card)',
          }}
        >
          {/* Images with Fade Transition */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '66.67%', // 3:2 aspect ratio
            }}
          >
            {carouselImages.map((img, index) => (
              <img
                key={`${img.mediaId}-${index}`}
                src={img.mediaId}
                alt={img.caption || `Photo ${index + 1}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: index === currentImageIndex ? 1 : 0,
                  transition: 'opacity 0.4s ease-in-out',
                }}
              />
            ))}
          </div>
        </div>

        {/* Caption Below Image */}
        {carouselImages[currentImageIndex]?.caption && (
          <p
            style={{
              fontSize: '0.9rem',
              fontStyle: 'italic',
              marginTop: '0.75rem',
              color: mutedColor,
              textAlign: 'center',
              transition: 'opacity 0.3s ease',
            }}
          >
            {carouselImages[currentImageIndex].caption}
          </p>
        )}

        {/* Navigation Buttons - Below image */}
        {carouselImages.length > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              disabled={isTransitioning}
              style={{
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                cursor: isTransitioning ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                opacity: isTransitioning ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isTransitioning) {
                  e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.7)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
              }}
              aria-label="Previous image"
            >
              ‹
            </button>

            {/* Dots Indicator - Between buttons */}
            {carouselImages.length <= 20 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    disabled={isTransitioning}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: index === currentImageIndex ? '#016f53' : '#cccccc',
                      cursor: isTransitioning ? 'default' : 'pointer',
                      transition: 'all 0.3s ease',
                      opacity: isTransitioning ? 0.7 : 1,
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              style={{
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                cursor: isTransitioning ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                opacity: isTransitioning ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isTransitioning) {
                  e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.7)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
              }}
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
