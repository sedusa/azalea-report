'use client';

import type { ChiefsCornerSectionData, ChiefData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface ChiefsCornerSectionProps {
  data: ChiefsCornerSectionData;
  backgroundColor?: string;
}

/**
 * ChiefsCornerSection - Two-column flex layout matching ChiefsCorner.module.css
 * Displays multiple chiefs side-by-side (2 columns on desktop)
 * Each chief has their circular image and bio
 */
export function ChiefsCornerSection({ data, backgroundColor }: ChiefsCornerSectionProps) {
  const { sectionTitle = "The Chiefs' Corner" } = data;

  // Handle both new array format and legacy single chief format
  let chiefs: ChiefData[] = [];
  if (data.chiefs && Array.isArray(data.chiefs)) {
    chiefs = data.chiefs;
  } else if ((data as any).name) {
    // Legacy format: single chief with name, image, content at top level
    chiefs = [{
      name: (data as any).name,
      image: (data as any).image,
      content: (data as any).content,
    }];
  }

  // Don't render if no chiefs
  if (chiefs.length === 0) {
    return null;
  }

  // Chiefs section ALWAYS has a pastel background via CSS (.chiefs-section)
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

      {/* Chiefs Grid - matches ChiefsCorner.module.css */}
      <div className="chiefs-section">
        {chiefs.map((chief, index) => (
          <ChiefCard key={index} chief={chief} />
        ))}
      </div>
    </section>
  );
}

/**
 * Individual chief card component - matches ChiefsCorner.module.css
 */
function ChiefCard({ chief }: { chief: ChiefData }) {
  const { name, image, content } = chief;

  return (
    <div className="chief-column">
      {/* Circular Image */}
      {image && (
        <img
          src={image}
          alt={name}
          className="chief-image"
        />
      )}

      {/* Name - always green */}
      {name && (
        <h3 className="chief-name" style={{ color: '#016f53' }}>
          {name}
        </h3>
      )}

      {/* Bio Content with ShowMore - force dark text on pastel background */}
      {content && (
        <div className="chief-text">
          <ShowMore content={content} maxHeight={600} forceDarkText={true} />
        </div>
      )}
    </div>
  );
}
