import { v } from "convex/values";

// About Section Validator
export const aboutValidator = v.object({
  sectionTitle: v.optional(v.string()),
  content: v.string(),
  signature: v.optional(v.string()),
});

// Spotlight Section Validator
export const spotlightValidator = v.object({
  sectionTitle: v.optional(v.string()),
  name: v.string(),
  image: v.optional(v.id("media")),
  birthplace: v.optional(v.string()),
  medicalSchool: v.optional(v.string()),
  funFact: v.optional(v.string()),
  favoriteDish: v.optional(v.string()),
  interests: v.optional(v.string()),
  postResidencyPlans: v.optional(v.string()),
});

// Chiefs Corner Section Validator
export const chiefsCornerValidator = v.object({
  sectionTitle: v.optional(v.string()),
  name: v.string(),
  image: v.optional(v.id("media")),
  content: v.string(),
});

// Interns Corner Section Validator
export const internsCornerValidator = v.object({
  sectionTitle: v.optional(v.string()),
  name: v.string(),
  image: v.optional(v.id("media")),
  content: v.string(),
});

// Text Image Section Validator
export const textImageValidator = v.object({
  sectionTitle: v.optional(v.string()),
  content: v.string(),
  image: v.optional(v.id("media")),
  imagePosition: v.union(v.literal("left"), v.literal("right")),
  imageCaption: v.optional(v.string()),
});

// Carousel Image Item Validator
const carouselImageValidator = v.object({
  mediaId: v.id("media"),
  caption: v.optional(v.string()),
});

// Carousel Section Validator
export const carouselValidator = v.object({
  sectionTitle: v.optional(v.string()),
  title: v.string(),
  description: v.optional(v.string()),
  images: v.array(carouselImageValidator),
});

// Text Carousel Section Validator
export const textCarouselValidator = v.object({
  sectionTitle: v.optional(v.string()),
  content: v.string(),
  images: v.array(carouselImageValidator),
});

// Event Item Validator
const eventValidator = v.object({
  title: v.string(),
  date: v.string(),
  description: v.optional(v.string()),
  image: v.optional(v.id("media")),
});

// Events Section Validator
export const eventsValidator = v.object({
  sectionTitle: v.optional(v.string()),
  events: v.array(eventValidator),
});

// Podcast Section Validator
export const podcastValidator = v.object({
  sectionTitle: v.optional(v.string()),
  title: v.string(),
  description: v.optional(v.string()),
  embedUrl: v.string(),
});

// Birthdays Section Validator
export const birthdaysValidator = v.object({
  sectionTitle: v.optional(v.string()),
  month: v.optional(v.number()),
});

// Culturosity Section Validator
export const culturosityValidator = v.object({
  sectionTitle: v.optional(v.string()),
  title: v.string(),
  content: v.string(),
  image: v.optional(v.id("media")),
  author: v.optional(v.string()),
});

// Community Service Section Validator
export const communityServiceValidator = v.object({
  sectionTitle: v.optional(v.string()),
  title: v.string(),
  content: v.string(),
  images: v.array(carouselImageValidator),
});

// Recent Success Section Validator
export const recentSuccessValidator = v.object({
  sectionTitle: v.optional(v.string()),
  title: v.string(),
  content: v.string(),
  image: v.optional(v.id("media")),
});

// Musings Section Validator
export const musingsValidator = v.object({
  sectionTitle: v.optional(v.string()),
  title: v.string(),
  content: v.string(),
  author: v.optional(v.string()),
});

// Photos of Month Section Validator
export const photosOfMonthValidator = v.object({
  sectionTitle: v.optional(v.string()),
  title: v.optional(v.string()),
  images: v.array(carouselImageValidator),
});

// Generic Text Section Validator
export const genericTextValidator = v.object({
  sectionTitle: v.optional(v.string()),
  content: v.string(),
});

// Custom Section Validator
export const customValidator = v.object({
  sectionTitle: v.optional(v.string()),
  html: v.string(),
});

// Section Type to Validator Map
export const sectionValidators = {
  about: aboutValidator,
  spotlight: spotlightValidator,
  chiefsCorner: chiefsCornerValidator,
  internsCorner: internsCornerValidator,
  textImage: textImageValidator,
  carousel: carouselValidator,
  textCarousel: textCarouselValidator,
  events: eventsValidator,
  podcast: podcastValidator,
  birthdays: birthdaysValidator,
  culturosity: culturosityValidator,
  communityService: communityServiceValidator,
  recentSuccess: recentSuccessValidator,
  musings: musingsValidator,
  photosOfMonth: photosOfMonthValidator,
  genericText: genericTextValidator,
  custom: customValidator,
} as const;

// Helper to get validator for a section type
export function getSectionValidator(type: keyof typeof sectionValidators) {
  return sectionValidators[type];
}
