import type { SectionType } from '../types';

// Field Types for Property Panel
export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'image'
  | 'images'
  | 'date'
  | 'select'
  | 'number';

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface SectionDefinition {
  type: SectionType;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  fields: FieldDefinition[];
  exampleData: () => Record<string, unknown>;
}

// Section Registry - All 17 section types
export const SECTION_REGISTRY: Record<SectionType, SectionDefinition> = {
  about: {
    type: 'about',
    label: 'About Section',
    description: 'Introduction or about content with rich text',
    icon: 'info',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'About' },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'signature', label: 'Signature', type: 'text', required: false, placeholder: 'Your name' },
    ],
    exampleData: () => ({
      sectionTitle: 'About This Edition',
      content: '<p>Welcome to this month\'s edition of the Azalea Report. We are excited to share updates from our residency program...</p>',
      signature: 'The Editorial Team',
    }),
  },

  spotlight: {
    type: 'spotlight',
    label: 'Resident Spotlight',
    description: 'Feature a resident with photo and details',
    icon: 'user',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Resident Spotlight' },
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Dr. Jane Smith' },
      { name: 'image', label: 'Photo', type: 'image', required: false },
      { name: 'birthplace', label: 'Birthplace', type: 'text', required: false },
      { name: 'medicalSchool', label: 'Medical School', type: 'text', required: false },
      { name: 'funFact', label: 'Fun Fact', type: 'textarea', required: false },
      { name: 'favoriteDish', label: 'Favorite Dish', type: 'text', required: false },
      { name: 'interests', label: 'Interests', type: 'textarea', required: false },
      { name: 'postResidencyPlans', label: 'Post-Residency Plans', type: 'textarea', required: false },
    ],
    exampleData: () => ({
      sectionTitle: 'Resident Spotlight',
      name: 'Dr. Jane Smith',
      birthplace: 'Atlanta, Georgia',
      medicalSchool: 'Emory University School of Medicine',
      funFact: 'I\'ve visited all 50 states!',
      favoriteDish: 'Southern-style shrimp and grits',
      interests: 'Hiking, photography, and cooking',
      postResidencyPlans: 'Pursuing fellowship in cardiology',
    }),
  },

  chiefsCorner: {
    type: 'chiefsCorner',
    label: 'Chief\'s Corner',
    description: 'Message from the chief resident',
    icon: 'crown',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Chief\'s Corner' },
      { name: 'name', label: 'Chief\'s Name', type: 'text', required: true },
      { name: 'image', label: 'Photo', type: 'image', required: false },
      { name: 'content', label: 'Message', type: 'richtext', required: true },
    ],
    exampleData: () => ({
      sectionTitle: 'Chief\'s Corner',
      name: 'Dr. John Doe',
      content: '<p>Hello fellow residents! This month has been filled with exciting developments...</p>',
    }),
  },

  internsCorner: {
    type: 'internsCorner',
    label: 'Intern\'s Corner',
    description: 'Message from an intern',
    icon: 'graduationCap',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Intern\'s Corner' },
      { name: 'name', label: 'Intern\'s Name', type: 'text', required: true },
      { name: 'image', label: 'Photo', type: 'image', required: false },
      { name: 'content', label: 'Message', type: 'richtext', required: true },
    ],
    exampleData: () => ({
      sectionTitle: 'Intern\'s Corner',
      name: 'Dr. Sarah Johnson',
      content: '<p>Starting internship has been an incredible journey. Here are some reflections...</p>',
    }),
  },

  textImage: {
    type: 'textImage',
    label: 'Text with Image',
    description: 'Rich text content with an accompanying image',
    icon: 'layoutList',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'image', label: 'Image', type: 'image', required: false },
      { name: 'imagePosition', label: 'Image Position', type: 'select', required: true, options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ]},
      { name: 'imageCaption', label: 'Image Caption', type: 'text', required: false },
    ],
    exampleData: () => ({
      sectionTitle: 'Featured Story',
      content: '<p>This month\'s featured story highlights the achievements of our program...</p>',
      imagePosition: 'right',
      imageCaption: 'Photo caption here',
    }),
  },

  carousel: {
    type: 'carousel',
    label: 'Image Carousel',
    description: 'Slideshow of multiple images',
    icon: 'images',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false },
      { name: 'title', label: 'Carousel Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
      { name: 'images', label: 'Images', type: 'images', required: true },
    ],
    exampleData: () => ({
      sectionTitle: 'Photo Gallery',
      title: 'Department Events',
      description: 'Highlights from this month\'s activities',
      images: [],
    }),
  },

  textCarousel: {
    type: 'textCarousel',
    label: 'Text with Carousel',
    description: 'Rich text content with image carousel',
    icon: 'fileImage',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'images', label: 'Images', type: 'images', required: true },
    ],
    exampleData: () => ({
      sectionTitle: 'Event Recap',
      content: '<p>Check out the highlights from our recent event...</p>',
      images: [],
    }),
  },

  events: {
    type: 'events',
    label: 'Upcoming Events',
    description: 'List of upcoming events',
    icon: 'calendar',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Upcoming Events' },
      // Events array handled specially in property panel
    ],
    exampleData: () => ({
      sectionTitle: 'Upcoming Events',
      events: [
        {
          title: 'Grand Rounds',
          date: '2026-02-15',
          description: 'Monthly grand rounds presentation',
        },
        {
          title: 'Resident Social',
          date: '2026-02-20',
          description: 'Monthly social gathering for residents',
        },
      ],
    }),
  },

  podcast: {
    type: 'podcast',
    label: 'Podcast',
    description: 'Embedded podcast episode',
    icon: 'mic',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Podcast' },
      { name: 'title', label: 'Episode Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
      { name: 'embedUrl', label: 'Embed URL', type: 'text', required: true, placeholder: 'https://...' },
    ],
    exampleData: () => ({
      sectionTitle: 'Podcast',
      title: 'Episode 10: Resident Wellness',
      description: 'In this episode, we discuss strategies for maintaining wellness during residency.',
      embedUrl: 'https://open.spotify.com/embed/episode/...',
    }),
  },

  birthdays: {
    type: 'birthdays',
    label: 'Birthdays',
    description: 'Birthday celebrations for the month',
    icon: 'cake',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Birthday Celebrations' },
      { name: 'month', label: 'Month', type: 'select', required: false, options: [
        { value: '', label: 'Current Month' },
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
      ]},
    ],
    exampleData: () => ({
      sectionTitle: 'Birthday Celebrations',
      month: undefined, // Uses current month
    }),
  },

  culturosity: {
    type: 'culturosity',
    label: 'Culturosity',
    description: 'Cultural spotlight or feature',
    icon: 'globe',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Culturosity' },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'image', label: 'Image', type: 'image', required: false },
      { name: 'author', label: 'Author', type: 'text', required: false },
    ],
    exampleData: () => ({
      sectionTitle: 'Culturosity',
      title: 'Celebrating Lunar New Year',
      content: '<p>Learn about the traditions and celebrations of Lunar New Year...</p>',
      author: 'Dr. Wei Chen',
    }),
  },

  communityService: {
    type: 'communityService',
    label: 'Community Service',
    description: 'Community service activities and highlights',
    icon: 'heart',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Community Service' },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'images', label: 'Photos', type: 'images', required: false },
    ],
    exampleData: () => ({
      sectionTitle: 'Community Service',
      title: 'Health Fair Volunteers',
      content: '<p>Our residents participated in the annual community health fair...</p>',
      images: [],
    }),
  },

  recentSuccess: {
    type: 'recentSuccess',
    label: 'Recent Success',
    description: 'Highlight achievements and accomplishments',
    icon: 'award',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Recent Success' },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'image', label: 'Image', type: 'image', required: false },
    ],
    exampleData: () => ({
      sectionTitle: 'Recent Success',
      title: 'Research Publication',
      content: '<p>Congratulations to Dr. Smith on publishing their research in JAMA...</p>',
    }),
  },

  musings: {
    type: 'musings',
    label: 'Musings',
    description: 'Reflections and personal stories',
    icon: 'penTool',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Musings' },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'author', label: 'Author', type: 'text', required: false },
    ],
    exampleData: () => ({
      sectionTitle: 'Musings',
      title: 'Reflections on Year One',
      content: '<p>As I complete my first year of residency, I\'ve learned so much...</p>',
      author: 'Dr. Anonymous',
    }),
  },

  photosOfMonth: {
    type: 'photosOfMonth',
    label: 'Photos of the Month',
    description: 'Featured photos for the month',
    icon: 'camera',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Photos of the Month' },
      { name: 'title', label: 'Title', type: 'text', required: false },
      { name: 'images', label: 'Photos', type: 'images', required: true },
    ],
    exampleData: () => ({
      sectionTitle: 'Photos of the Month',
      title: 'January Highlights',
      images: [],
    }),
  },

  genericText: {
    type: 'genericText',
    label: 'Generic Text',
    description: 'Simple text section',
    icon: 'alignLeft',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
    ],
    exampleData: () => ({
      sectionTitle: 'Announcements',
      content: '<p>Important announcements for this month...</p>',
    }),
  },

  custom: {
    type: 'custom',
    label: 'Custom Section',
    description: 'Custom HTML section (admin only)',
    icon: 'code',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false },
      { name: 'html', label: 'HTML Content', type: 'textarea', required: true },
    ],
    exampleData: () => ({
      sectionTitle: 'Custom Content',
      html: '<div class="custom-section"><p>Custom HTML content here...</p></div>',
    }),
  },
};

// Brand Colors
export const BRAND_COLORS = {
  primaryGreen: '#016f53',
  primaryGreenHover: '#014d3a',
  peachBackground: '#FFE6D6',
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// Issue Statuses
export const ISSUE_STATUSES = {
  draft: { label: 'Draft', color: 'yellow' },
  published: { label: 'Published', color: 'green' },
  archived: { label: 'Archived', color: 'gray' },
} as const;

// Lock Configuration
export const LOCK_CONFIG = {
  heartbeatIntervalMs: 30000, // 30 seconds
  staleThresholdMs: 120000, // 2 minutes
};

// Autosave Configuration
export const AUTOSAVE_CONFIG = {
  debounceMs: 2500, // 2.5 seconds
};
