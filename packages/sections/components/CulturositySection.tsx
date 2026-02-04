'use client';

import { useMemo } from 'react';
import type { CulturostySectionData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface CulturostySectionProps {
  data: CulturostySectionData;
  backgroundColor?: string;
}

/**
 * CulturositySection - Cultural spotlight or feature with inline images
 *
 * Supports {{image-0}}, {{image-1}}, etc. placeholders in rich text content
 * to embed uploaded images with optional captions.
 *
 * Follows the same background color rules as other sections:
 * - If backgroundColor is set, uses dark text (#333333) for readability
 * - If no backgroundColor, uses theme-aware text colors
 */
export function CulturositySection({ data, backgroundColor }: CulturostySectionProps) {
  const { sectionTitle, title, content, images = [], author } = data;

  const hasBackground = !!backgroundColor;

  const headingColor = '#016f53';
  const textColor = hasBackground ? '#333333' : 'var(--foreground)';
  const mutedColor = hasBackground ? '#666666' : 'var(--muted-foreground)';

  // Process content to replace {{image-X}} placeholders with actual image elements
  const processedContent = useMemo(() => {
    if (!content) return '';

    let processed = content;

    images.forEach((image, index) => {
      if (image.mediaId) {
        const placeholder = new RegExp(`\\{\\{image-${index}\\}\\}`, 'g');
        const imgHtml = `<figure class="custom-image-figure">
          <img src="${image.mediaId}" alt="${image.caption || `Image ${index + 1}`}" class="custom-inline-image" />
          ${image.caption ? `<figcaption class="custom-image-caption">${image.caption}</figcaption>` : ''}
        </figure>`;
        processed = processed.replace(placeholder, imgHtml);
      }
    });

    return processed;
  }, [content, images]);

  const hasContent = title || content || author || (images && images.length > 0);

  if (!hasContent && !sectionTitle) {
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

      {/* Article Title */}
      {title && (
        <h3
          style={{
            color: headingColor,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.4rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </h3>
      )}

      {/* Author */}
      {author && (
        <p
          style={{
            color: mutedColor,
            fontFamily: "'Georgia', serif",
            fontSize: '1rem',
            fontStyle: 'italic',
            marginBottom: '1.5rem',
          }}
        >
          By {author}
        </p>
      )}

      {/* Rich Text Content with image placeholders resolved */}
      {processedContent && (
        <div className="basic-text custom-html-content">
          <ShowMore
            content={processedContent}
            maxHeight={600}
            forceDarkText={hasBackground}
          />
        </div>
      )}

      {/* Display images as gallery if content has no placeholders but images exist */}
      {content && !content.includes('{{image-') && images.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          {images.filter(img => img.mediaId).map((image, index) => (
            <figure
              key={index}
              className="custom-image-figure"
              style={{ marginBottom: '1.5rem' }}
            >
              <img
                src={image.mediaId}
                alt={image.caption || `Image ${index + 1}`}
                className="custom-inline-image"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
              {image.caption && (
                <figcaption
                  className="custom-image-caption"
                  style={{
                    color: mutedColor,
                    fontFamily: "'Georgia', serif",
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    marginTop: '0.5rem',
                    textAlign: 'center',
                  }}
                >
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
