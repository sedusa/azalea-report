'use client';

import type { TwoColumnSectionData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface TwoColumnSectionProps {
  data: TwoColumnSectionData;
  backgroundColor?: string;
}

/**
 * TwoColumnSection - Side-by-side Spotlight and About layout
 * Uses TwoColumnLayout.module.css and ResidentSpotlight.module.css styling
 * Left: Portrait image with name and details (in its own card)
 * Right: Feature image with content and bullet points (in its own card)
 */
export function TwoColumnSection({ data, backgroundColor }: TwoColumnSectionProps) {
  const {
    leftTitle = 'Resident Spotlight',
    leftName,
    leftImage,
    leftDetails = [],
    leftBackgroundColor,
    rightTitle = 'About the Program',
    rightImage,
    rightImageCaption,
    rightContent,
    rightSubtitle,
    rightBullets = [],
    rightBackgroundColor,
  } = data;

  // Build details HTML for ShowMore
  const detailsContent = leftDetails
    .map((detail) => `<p class="spotlight-detail"><strong class="spotlight-label">${detail.label}:</strong> ${detail.value}</p>`)
    .join('');

  // Determine if columns have backgrounds - use transparent class for proper dark mode text colors
  const hasLeftBackground = !!leftBackgroundColor;
  const hasRightBackground = !!rightBackgroundColor;

  return (
    <section className="twoColumns">
      {/* Left Column - Spotlight Style with its own card */}
      <div className={`column ${hasLeftBackground ? 'section-with-bg' : 'section-transparent'}`}>
        {leftTitle && (
          <h2 className="sectionTitle">{leftTitle}</h2>
        )}

        <div
          className={hasLeftBackground ? 'spotlightContainer' : ''}
          style={{
            backgroundColor: leftBackgroundColor || 'transparent',
            borderRadius: hasLeftBackground ? '8px' : undefined,
            padding: hasLeftBackground ? '1.5rem' : undefined,
          }}
        >
          {leftImage && (
            <img
              src={leftImage}
              alt={leftName}
              className="spotlightImage"
            />
          )}

          <h3 className="spotlightName">{leftName}</h3>

          {leftDetails.length > 0 && (
            <div className="spotlightText">
              <ShowMore content={detailsContent} maxHeight={600} forceDarkText={hasLeftBackground} />
            </div>
          )}
        </div>
      </div>

      {/* Right Column - About Style with its own card */}
      <div className={`column ${hasRightBackground ? 'section-with-bg' : 'section-transparent'}`}>
        {rightTitle && (
          <h2 className="sectionTitle">{rightTitle}</h2>
        )}

        <div
          className={hasRightBackground ? 'spotlightContainer' : ''}
          style={{
            backgroundColor: rightBackgroundColor || 'transparent',
            borderRadius: hasRightBackground ? '8px' : undefined,
            padding: hasRightBackground ? '1.5rem' : undefined,
          }}
        >
          {rightImage && (
            <div className="featureImageContainer">
              <img
                src={rightImage}
                alt={rightImageCaption || rightTitle || 'Feature image'}
                className="featureImage"
              />
              {rightImageCaption && (
                <p className="featureCaption">{rightImageCaption}</p>
              )}
            </div>
          )}

          {rightContent && (
            <div
              className="spotlightText"
              dangerouslySetInnerHTML={{ __html: rightContent }}
            />
          )}

          {rightSubtitle && (
            <h4 className="featureSubtitle">{rightSubtitle}</h4>
          )}

          {rightBullets.length > 0 && (
            <ul className="featureBullets">
              {rightBullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
