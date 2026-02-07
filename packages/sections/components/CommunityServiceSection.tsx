'use client';

import { useState, useEffect, useRef } from 'react';
import type { CommunityServiceSectionData } from '@azalea/shared/types';
import { useAutoPlayCarousel } from './useAutoPlayCarousel';

interface CommunityServiceSectionProps {
  data: CommunityServiceSectionData;
  backgroundColor?: string;
}

/**
 * CommunityServiceSection - Displays community service activities
 * Layout:
 * - Section title at top (centered, optional underline)
 * - Title for specific content
 * - Image floated left or right with text wrapping around
 * - Full-width content continuation below
 * - Image carousel with captions at bottom (arrows outside image)
 *
 * Follows the same background color rules as other sections:
 * - If backgroundColor is set, uses dark text (#333333) for readability on pastel backgrounds
 * - If no backgroundColor, uses theme-aware text colors (light/dark mode)
 *
 * Note: This component renders content directly (not with ShowMore) to allow
 * proper CSS float text wrapping around the image. ShowMore's overflow:hidden
 * creates a new block formatting context that prevents text wrapping.
 */
export function CommunityServiceSection({ data, backgroundColor }: CommunityServiceSectionProps) {
  const {
    sectionTitle,
    title,
    image,
    imageCaption,
    imagePosition = 'left',
    content,
    photosTitle = 'Photo Gallery',
    images = []
  } = data;
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const maxHeight = 600; // Max height before showing "Show More"

  // When backgroundColor is set, use dark text for readability on pastel backgrounds
  const hasBackground = !!backgroundColor;

  // Filter out empty images
  const carouselImages = images.filter(img => img.mediaId);

  const {
    currentIndex: currentImageIndex,
    isTransitioning,
    goToPrevious,
    goToNext,
    goToSlide,
    hoverProps,
  } = useAutoPlayCarousel({ totalSlides: carouselImages.length });

  // Check if content needs truncation (only when collapsed)
  useEffect(() => {
    if (contentRef.current && !isExpanded) {
      setNeedsTruncation(contentRef.current.scrollHeight > maxHeight);
    }
  }, [content, isExpanded]);

  // Text colors based on background
  const textColor = hasBackground ? '#333333' : 'var(--foreground)';
  const headingColor = '#016f53';
  const mutedColor = hasBackground ? '#666666' : 'var(--muted-foreground)';

  // Float class based on imagePosition
  const floatClass = imagePosition === 'right' ? 'float-right' : 'float-left';

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
      {/* Section Title - Only show if provided */}
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

      {/* Content with image floated (text wraps around) */}
      <div
        ref={contentRef}
        className="basic-text community-service-content"
        style={{
          color: textColor,
          position: 'relative',
          maxHeight: isExpanded ? 'none' : (needsTruncation ? `${maxHeight}px` : 'none'),
          overflow: isExpanded ? 'visible' : (needsTruncation ? 'hidden' : 'visible'),
        }}
      >
        {/* Floated Image - uses CSS class for responsive behavior */}
        {image && (
          <div className={`community-service-image ${floatClass}`}>
            <img
              src={image}
              alt={imageCaption || title}
            />
            {imageCaption && (
              <p
                style={{
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  marginTop: '0.5rem',
                  color: mutedColor,
                }}
              >
                {imageCaption}
              </p>
            )}
          </div>
        )}

        {/* Content - rendered directly for proper float text wrapping */}
        {content && (
          <div
            style={{ color: textColor }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* Gradient fade overlay when truncated */}
        {needsTruncation && !isExpanded && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: hasBackground
                ? `linear-gradient(to bottom, transparent, ${backgroundColor || '#ffffff'})`
                : 'linear-gradient(to bottom, transparent, var(--background, #1a1a1a))',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Show More/Less toggle button */}
      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="toggle-button"
          style={{
            backgroundColor: '#016f53',
            color: '#ffffff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginTop: '0.5rem',
            clear: 'both',
          }}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}

      {/* Clear float before carousel */}
      <div style={{ clear: 'both', marginTop: needsTruncation ? '0' : '0' }} />

      {/* Image Carousel - Styled to match azaleareport.com */}
      {carouselImages.length > 0 && (
        <div
          style={{
            marginTop: '2rem',
            position: 'relative',
          }}
          {...hoverProps}
        >
          {/* Carousel Title */}
          <h4
            style={{
              color: headingColor,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            {photosTitle}
          </h4>

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
      )}
    </section>
  );
}
