'use client';

import type { TextImageSectionData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface TextImageSectionProps {
  data: TextImageSectionData;
  backgroundColor?: string;
}

/**
 * TextImageSection - Two-column layout with text and image
 * Image can be positioned left or right based on imagePosition prop
 */
export function TextImageSection({ data, backgroundColor }: TextImageSectionProps) {
  const { sectionTitle, content, image, imagePosition = 'right', imageCaption } = data;

  // Don't render if no content
  if (!content && !image) {
    return null;
  }

  // When no backgroundColor is set, use transparent class for proper dark mode text colors
  const hasBackground = !!backgroundColor;

  const imageElement = image && (
    <div style={{ width: '100%' }}>
      <img
        src={image}
        alt={imageCaption || sectionTitle || 'Section image'}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
        }}
      />
      {imageCaption && (
        <p className="featureCaption">
          {imageCaption}
        </p>
      )}
    </div>
  );

  const textElement = (
    <div className="basic-text">
      <ShowMore content={content} maxHeight={300} forceDarkText={hasBackground} />
    </div>
  );

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
        <h2 className="section-title" style={{ marginTop: 0 }}>
          {sectionTitle}
        </h2>
      )}

      <div className="text-image-grid">
        {imagePosition === 'left' ? (
          <>
            {imageElement}
            {textElement}
          </>
        ) : (
          <>
            {textElement}
            {imageElement}
          </>
        )}
      </div>
    </section>
  );
}
