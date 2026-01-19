import type {
  Section,
  AboutSectionData,
  SpotlightSectionData,
  ChiefsCornerSectionData,
  InternsCornerSectionData,
  GenericTextSectionData,
  TwoColumnSectionData,
  TextImageSectionData,
  BirthdaysSectionData,
  RecentSuccessSectionData,
  CommunityServiceSectionData,
  PodcastSectionData,
} from '@azalea/shared/types';
import { SpotlightSection } from './SpotlightSection';
import { ChiefsCornerSection } from './ChiefsCornerSection';
import { InternsCornerSection } from './InternsCornerSection';
import { GenericTextSection } from './GenericTextSection';
import { AboutSection } from './AboutSection';
import { TwoColumnSection } from './TwoColumnSection';
import { TextImageSection } from './TextImageSection';
import { BirthdaysSection } from './BirthdaysSection';
import { RecentSuccessSection } from './RecentSuccessSection';
import { CommunityServiceSection } from './CommunityServiceSection';
import { PodcastSection } from './PodcastSection';

interface SectionRendererProps {
  section: Section;
}

/**
 * SectionRenderer maps section types to their corresponding React components
 * Used by both admin preview and public website to ensure WYSIWYG
 * Applies backgroundColor from section if set
 */
export function SectionRenderer({ section }: SectionRendererProps) {
  // Don't render hidden sections
  if (!section.visible) {
    return null;
  }

  // Get the section content based on type
  const renderSectionContent = () => {
    switch (section.type) {
      case 'about':
        return <AboutSection data={section.data as unknown as AboutSectionData} backgroundColor={section.backgroundColor} />;

      case 'spotlight':
        return <SpotlightSection data={section.data as unknown as SpotlightSectionData} backgroundColor={section.backgroundColor} />;

      case 'chiefsCorner':
        return <ChiefsCornerSection data={section.data as unknown as ChiefsCornerSectionData} backgroundColor={section.backgroundColor} />;

      case 'internsCorner':
        return <InternsCornerSection data={section.data as unknown as InternsCornerSectionData} backgroundColor={section.backgroundColor} />;

      case 'genericText':
        return <GenericTextSection data={section.data as unknown as GenericTextSectionData} backgroundColor={section.backgroundColor} />;

      case 'twoColumn':
        return <TwoColumnSection data={section.data as unknown as TwoColumnSectionData} backgroundColor={section.backgroundColor} />;

      case 'textImage':
        return <TextImageSection data={section.data as unknown as TextImageSectionData} backgroundColor={section.backgroundColor} />;

      case 'birthdays':
        return <BirthdaysSection data={section.data as unknown as BirthdaysSectionData} backgroundColor={section.backgroundColor} />;

      case 'recentSuccess':
        return <RecentSuccessSection data={section.data as unknown as RecentSuccessSectionData} backgroundColor={section.backgroundColor} />;

      case 'communityService':
        return <CommunityServiceSection data={section.data as unknown as CommunityServiceSectionData} backgroundColor={section.backgroundColor} />;

      case 'podcast':
        return <PodcastSection data={section.data as unknown as PodcastSectionData} backgroundColor={section.backgroundColor} />;

      // TODO: Add remaining section types as they're migrated
      case 'carousel':
      case 'textCarousel':
      case 'events':
      case 'culturosity':
      case 'musings':
      case 'photosOfMonth':
      case 'custom':
        return (
          <div
            className="section-card"
            style={{
              backgroundColor: section.backgroundColor || 'var(--card-bg, #f7f3e8)',
              borderRadius: 'var(--radius, 0.75rem)',
              padding: '2rem',
              marginBottom: '2rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1rem',
                color: 'var(--card-text, #333333)',
              }}
            >
              Section type "<strong style={{ color: 'var(--card-heading, #016f53)' }}>{section.type}</strong>" not yet implemented
            </p>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '0.875rem',
                color: 'var(--card-text, #333333)',
                opacity: 0.7,
                marginTop: '0.5rem',
              }}
            >
              Will be added in Phase 5 migration
            </p>
          </div>
        );

      default:
        return (
          <div
            style={{
              backgroundColor: '#fff0f0',
              border: '1px solid #ffcccc',
              borderRadius: 'var(--radius, 0.75rem)',
              padding: '2rem',
              marginBottom: '2rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1rem',
                color: 'var(--accent, #cc0000)',
              }}
            >
              Unknown section type: <strong>{section.type}</strong>
            </p>
          </div>
        );
    }
  };

  return renderSectionContent();
}
