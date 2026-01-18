'use client';

import type { GenericTextSectionData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface GenericTextSectionProps {
  data: GenericTextSectionData;
}

/**
 * GenericTextSection - Standard text section matching GenericSingleImageTextSection.module.css
 * Used for various content blocks like Events, Things To Do, etc.
 */
export function GenericTextSection({ data }: GenericTextSectionProps) {
  const { sectionTitle, content } = data;

  return (
    <section className="basic-content" style={{ marginBottom: '2rem' }}>
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
