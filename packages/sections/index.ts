// @azalea/sections - Shared section renderer components
// These components are used by both the public website and admin preview

// Section components will be migrated from existing components/
// Export them here as they are converted to Tailwind

// export { AboutSection } from './AboutSection';
// export { SpotlightSection } from './SpotlightSection';
// export { CarouselSection } from './CarouselSection';
// export { ChiefsCornerSection } from './ChiefsCornerSection';
// export { InternsCornerSection } from './InternsCornerSection';
// export { TextImageSection } from './TextImageSection';
// export { EventsSection } from './EventsSection';
// export { PodcastSection } from './PodcastSection';
// export { BirthdaysSection } from './BirthdaysSection';
// export { CulturositySection } from './CulturositySection';
// export { CommunityServiceSection } from './CommunityServiceSection';
// export { RecentSuccessSection } from './RecentSuccessSection';
// export { PhotosOfMonthSection } from './PhotosOfMonthSection';
// export { TextCarouselSection } from './TextCarouselSection';
// export { GenericTextSection } from './GenericTextSection';
// export { CustomSection } from './CustomSection';

// Main section renderer
// export { SectionRenderer } from './SectionRenderer';

// Export section components (migrated to TypeScript + Tailwind)
export { SectionRenderer } from './components/SectionRenderer';
export { SpotlightSection } from './components/SpotlightSection';
export { AboutSection } from './components/AboutSection';
export { ChiefsCornerSection } from './components/ChiefsCornerSection';
export { InternsCornerSection } from './components/InternsCornerSection';
export { GenericTextSection } from './components/GenericTextSection';
export { TwoColumnSection } from './components/TwoColumnSection';
export { TextImageSection } from './components/TextImageSection';
export { BirthdaysSection } from './components/BirthdaysSection';
export { RecentSuccessSection } from './components/RecentSuccessSection';
export { CommunityServiceSection } from './components/CommunityServiceSection';
export { PodcastSection } from './components/PodcastSection';
export { CustomSection } from './components/CustomSection';
export { PhotosOfMonthSection } from './components/PhotosOfMonthSection';
export { EventsSection } from './components/EventsSection';

// Export utility components
export { ShowMore } from './components/ShowMore';

// Ready status
export const SECTIONS_READY = true;
