'use client';

import { useMemo } from 'react';
import type { CustomSectionData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface CustomSectionProps {
  data: CustomSectionData;
  backgroundColor?: string;
}

/**
 * CustomSection - Displays custom HTML articles with title, description, author, and images
 *
 * Features:
 * - Section title (optional)
 * - Article title
 * - Rich text description/intro
 * - Author attribution
 * - Custom HTML content with image placeholder support
 * - Images can be referenced in HTML using {{image-0}}, {{image-1}}, etc.
 *
 * Follows the same background color rules as other sections:
 * - If backgroundColor is set, uses dark text (#333333) for readability
 * - If no backgroundColor, uses theme-aware text colors (light/dark mode)
 */
export function CustomSection({ data, backgroundColor }: CustomSectionProps) {
  const { sectionTitle, title, description, author, html, images = [] } = data;

  // When backgroundColor is set, use dark text for readability on pastel backgrounds
  const hasBackground = !!backgroundColor;

  // Text colors based on background
  const headingColor = '#016f53';
  const titleColor = hasBackground ? '#333333' : 'var(--foreground)';
  const textColor = hasBackground ? '#333333' : 'var(--foreground)';
  const mutedColor = hasBackground ? '#666666' : 'var(--muted-foreground)';

  // Process HTML content to replace image placeholders with actual URLs
  const processedHtml = useMemo(() => {
    if (!html) return '';

    let processed = html;

    // Replace {{image-X}} placeholders with actual image URLs
    images.forEach((image, index) => {
      if (image.mediaId) {
        const placeholder = new RegExp(`\\{\\{image-${index}\\}\\}`, 'g');
        // Create an img tag with the image URL and optional caption
        const imgHtml = `<figure class="custom-image-figure">
          <img src="${image.mediaId}" alt="${image.caption || `Image ${index + 1}`}" class="custom-inline-image" />
          ${image.caption ? `<figcaption class="custom-image-caption">${image.caption}</figcaption>` : ''}
        </figure>`;
        processed = processed.replace(placeholder, imgHtml);
      }
    });

    return processed;
  }, [html, images]);

  // Check if there's any content to display
  const hasContent = title || description || author || html || (images && images.length > 0);

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
          className="custom-article-title"
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
          className="custom-article-author"
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

      {/* Description/Intro (Rich Text) */}
      {description && (
        <div
          className="basic-text custom-description"
          style={{
            color: textColor,
            fontFamily: "'Georgia', serif",
            fontSize: '1.2rem',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {/* Custom HTML Content with Show More */}
      {processedHtml && (
        <div className="basic-text custom-html-content">
          <ShowMore
            content={processedHtml}
            maxHeight={300}
            forceDarkText={hasBackground}
          />
        </div>
      )}

      {/* Display images as gallery if no HTML content but images exist */}
      {!html && images && images.length > 0 && (
        <div className="custom-image-gallery" style={{ marginTop: '1.5rem' }}>
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
