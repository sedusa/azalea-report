'use client';

import type { InternsCornerSectionData, InternData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface InternsCornerSectionProps {
  data: InternsCornerSectionData;
}

/**
 * InternsCornerSection - Two-column flex layout matching InternsCorner.module.css
 * Displays multiple interns side-by-side (2 columns on desktop)
 * Each intern has their circular image and bio
 */
export function InternsCornerSection({ data }: InternsCornerSectionProps) {
  const { sectionTitle = "Interns' Corner" } = data;

  // Handle both new array format and legacy single intern format
  let interns: InternData[] = [];
  if (data.interns && Array.isArray(data.interns)) {
    interns = data.interns;
  } else if ((data as any).name) {
    // Legacy format: single intern with name, image, content at top level
    interns = [{
      name: (data as any).name,
      image: (data as any).image,
      content: (data as any).content,
    }];
  }

  // Don't render if no interns
  if (interns.length === 0) {
    return null;
  }

  return (
    <section className="section-card section-card-interns" style={{ padding: 0, marginBottom: '2rem' }}>
      {/* Section Title */}
      {sectionTitle && (
        <h2 className="section-title" style={{ padding: '2rem 2rem 0 2rem' }}>
          {sectionTitle}
        </h2>
      )}

      {/* Interns Grid - matches InternsCorner.module.css */}
      <div className="interns-section">
        {interns.map((intern, index) => (
          <InternCard key={index} intern={intern} />
        ))}
      </div>
    </section>
  );
}

/**
 * Individual intern card component - matches InternsCorner.module.css
 */
function InternCard({ intern }: { intern: InternData }) {
  const { name, image, content } = intern;

  return (
    <div className="intern-column">
      {/* Circular Image */}
      {image && (
        <img
          src={image}
          alt={name}
          className="intern-image"
        />
      )}

      {/* Name */}
      {name && (
        <h3 className="intern-name">
          {name}
        </h3>
      )}

      {/* Bio Content with ShowMore */}
      {content && (
        <div className="intern-text">
          <ShowMore content={content} maxHeight={150} />
        </div>
      )}
    </div>
  );
}
