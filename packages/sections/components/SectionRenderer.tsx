import type { Section } from '@azalea/shared/types';
import { SpotlightSection } from './SpotlightSection';
import { ChiefsCornerSection } from './ChiefsCornerSection';
import { InternsCornerSection } from './InternsCornerSection';
import { GenericTextSection } from './GenericTextSection';
import { AboutSection } from './AboutSection';

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
  switch (section.type) {
    case 'about':
      return <AboutSection data={section.data} />;

    case 'spotlight':
      return <SpotlightSection data={section.data} />;

    case 'chiefsCorner':
      return <ChiefsCornerSection data={section.data} />;

    case 'internsCorner':
      return <InternsCornerSection data={section.data} />;

    case 'genericText':
      return <GenericTextSection data={section.data} />;

    // TODO: Add remaining section types as they're migrated
    case 'textImage':
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
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-sm text-yellow-800">
            Section type "<strong>{section.type}</strong>" not yet implemented
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Will be added in Phase 5 migration
          </p>
        </div>
      );

    default:
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-sm text-red-800">
            Unknown section type: <strong>{section.type}</strong>
          </p>
        </div>
      );
  }
}
