'use client';

import type { GenericTextSectionData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface GenericTextSectionProps {
  data: GenericTextSectionData;
  backgroundColor?: string;
}

/**
 * GenericTextSection - Standard text section matching GenericSingleImageTextSection.module.css
 * Used for various content blocks like Events, Things To Do, etc.
 */
export function GenericTextSection({ data, backgroundColor }: GenericTextSectionProps) {
  const { sectionTitle, content } = data;

  // When no backgroundColor is set, use transparent class for proper dark mode text colors
  const hasBackground = !!backgroundColor;

  return (
    <section
      className={hasBackground ? 'basic-content section-with-bg' : 'section-transparent'}
      style={{
        marginBottom: '2rem',
        backgroundColor: backgroundColor || 'transparent',
        borderRadius: hasBackground ? 'var(--radius, 0.75rem)' : undefined,
        padding: hasBackground ? '2rem' : undefined,
      }}
    >
      {sectionTitle && (
        <h2 className="basic-title">
          {sectionTitle}
        </h2>
      )}
      <div className="basic-text">
        <ShowMore content={content} maxHeight={300} />
      </div>
    </section>
  );
}
