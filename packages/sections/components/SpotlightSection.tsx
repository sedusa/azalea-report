'use client';

import type { SpotlightSectionData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface SpotlightSectionProps {
  data: SpotlightSectionData;
  backgroundColor?: string;
}

/**
 * SpotlightSection - Two-column layout matching ResidentSpotlight.module.css
 * Image on left, details on right (stacks on mobile)
 */
export function SpotlightSection({ data, backgroundColor }: SpotlightSectionProps) {
  const {
    sectionTitle = 'Resident Spotlight',
    name,
    image,
    birthplace,
    medicalSchool,
    funFact,
    favoriteDish,
    interests,
    postResidencyPlans,
  } = data;

  // Build content for ShowMore
  const detailsContent = [
    birthplace && `<p style="margin-bottom: 0.75rem;"><strong>Birth place:</strong> ${birthplace}</p>`,
    medicalSchool && `<p style="margin-bottom: 0.75rem;"><strong>Medical School:</strong> ${medicalSchool}</p>`,
    funFact && `<p style="margin-bottom: 0.75rem;"><strong>Fun fact:</strong> ${funFact}</p>`,
    favoriteDish && `<p style="margin-bottom: 0.75rem;"><strong>Favorite dish:</strong> ${favoriteDish}</p>`,
    interests && `<p style="margin-bottom: 0.75rem;"><strong>Interests:</strong> ${interests}</p>`,
    postResidencyPlans && `<p style="margin-bottom: 0.75rem;"><strong>Post-residency plans:</strong> ${postResidencyPlans}</p>`,
  ].filter(Boolean).join('');

  // When no backgroundColor is set, use transparent class for proper dark mode text colors
  const hasBackground = !!backgroundColor;

  return (
    <section
      className={hasBackground ? 'spotlight-container section-with-bg' : 'section-transparent'}
      style={{
        marginBottom: '2rem',
        backgroundColor: backgroundColor || 'transparent',
        borderRadius: hasBackground ? 'var(--radius, 0.75rem)' : undefined,
        padding: hasBackground ? '2rem' : undefined,
      }}
    >
      {/* Section Title */}
      {sectionTitle && (
        <h2 className="section-title">
          {sectionTitle}
        </h2>
      )}

      {/* Two-Column Layout: Image Left, Details Right */}
      <div className="spotlight-grid">
        {/* Left Column - Image */}
        {image && (
          <div>
            <img
              src={image}
              alt={name}
              className="spotlight-image"
            />
          </div>
        )}

        {/* Right Column - Details */}
        <div>
          {/* Name */}
          <h3 className="spotlight-name">
            {name}
          </h3>

          {/* Details with ShowMore */}
          <div className="spotlight-text">
            <ShowMore content={detailsContent} maxHeight={200} forceDarkText={hasBackground} />
          </div>
        </div>
      </div>
    </section>
  );
}
