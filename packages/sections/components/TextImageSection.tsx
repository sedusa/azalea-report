'use client';

import type { TextImageSectionData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface TextImageSectionProps {
  data: TextImageSectionData;
}

/**
 * TextImageSection - Two-column layout with text and image
 * Image can be positioned left or right based on imagePosition prop
 */
export function TextImageSection({ data }: TextImageSectionProps) {
  const { sectionTitle, content, image, imagePosition = 'right', imageCaption } = data;

  // Don't render if no content
  if (!content && !image) {
    return null;
  }

  const imageElement = image && (
    <div style={{ width: '100%' }}>
      <img
        src={image}
        alt={imageCaption || sectionTitle || 'Section image'}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      />
      {imageCaption && (
        <p
          style={{
            color: '#666666',
            fontSize: '1rem',
            fontStyle: 'italic',
            marginTop: '0.5rem',
            textAlign: 'left',
          }}
        >
          {imageCaption}
        </p>
      )}
    </div>
  );

  const textElement = (
    <div
      style={{
        color: '#333333',
        fontSize: '1.3rem',
        lineHeight: '1.6',
      }}
    >
      <ShowMore content={content} maxHeight={300} />
    </div>
  );

  return (
    <section className="section-card" style={{ marginBottom: '2rem' }}>
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
