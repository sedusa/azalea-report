import type { SectionType } from '../types';

// Field Types for Property Panel
export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'image'
  | 'images'
  | 'imagesWithCaptions'  // Array of images with individual captions (for carousels)
  | 'date'
  | 'select'
  | 'number'
  | 'color'
  | 'chiefArray'
  | 'internArray'
  | 'detailsArray'
  | 'bulletsArray'
  | 'podcastArray'  // Array of podcast episodes
  | 'eventsArray';  // Array of events with date and title

// Pastel Color Palette for Section Backgrounds
// All colors have good contrast with dark text (#333333)
export const SECTION_BACKGROUND_COLORS = [
  { value: '#f7f3e8', label: 'Warm Cream', name: 'cream' },
  { value: '#FFE6D6', label: 'Peach', name: 'peach' },
  { value: '#e6f0ed', label: 'Mint Green', name: 'mint' },
  { value: '#ddfee9', label: 'Light Green', name: 'lightGreen' },
  { value: '#e8f4f8', label: 'Light Blue', name: 'lightBlue' },
  { value: '#f0e6f6', label: 'Lavender', name: 'lavender' },
  { value: '#fff9e6', label: 'Lemon', name: 'lemon' },
  { value: '#E8C840', label: 'Golden Yellow', name: 'golden' },
  { value: '#fce4ec', label: 'Pink', name: 'pink' },
  { value: '#e0f2f1', label: 'Teal', name: 'teal' },
  { value: '#fff3e0', label: 'Orange Cream', name: 'orangeCream' },
  { value: '#f3e5f5', label: 'Light Purple', name: 'lightPurple' },
  { value: '#e8eaf6', label: 'Indigo', name: 'indigo' },
] as const;

