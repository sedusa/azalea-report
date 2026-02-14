'use client';

import type { InternsCornerSectionData, InternData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface InternsCornerSectionProps {
  data: InternsCornerSectionData;
  backgroundColor?: string;
}

/**
 * InternsCornerSection - Two-column flex layout matching InternsCorner.module.css
 * Displays multiple interns side-by-side (2 columns on desktop)
 * Each intern has their circular image and bio
 */
export function InternsCornerSection({ data, backgroundColor }: InternsCornerSectionProps) {
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

  // Interns section ALWAYS has a pastel background via CSS (.interns-section)
  // So we never use section-transparent - text must always be dark
  return (
    <section
      style={{
        padding: 0,
        marginBottom: '2rem',
        backgroundColor: backgroundColor || 'transparent',
      }}
    >
      {/* Section Title - always green regardless of theme */}
      {sectionTitle && (
        <h2 className="section-title" style={{ padding: '1rem 1.25rem 0', color: '#016f53' }}>
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
 * Layout: Left-aligned circular image, left-aligned name and content below
 */
function InternCard({ intern }: { intern: InternData }) {
  const { name, image, content } = intern;

  return (
    <div className="intern-column">
      {/* Circular Image - Left aligned */}
      {image && (
        <img
          src={image}
          alt={name}
          className="intern-image"
        />
      )}

      {/* Name - Left aligned, always green */}
      {name && (
        <h3 className="intern-name" style={{ color: '#016f53', textAlign: 'left' }}>
          {name}
        </h3>
      )}

      {/* Bio Content with ShowMore - Left aligned, force dark text on pastel background */}
      {content && (
        <div className="intern-text" style={{ textAlign: 'left' }}>
          <ShowMore content={content} maxHeight={600} forceDarkText={true} />
        </div>
      )}
    </div>
  );
}
