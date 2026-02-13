'use client';

import type { ThingsToDoSectionData } from '@azalea/shared/types';
import { useAutoPlayCarousel } from './useAutoPlayCarousel';

interface ThingsToDoSectionProps {
  data: ThingsToDoSectionData;
  backgroundColor?: string;
}

/**
 * ThingsToDoSection - Displays places to visit in Valdosta
 * Layout:
 * - Section header "THINGS TO DO IN VALDOSTA"
 * - Full-width rotating image carousel (16:9 aspect, auto-rotate, swipe/arrows, dots)
 * - 2-column grid of place cards (image, name, description, Learn More link)
 * - Last card spans full width if odd count
 *
 * Follows the same background color rules as other sections.
 */
export function ThingsToDoSection({ data, backgroundColor }: ThingsToDoSectionProps) {
  const {
    sectionTitle = 'Things To Do In Valdosta',
    carousel,
    places = [],
  } = data;

  const hasBackground = !!backgroundColor;
  const textColor = hasBackground ? '#333333' : 'var(--foreground)';
  const headingColor = '#016f53';
  const mutedColor = hasBackground ? '#666666' : 'var(--muted-foreground)';

  // Filter carousel slides with valid images
  const carouselSlides = carousel?.slides?.filter(s => s.mediaId) || [];
  const carouselEnabled = carousel?.enabled !== false && carouselSlides.length > 0;

  const {
    currentIndex,
    isTransitioning,
    goToPrevious,
    goToNext,
    goToSlide,
    hoverProps,
  } = useAutoPlayCarousel({
    totalSlides: carouselSlides.length,
    interval: carousel?.intervalMs || 5000,
  });

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
      {/* Section Header */}
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

      {/* Full-Width Carousel */}
      {carouselEnabled && (
        <div
          style={{
            marginBottom: '2rem',
            position: 'relative',
          }}
          {...hoverProps}
        >
          {/* Image Container - 16:9 aspect ratio */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
              backgroundColor: hasBackground ? '#f0f0f0' : 'var(--card)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%', // 16:9 aspect ratio
              }}
            >
              {carouselSlides.map((slide, index) => (
                <div
                  key={`slide-${index}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: index === currentIndex ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out',
                  }}
                >
                  <img
                    src={slide.mediaId}
                    alt={slide.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {/* Title overlay on slide */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '1.5rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    }}
                  >
                    <p
                      style={{
                        color: '#ffffff',
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        margin: 0,
                      }}
                    >
                      {slide.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons + Dots */}
          {carouselSlides.length > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
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
                aria-label="Previous slide"
              >
                &#8249;
              </button>

              {carouselSlides.length <= 20 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      disabled={isTransitioning}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: index === currentIndex ? '#016f53' : '#cccccc',
                        cursor: isTransitioning ? 'default' : 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: isTransitioning ? 0.7 : 1,
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}

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
                aria-label="Next slide"
              >
                &#8250;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Places Grid - 2 columns */}
      {places.length > 0 && (
        <div
          className="things-to-do-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
          }}
        >
          {places.map((place, index) => {
            const isLast = index === places.length - 1;
            const isOddLastItem = isLast && places.length % 2 === 1;

            return (
              <div
                key={`place-${index}`}
                style={{
                  gridColumn: isOddLastItem ? '1 / -1' : undefined,
                  maxWidth: isOddLastItem ? '50%' : undefined,
                  justifySelf: isOddLastItem ? 'center' : undefined,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: hasBackground ? '#ffffff' : 'var(--card)',
                  border: hasBackground ? '1px solid #e0e0e0' : '1px solid var(--border, rgba(255,255,255,0.1))',
                }}
              >
                {/* Place Image */}
                {place.mediaId ? (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '56.25%', // 16:9
                      backgroundColor: hasBackground ? '#f0f0f0' : 'var(--card)',
                    }}
                  >
                    <img
                      src={place.mediaId}
                      alt={place.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      paddingBottom: '56.25%',
                      position: 'relative',
                      backgroundColor: hasBackground ? '#e8e8e8' : 'var(--card)',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: mutedColor,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '0.85rem',
                      }}
                    >
                      {place.type || 'No image'}
                    </div>
                  </div>
                )}

                {/* Place Details */}
                <div style={{ padding: '1rem' }}>
                  <h4
                    style={{
                      color: headingColor,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '1.05rem',
                      fontWeight: 'bold',
                      margin: '0 0 0.25rem 0',
                    }}
                  >
                    {place.name}
                  </h4>

                  {place.type && (
                    <p
                      style={{
                        color: mutedColor,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '0.8rem',
                        margin: '0 0 0.5rem 0',
                        fontStyle: 'italic',
                      }}
                    >
                      {place.type} &middot; {place.location}
                    </p>
                  )}

                  <p
                    style={{
                      color: textColor,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      margin: '0 0 0.75rem 0',
                    }}
                  >
                    {place.description}
                  </p>

                  {place.link && (
                    <a
                      href={place.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: headingColor,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                      }}
                    >
                      Learn More &rarr;
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .things-to-do-grid {
            grid-template-columns: 1fr !important;
          }
          .things-to-do-grid > div {
            grid-column: auto !important;
            max-width: none !important;
            justify-self: stretch !important;
          }
        }
      `}</style>
    </section>
  );
}
