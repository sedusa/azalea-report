'use client';

import type { TwoColumnSectionData } from '@azalea/shared/types';
import { ShowMore } from './ShowMore';

interface TwoColumnSectionProps {
  data: TwoColumnSectionData;
}

/**
 * TwoColumnSection - Side-by-side Spotlight and About layout
 * Uses TwoColumnLayout.module.css and ResidentSpotlight.module.css styling
 * Left: Portrait image with name and details (in its own card)
 * Right: Feature image with content and bullet points (in its own card)
 */
export function TwoColumnSection({ data }: TwoColumnSectionProps) {
  const {
    leftTitle = 'Resident Spotlight',
    leftName,
    leftImage,
    leftDetails = [],
    rightTitle = 'About the Program',
    rightImage,
    rightImageCaption,
    rightContent,
    rightSubtitle,
    rightBullets = [],
  } = data;

  // Build details HTML for ShowMore
  const detailsContent = leftDetails
    .map((detail) => `<p class="spotlight-detail"><strong class="spotlight-label">${detail.label}:</strong> ${detail.value}</p>`)
    .join('');

  return (
    <section className="twoColumns">
      {/* Left Column - Spotlight Style with its own card */}
      <div className="column">
        {leftTitle && (
          <h2 className="sectionTitle">{leftTitle}</h2>
        )}

        <div className="spotlightContainer">
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
              <ShowMore content={detailsContent} maxHeight={400} />
            </div>
          )}
        </div>
      </div>

      {/* Right Column - About Style with its own card */}
      <div className="column">
        {rightTitle && (
          <h2 className="sectionTitle">{rightTitle}</h2>
        )}

        <div className="spotlightContainer">
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