export type SectionBackgroundColor = typeof SECTION_BACKGROUND_COLORS[number]['value'];

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
  defaultBackgroundColor?: string; // Optional default background color for new sections
  helpText?: string; // Optional help text shown below the fields
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
    label: "Chiefs' Corner",
    description: 'Feature chief residents with photos and bios (supports multiple chiefs in two-column layout)',
    icon: 'crown',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: "The Chiefs' Corner" },
      { name: 'chiefs', label: 'Chief Residents', type: 'chiefArray', required: true },
    ],
    exampleData: () => ({
      sectionTitle: "The Chiefs' Corner",
      chiefs: [
        {
          name: 'Dr. Mariya Tom',
          image: '',
          content: '<p>Meet our Chief Resident who brings dedication and leadership to our program...</p>',
        },
        {
          name: 'Dr. Brandon Rockwell',
          image: '',
          content: '<p>Our Chief Resident is passionate about medical education and patient care...</p>',
        },
      ],
    }),
  },

  internsCorner: {
    type: 'internsCorner',
    label: "Interns' Corner",
    description: 'Feature interns with photos and bios (supports multiple interns in two-column layout)',
    icon: 'graduationCap',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: "Interns' Corner" },
      { name: 'interns', label: 'Interns', type: 'internArray', required: true },
    ],
    exampleData: () => ({
      sectionTitle: "Interns' Corner",
      interns: [
        {
          name: 'Dr. Sarah Johnson',
          image: '',
          content: '<p>Starting internship has been an incredible journey. Here are some reflections...</p>',
        },
      ],
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
    description: 'List of upcoming events with dates',
    icon: 'calendar',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Upcoming Events' },
      { name: 'events', label: 'Events', type: 'eventsArray', required: true },
    ],
    exampleData: () => ({
      sectionTitle: 'Upcoming Events',
      events: [
        {
          date: '2026-02-15',
          title: 'Grand Rounds',
        },
        {
          date: '2026-02-20',
          title: 'Resident Social',
        },
      ],
    }),
  },

  podcast: {
    type: 'podcast',
    label: 'Podcasts',
    description: 'Featured podcast episodes with links to listen',
    icon: 'mic',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Podcasts' },
      { name: 'title', label: 'Podcast Series Title', type: 'text', required: true, placeholder: 'What Brings You In Today? - Featured Podcasts' },
      { name: 'subtitle', label: 'Subtitle', type: 'text', required: false, placeholder: 'A Podcast from SGMC Health' },
      { name: 'episodes', label: 'Episodes', type: 'podcastArray', required: true },
    ],
    exampleData: () => ({
      sectionTitle: 'Podcasts',
      title: 'What Brings You In Today? - Featured Podcasts',
      subtitle: 'A Podcast from SGMC Health',
      episodes: [
        {
          title: 'Episode #5 - Joseph Hayes, MD',
          description: 'This episode of the podcast features Dr. Hayes, Medical Director at SGMC Internal Medicine and Assistant Professor at Mercer Medical School.',
          buttonUrl: 'https://open.spotify.com/episode/...',
          buttonText: 'Listen to Episode 5 with Dr. Joseph Hayes on Spotify',
        },
      ],
    }),
  },

  birthdays: {
    type: 'birthdays',
    label: 'Birthdays',
    description: 'Birthday celebrations for the month',
    icon: 'cake',
    defaultBackgroundColor: '#E8C840', // Golden yellow for birthdays
    helpText: 'Birthdays will be auto-populated based on the current month. You can add more birthdays in the Birthdays section.',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'January Birthdays' },
    ],
    exampleData: () => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const currentMonth = new Date().getMonth() + 1; // 1-12
      return {
        sectionTitle: `${monthNames[currentMonth - 1]} Birthdays`,
      };
    },
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
    description: 'Community service activities with text wrapping around image and photo carousel',
    icon: 'heart',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Community Service Corner' },
      { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Event or Activity Title' },
      { name: 'image', label: 'Main Image', type: 'image', required: false },
      { name: 'imageCaption', label: 'Image Caption', type: 'text', required: false, placeholder: 'Photo caption' },
      { name: 'imagePosition', label: 'Image Position', type: 'select', required: false, options: [
        { value: 'left', label: 'Left (text wraps right)' },
        { value: 'right', label: 'Right (text wraps left)' },
      ]},
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'photosTitle', label: 'Photo Gallery Title', type: 'text', required: false, placeholder: 'Highlights from the Event' },
      { name: 'images', label: 'Photo Gallery (Carousel)', type: 'imagesWithCaptions', required: false },
    ],
    exampleData: () => ({
      sectionTitle: 'Community Service Corner',
      title: 'Health Fair Volunteers',
      imageCaption: 'Residents at the health fair',
      imagePosition: 'left',
      content: '<p>Our residents participated in the annual community health fair, providing essential health screenings and education to over 500 community members...</p>',
      photosTitle: 'Highlights from the Event',
      images: [],
    }),
  },

  recentSuccess: {
    type: 'recentSuccess',
    label: 'Recent Success',
    description: 'Highlight achievements and accomplishments with optional image carousel',
    icon: 'award',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Recent Success' },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'image', label: 'Main Image', type: 'image', required: false },
      { name: 'imageCaption', label: 'Image Caption', type: 'text', required: false, placeholder: 'Photo caption' },
      { name: 'images', label: 'Additional Photos (Carousel)', type: 'imagesWithCaptions', required: false },
    ],
    exampleData: () => ({
      sectionTitle: 'Recent Success',
      title: 'Research Publication',
      content: '<p>Congratulations to Dr. Smith on publishing their research in JAMA...</p>',
      imageCaption: 'Dr. Smith presenting their research',
      images: [],
    }),
  },

  photosOfMonth: {
    type: 'photosOfMonth',
    label: 'Photos of the Month',
    description: 'Featured photos for the month with carousel display',
    icon: 'camera',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'Photos of the Month' },
      { name: 'title', label: 'Title', type: 'text', required: false },
      { name: 'images', label: 'Photos', type: 'imagesWithCaptions', required: true },
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

  twoColumn: {
    type: 'twoColumn',
    label: 'Two Column Layout',
    description: 'Side-by-side spotlight and about sections',
    icon: 'columns',
    fields: [
      // Left column (Spotlight style)
      { name: 'leftTitle', label: 'Left Title', type: 'text', required: false, placeholder: 'Resident Spotlight' },
      { name: 'leftName', label: 'Name', type: 'text', required: true, placeholder: 'Dr. Jane Smith' },
      { name: 'leftImage', label: 'Portrait Photo', type: 'image', required: false },
      { name: 'leftDetails', label: 'Details', type: 'detailsArray', required: false },
      // Right column (About style)
      { name: 'rightTitle', label: 'Right Title', type: 'text', required: false, placeholder: 'About the Program' },
      { name: 'rightImage', label: 'Feature Image', type: 'image', required: false },
      { name: 'rightImageCaption', label: 'Image Caption', type: 'text', required: false },
      { name: 'rightContent', label: 'Content', type: 'richtext', required: true },
      { name: 'rightSubtitle', label: 'Subtitle', type: 'text', required: false, placeholder: 'Interesting Facts' },
      { name: 'rightBullets', label: 'Bullet Points', type: 'bulletsArray', required: false },
    ],
    exampleData: () => ({
      leftTitle: 'Resident Spotlight',
      leftName: 'Anna Ledford, MD',
      leftDetails: [
        { label: 'Birth place', value: 'Valdosta, GA' },
        { label: 'Fun fact', value: 'Once met the President!' },
        { label: 'Favorite dish', value: 'Shrimp and grits' },
        { label: 'Interests', value: 'Hiking, reading, cooking' },
        { label: 'Post-residency plans', value: 'Hospitalist medicine' },
      ],
      rightTitle: 'About the Program',
      rightImageCaption: 'Our residents at work',
      rightContent: '<p>The Internal Medicine Residency Program at SGMC Health prepares physicians to practice medicine at its highest level...</p>',
      rightSubtitle: 'Interesting Facts',
      rightBullets: [
        'Established in 2018',
        '36 categorical residents',
        'High board pass rate',
      ],
    }),
  },

  custom: {
    type: 'custom',
    label: 'Custom Article',
    description: 'Custom HTML article with title, description, author, and images',
    icon: 'code',
    helpText: 'Use {{image-0}}, {{image-1}}, etc. in HTML to reference uploaded images',
    fields: [
      { name: 'sectionTitle', label: 'Section Title', type: 'text', required: false, placeholder: 'News & Updates' },
      { name: 'title', label: 'Article Title', type: 'text', required: false, placeholder: 'SGMC Health Receives Statewide Awards' },
      { name: 'description', label: 'Description/Intro', type: 'richtext', required: false },
      { name: 'author', label: 'Author', type: 'text', required: false, placeholder: 'SGMC Health' },
      { name: 'images', label: 'Images (Reference as {{image-0}}, {{image-1}}, etc.)', type: 'imagesWithCaptions', required: false },
      { name: 'html', label: 'Custom HTML Content', type: 'textarea', required: false },
    ],
    exampleData: () => ({
      sectionTitle: 'News & Updates',
      title: 'SGMC Health Receives Statewide Awards for Patient Safety',
      description: '<p>SGMC Health has been recognized for its commitment to patient safety and quality care.</p>',
      author: 'SGMC Health',
      images: [],
      html: '',
    }),
  },

  eventsBirthdays: {
    type: 'eventsBirthdays',
    label: 'Events & Birthdays',
    description: 'Side-by-side display of upcoming events and birthdays',
    icon: 'calendarHeart',
    fields: [
      { name: 'eventsTitle', label: 'Events Title', type: 'text', required: false, placeholder: 'Upcoming Events' },
      { name: 'events', label: 'Events', type: 'eventsArray', required: false },
      { name: 'eventsBackgroundColor', label: 'Events Background Color', type: 'select', required: false, options: [
        { value: '#f7f3e8', label: 'Warm Cream' },
        { value: '#FFE6D6', label: 'Peach' },
        { value: '#e6f0ed', label: 'Mint Green' },
        { value: '#e8f4f8', label: 'Light Blue' },
        { value: '#f0e6f6', label: 'Lavender' },
        { value: '#fce4ec', label: 'Pink' },
        { value: '#E8C840', label: 'Golden Yellow' },
      ]},
      { name: 'birthdaysTitle', label: 'Birthdays Title', type: 'text', required: false, placeholder: 'January Birthdays' },
      { name: 'birthdaysBackgroundColor', label: 'Birthdays Background Color', type: 'select', required: false, options: [
        { value: '#E8C840', label: 'Golden Yellow' },
        { value: '#FFE6D6', label: 'Peach' },
        { value: '#e6f0ed', label: 'Mint Green' },
        { value: '#e8f4f8', label: 'Light Blue' },
        { value: '#f0e6f6', label: 'Lavender' },
        { value: '#fce4ec', label: 'Pink' },
      ]},
    ],
    helpText: 'Birthdays will be auto-populated based on the current month.',
    exampleData: () => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const currentMonth = new Date().getMonth() + 1;
      return {
        eventsTitle: 'Upcoming Events',
        events: [
          { date: '2026-02-15', title: 'Grand Rounds' },
          { date: '2026-02-20', title: 'Resident Social' },
        ],
        eventsBackgroundColor: '#f7f3e8',
        birthdaysTitle: `${monthNames[currentMonth - 1]} Birthdays`,
        birthdaysBackgroundColor: '#E8C840',
      };
    },
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
