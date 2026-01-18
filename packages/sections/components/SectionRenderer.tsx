import type {
  Section,
  AboutSectionData,
  SpotlightSectionData,
  ChiefsCornerSectionData,
  InternsCornerSectionData,
  GenericTextSectionData,
  TwoColumnSectionData,
  TextImageSectionData,
} from '@azalea/shared/types';
import { SpotlightSection } from './SpotlightSection';
import { ChiefsCornerSection } from './ChiefsCornerSection';
import { InternsCornerSection } from './InternsCornerSection';
import { GenericTextSection } from './GenericTextSection';
import { AboutSection } from './AboutSection';
import { TwoColumnSection } from './TwoColumnSection';
import { TextImageSection } from './TextImageSection';

interface SectionRendererProps {
  section: Section;
}

/**
 * SectionRenderer maps section types to their corresponding React components
 * Used by both admin preview and public website to ensure WYSIWYG
 */
export function SectionRenderer({ section }: SectionRendererProps) {
  // Don't render hidden sections
  if (!section.visible) {
    return null;
  }

  // Map section type to component
  // Type assertion through unknown is required because section.data is Record<string, unknown>
  switch (section.type) {
    case 'about':
      return <AboutSection data={section.data as unknown as AboutSectionData} />;

    case 'spotlight':
      return <SpotlightSection data={section.data as unknown as SpotlightSectionData} />;

    case 'chiefsCorner':
      return <ChiefsCornerSection data={section.data as unknown as ChiefsCornerSectionData} />;

    case 'internsCorner':
      return <InternsCornerSection data={section.data as unknown as InternsCornerSectionData} />;

    case 'genericText':
      return <GenericTextSection data={section.data as unknown as GenericTextSectionData} />;

    case 'twoColumn':
      return <TwoColumnSection data={section.data as unknown as TwoColumnSectionData} />;

    case 'textImage':
      return <TextImageSection data={section.data as unknown as TextImageSectionData} />;

    // TODO: Add remaining section types as they're migrated
    case 'carousel':
    case 'textCarousel':
    case 'events':
    case 'podcast':
    case 'birthdays':
    case 'culturosity':
    case 'communityService':
    case 'recentSuccess':
    case 'musings':
    case 'photosOfMonth':
    case 'custom':
      return (
        <div
          className="section-card"
          style={{
            backgroundColor: 'var(--card-bg, #f7f3e8)',
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
}
