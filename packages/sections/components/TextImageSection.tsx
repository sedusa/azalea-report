'use client';

import { useState, useEffect, useRef } from 'react';
import type { TextImageSectionData } from '@azalea/shared/types';

interface TextImageSectionProps {
  data: TextImageSectionData;
  backgroundColor?: string;
}

/**
 * TextImageSection - Text with image using CSS float for text wrapping
 * Image can be positioned left or right based on imagePosition prop
 *
 * Note: This component renders content directly (not with ShowMore) to allow
 * proper CSS float text wrapping around the image. ShowMore's overflow:hidden
 * creates a new block formatting context that prevents text wrapping.
 */
export function TextImageSection({ data, backgroundColor }: TextImageSectionProps) {
  const { sectionTitle, content, image, imagePosition = 'right', imageCaption } = data;
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const maxHeight = 400; // Max height before showing "Show More"

  // Don't render if no content
  if (!content && !image) {
    return null;
  }

  // When no backgroundColor is set, use transparent class for proper dark mode text colors
  const hasBackground = !!backgroundColor;

  // Text colors based on background
  const textColor = hasBackground ? '#333333' : 'var(--foreground)';
  const headingColor = '#016f53';

  // Float class based on imagePosition
  const floatClass = imagePosition === 'left' ? 'float-left' : 'float-right';

  // Check if content needs truncation (only when collapsed)
  useEffect(() => {
    if (contentRef.current && !isExpanded) {
      setNeedsTruncation(contentRef.current.scrollHeight > maxHeight);
    }
  }, [content, isExpanded]);

  return (
    <section
      className={hasBackground ? 'section-card section-with-bg' : 'section-transparent'}
      style={{
        marginBottom: '2rem',
        backgroundColor: backgroundColor || 'transparent',
        borderRadius: hasBackground ? '8px' : undefined,
        padding: hasBackground ? '2rem' : undefined,
      }}
    >
      {sectionTitle && (
        <h2
          className="section-title"
          style={{
            color: headingColor,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            marginTop: 0,
          }}
        >
          {sectionTitle}
        </h2>
      )}

      {/* Content with image floated (text wraps around) */}
      <div
        ref={contentRef}
        className="basic-text text-image-content"
        style={{
          color: textColor,
          position: 'relative',
          maxHeight: isExpanded ? 'none' : (needsTruncation ? `${maxHeight}px` : 'none'),
          overflow: isExpanded ? 'visible' : (needsTruncation ? 'hidden' : 'visible'),
        }}
      >
        {/* Floated Image - uses CSS class for responsive behavior */}
        {image && (
          <div className={`text-image-float ${floatClass}`}>
            <img
              src={image}
              alt={imageCaption || sectionTitle || 'Section image'}
            />
            {imageCaption && (
              <p
                style={{
                  fontSize: '0.95rem',
                  fontStyle: 'normal',
                  marginTop: '0.5rem',
                  color: textColor,
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

      {/* Clear float */}
      <div style={{ clear: 'both' }} />
    </section>
  );
}
