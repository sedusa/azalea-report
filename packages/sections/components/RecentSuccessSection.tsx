'use client';

import { useState } from 'react';
import type { RecentSuccessSectionData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface RecentSuccessSectionProps {
  data: RecentSuccessSectionData;
  backgroundColor?: string;
}

/**
 * RecentSuccessSection - Displays achievements and accomplishments
 * Features main image with caption, rich text content, and optional image carousel
 * Matches the styling on azaleareport.com
 */
export function RecentSuccessSection({ data, backgroundColor }: RecentSuccessSectionProps) {
  const { sectionTitle = 'Recent Success', title, content, image, imageCaption, images = [] } = data;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // When no backgroundColor is set, use transparent class for proper dark mode text colors
  const hasBackground = !!backgroundColor;

  // Filter out empty images
  const carouselImages = images.filter(img => img.mediaId);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

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
            color: '#016f53',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}
        >
          {sectionTitle}
        </h2>
      )}

      {/* Title - above the image */}
      {title && (
        <h3
          style={{
            color: '#016f53',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}
        >
          {title}
        </h3>
      )}

      {/* Main Image with Caption */}
      {image && (
        <div style={{ marginBottom: '1.5rem' }}>
          <img
            src={image}
            alt={imageCaption || title}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
          {imageCaption && (
            <p
              style={{
                fontSize: '1rem',
                fontStyle: 'italic',
                marginTop: '0.5rem',
                color: hasBackground ? '#666666' : 'var(--muted-foreground)',
              }}
            >
              {imageCaption}
            </p>
          )}
        </div>
      )}

      {/* Content with ShowMore */}
      {content && (
        <div className="basic-text">
          <ShowMore content={content} maxHeight={300} forceDarkText={hasBackground} />
        </div>
      )}

      {/* Image Carousel */}
      {carouselImages.length > 0 && (
        <div
          style={{
            marginTop: '2rem',
            position: 'relative',
          }}
        >
          {/* Carousel Title */}
          <h4
            style={{
              color: '#016f53',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            Photo Gallery
          </h4>

          {/* Carousel Container */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
            }}
          >
            {/* Current Image */}
            <div
              style={{
                display: 'flex',
                transition: 'transform 0.3s ease-in-out',
              }}
            >
              <img
                src={carouselImages[currentImageIndex].mediaId}
                alt={carouselImages[currentImageIndex].caption || `Photo ${currentImageIndex + 1}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </div>

            {/* Caption */}
            {carouselImages[currentImageIndex].caption && (
              <p
                style={{
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  marginTop: '0.5rem',
                  color: hasBackground ? '#666666' : 'var(--muted-foreground)',
                  textAlign: 'center',
                }}
              >
                {carouselImages[currentImageIndex].caption}
              </p>
            )}

            {/* Navigation Arrows - only show if more than 1 image */}
            {carouselImages.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={goToPrevious}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(1, 111, 83, 0.8)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(1, 111, 83, 1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(1, 111, 83, 0.8)')}
                  aria-label="Previous image"
                >
                  &#8249;
                </button>

                {/* Next Button */}
                <button
                  onClick={goToNext}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(1, 111, 83, 0.8)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(1, 111, 83, 1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(1, 111, 83, 0.8)')}
                  aria-label="Next image"
                >
                  &#8250;
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {carouselImages.length > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '1rem',
              }}
            >
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: index === currentImageIndex ? '#016f53' : '#cccccc',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Image Counter */}
          {carouselImages.length > 1 && (
            <p
              style={{
                textAlign: 'center',
                fontSize: '0.875rem',
                color: hasBackground ? '#666666' : 'var(--muted-foreground)',
                marginTop: '0.5rem',
              }}
            >
              {currentImageIndex + 1} / {carouselImages.length}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
