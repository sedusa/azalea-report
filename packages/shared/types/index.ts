// Section Types
export type SectionType =
  | 'about'
  | 'spotlight'
  | 'chiefsCorner'
  | 'internsCorner'
  | 'textImage'
  | 'carousel'
  | 'textCarousel'
  | 'events'
  | 'podcast'
  | 'birthdays'
  | 'culturosity'
  | 'communityService'
  | 'recentSuccess'
  | 'musings'
  | 'photosOfMonth'
  | 'genericText'
  | 'twoColumn'
  | 'custom';

// Issue Types
export interface Issue {
  _id: string;
  title: string;
  slug: string;
  edition: number;
  status: 'draft' | 'published' | 'archived';
  bannerImage?: string;
  bannerTitle: string;
  bannerDate: string;
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
  version: number;
}

// Section Base Type
export interface Section {
  _id: string;
  issueId: string;
  type: SectionType;
  order: number;
  visible: boolean;
  backgroundColor?: string; // Pastel background color for the section
  data: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

// Media Types
export interface Media {
  _id: string;
  storageId: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  uploadedBy: string;
  uploadedAt: number;
  url?: string;
}

// User Types
export type UserRole = 'viewer' | 'editor' | 'admin';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: number;
  lastLoginAt?: number;
}

// Lock Types
export interface Lock {
  _id: string;
  issueId: string;
  userId: string;
  acquiredAt: number;
  lastHeartbeat: number;
}

// Audit Log Types
export type AuditAction =
  | 'issue.create'
  | 'issue.update'
  | 'issue.publish'
  | 'issue.unpublish'
  | 'issue.archive'
  | 'section.create'
  | 'section.update'
  | 'section.delete'
  | 'section.reorder'
  | 'media.upload'
  | 'media.delete'
  | 'user.create'
  | 'user.update';

export interface AuditLogEntry {
  _id: string;
  userId: string;
  action: AuditAction;
  resourceType: 'issue' | 'section' | 'media' | 'user';
  resourceId: string;
  details: Record<string, unknown>;
  timestamp: number;
}

// Birthday Types
export interface Birthday {
  _id: string;
  name: string;
  month: number; // 1-12
  day: number;
  role?: string;
}

// Section Data Types
export interface AboutSectionData {
  sectionTitle?: string;
  content: string;
  signature?: string;
}

export interface SpotlightSectionData {
  sectionTitle?: string;
  name: string;
  image?: string;
  birthplace?: string;
  medicalSchool?: string;
  funFact?: string;
  favoriteDish?: string;
  interests?: string;
  postResidencyPlans?: string;
}

export interface CarouselSectionData {
  sectionTitle?: string;
  title: string;
  description?: string;
  images: Array<{
    mediaId: string;
    caption?: string;
  }>;
}

export interface TextImageSectionData {
  sectionTitle?: string;
  content: string;
  image?: string;
  imagePosition: 'left' | 'right';
  imageCaption?: string;
}

export interface EventsSectionData {
  sectionTitle?: string;
  events: Array<{
    title: string;
    date: string;
    description?: string;
    image?: string;
  }>;
}

export interface PodcastSectionData {
  sectionTitle?: string;
  title: string;
  description?: string;
  embedUrl: string;
}

export interface BirthdaysSectionData {
  sectionTitle?: string;
  // Birthdays are auto-populated based on current month from Convex
  birthdays?: Array<{
    _id: string;
    name: string;
    day: number;
    month: number;
  }>;
}

export interface CulturostySectionData {
  sectionTitle?: string;
  title: string;
  content: string;
  image?: string;
  author?: string;
}

export interface GenericTextSectionData {
  sectionTitle?: string;
  content: string;
}

export interface ChiefData {
  name: string;
  image?: string;
  content: string;
}

export interface ChiefsCornerSectionData {
  sectionTitle?: string;
  chiefs: ChiefData[];
}

export interface InternData {
  name: string;
  image?: string;
  content: string;
}

export interface InternsCornerSectionData {
  sectionTitle?: string;
  interns: InternData[];
}

export interface CommunityServiceSectionData {
  sectionTitle?: string;
  title: string;
  content: string;
  images: Array<{
    mediaId: string;
    caption?: string;
  }>;
}

export interface RecentSuccessSectionData {
  sectionTitle?: string;
  title: string;
  content: string;
  image?: string;
  imageCaption?: string;
  /** Optional carousel images below the main content */
  images?: Array<{
    mediaId: string;
    caption?: string;
  }>;
}

export interface MusingsSectionData {
  sectionTitle?: string;
  title: string;
  content: string;
  author?: string;
}

export interface PhotosOfMonthSectionData {
  sectionTitle?: string;
  title?: string;
  images: Array<{
    mediaId: string;
    caption?: string;
  }>;
}

export interface TextCarouselSectionData {
  sectionTitle?: string;
  content: string;
  images: Array<{
    mediaId: string;
    caption?: string;
  }>;
}

export interface CustomSectionData {
  sectionTitle?: string;
  html: string;
}

export interface TwoColumnSectionData {
  // Left column - Spotlight style
  leftTitle?: string;
  leftName: string;
  leftImage?: string;
  leftDetails: Array<{
    label: string;
    value: string;
  }>;
  leftBackgroundColor?: string; // Background color for left column card
  // Right column - About style
  rightTitle?: string;
  rightImage?: string;
  rightImageCaption?: string;
  rightContent: string;
  rightSubtitle?: string;
  rightBullets?: string[];
  rightBackgroundColor?: string; // Background color for right column card
}

// Union type for all section data
export type SectionData =
  | AboutSectionData
  | SpotlightSectionData
  | CarouselSectionData
  | TextImageSectionData
  | EventsSectionData
  | PodcastSectionData
  | BirthdaysSectionData
  | CulturostySectionData
  | GenericTextSectionData
  | ChiefsCornerSectionData
  | InternsCornerSectionData
  | CommunityServiceSectionData
  | RecentSuccessSectionData
  | MusingsSectionData
  | PhotosOfMonthSectionData
  | TextCarouselSectionData
  | TwoColumnSectionData
  | CustomSectionData;
