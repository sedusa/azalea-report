# Refactoring Recommendations for Azalea Report

This document outlines recommendations to improve maintainability, scalability, and code quality of the Azalea Report project.

## 🎯 Executive Summary

The project is functional but has several areas that could benefit from refactoring to improve maintainability, reduce code duplication, and make future updates easier.

---

## 1. 🏗️ Project Structure & Architecture

### 1.1 Routing Strategy (High Priority)
**Current Issue:** Mixed use of `pages/` (Pages Router) and `app/` (App Router) directories
- `pages/index.js` uses Pages Router
- `app/calupload/page.jsx` uses App Router
- `app/Layout.js` and `app/layout.jsx` both exist

**Recommendation:**
- **Choose one routing strategy** (preferably App Router for new Next.js projects)
- Migrate all pages to App Router or stick with Pages Router consistently
- Remove duplicate layout files
- This will reduce confusion and maintenance burden

**Action Items:**
```
1. Decide: App Router vs Pages Router
2. If App Router: Migrate pages/index.js → app/page.jsx
3. Consolidate Layout.js and layout.jsx
4. Update all imports and routing
```

### 1.2 Import Path Aliases (Medium Priority)
**Current Issue:** Inconsistent import paths
- Some files use `@components/`
- Others use `@/components/`
- Mixed usage makes it unclear which convention to follow

**Recommendation:**
- Standardize on `@/` prefix for all imports
- Update `jsconfig.json` paths to be consistent
- Update all imports across the codebase

**Current jsconfig.json:**
```json
{
  "paths": {
    "@/*": ["./*"],
    "@components/*": ["components/*"],
    // ... others
  }
}
```

**Recommended:**
```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

Then use `@/components/Carousel` everywhere instead of `@components/Carousel`.

---

## 2. 📦 Component Organization

### 2.1 Consolidate Similar Section Components (High Priority)
**Current Issue:** Multiple components with nearly identical structure

**Similar Components Identified:**
- `GenericSingleImageTextSection.js` and `BasicSection.js` - both have expand/collapse functionality
- `GenericSingleImageCarouselTextSection.js` and `RecentSuccess.js` - both have carousel + text structure
- `ChiefsCorner.js` and `InternsCorner.js` - both display profiles in carousel/list format

**Recommendation:**
Create a unified, configurable section component:

```javascript
// components/sections/ArticleSection.js
const ArticleSection = ({ 
  sectionTitle,
  title,
  author,
  coverImage,
  imageCaption,
  content,
  description,
  backgroundColor,
  carousel, // optional carousel config
  expandable, // enable show more/less
}) => {
  // Unified logic here
}
```

**Benefits:**
- Reduce code duplication by ~40%
- Easier to maintain and update
- Consistent UI/UX across sections
- Easier to add new sections

### 2.2 Create Reusable UI Components (Medium Priority)
**Components to Extract:**
- `ImageWithCaption` - Used in multiple places
- `SectionHeader` - Consistent section title styling
- `AuthorByline` - Used in many sections
- `ExpandableContent` - Duplicated in BasicSection and GenericSingleImageTextSection

**Example:**
```javascript
// components/common/ImageWithCaption.js
const ImageWithCaption = ({ src, alt, caption, className }) => (
  <div className={styles.imageWrapper}>
    <img src={src} alt={alt} className={className} />
    {caption && <small className={styles.caption}>{caption}</small>}
  </div>
);
```

### 2.3 Component Props Validation (Medium Priority)
**Recommendation:** Add PropTypes or migrate to TypeScript for better type safety

---

## 3. 📄 Content Management

### 3.1 Split Large Content Files (High Priority)
**Current Issue:** `content/home.md` is 549 lines with complex nested YAML

**Recommendation:**
- Split into smaller, focused files
- Create a content structure:

```
content/
  issues/
    current.yml
  sections/
    banner.yml
    about.yml
    spotlight.yml
    program.yml
    ...
  data/
    photos-of-month.yml
    events.yml
```

- Or use a content management system (CMS) like:
  - Netlify CMS (already partially set up in `public/admin/`)
  - Sanity
  - Contentful
  - Strapi

### 3.2 Content Type Definitions (Medium Priority)
Create TypeScript interfaces or JSON schemas for content structure validation.

---

## 4. 🎨 Styling & CSS

### 4.1 CSS Module Consolidation (Medium Priority)
**Current Issue:** Many CSS modules with similar patterns

**Recommendation:**
- Create shared CSS variables file for common values:
  ```css
  /* styles/variables.css */
  :root {
    --primary-color: #016f53;
    --text-color: #333333;
    --background-light: #FFE6D6;
    --border-radius: 15px;
    --section-padding: 30px;
  }
  ```

- Extract common patterns:
  - `styles/common/section.css` - Common section styles
  - `styles/common/button.css` - Button styles
  - `styles/common/typography.css` - Typography

### 4.2 Consistent Breakpoints (Low Priority)
**Current Issue:** Uses `768px` breakpoint consistently, but could be more organized

**Recommendation:**
- Create a breakpoints utility:
```javascript
// utils/breakpoints.js
export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1280px',
};
```

---

## 5. 🔧 Code Quality & Best Practices

### 5.1 Add TypeScript (High Priority)
**Benefits:**
- Type safety
- Better IDE support
- Easier refactoring
- Fewer runtime errors

**Migration Strategy:**
1. Start with `tsconfig.json`
2. Convert utils first (low risk)
3. Convert components gradually
4. Add types for content structure

### 5.2 Error Handling (Medium Priority)
**Current Issue:** No visible error boundaries or error handling

**Recommendation:**
- Add React Error Boundaries
- Add try-catch in async operations
- Handle missing/invalid content gracefully

### 5.3 Accessibility Improvements (Medium Priority)
**Current Issues:**
- Some buttons missing `aria-label` (fixed in Carousel)
- No skip navigation
- Image alt text could be more descriptive

**Recommendations:**
- Add skip navigation link
- Ensure all interactive elements are keyboard accessible
- Add ARIA labels where needed
- Test with screen readers

### 5.4 Performance Optimization (Low Priority)
- Implement image lazy loading (Next.js Image already helps)
- Add loading states for carousels
- Consider code splitting for large components
- Optimize bundle size

---

## 6. 🧪 Testing & Quality Assurance

### 6.1 Add Testing Framework (High Priority)
**Recommendation:** Add testing infrastructure

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Test Priorities:**
1. Utility functions (`truncateText`, etc.)
2. Components with logic (Carousel, expandable sections)
3. Content rendering

### 6.2 Linting & Formatting (Medium Priority)
**Recommendation:**
- Add ESLint configuration
- Add Prettier for code formatting
- Add pre-commit hooks (husky)

---

## 7. 📱 Mobile Experience (Recently Improved)

### ✅ Completed:
- Carousel buttons are now larger (60x60px) and easier to tap
- Square carousel images are larger on mobile (400px vs 220px)
- Added touch/swipe support for carousel navigation
- Added aria-labels for accessibility

### Additional Recommendations:
- Test on actual mobile devices
- Consider adding haptic feedback for swipe gestures
- Add visual indicators for swipeable content

---

## 8. 🗂️ File Organization

### 8.1 Recommended Structure
```
src/
  app/              # App Router pages
  components/
    common/         # Reusable UI components
    sections/       # Section-specific components
    layout/         # Layout components
  content/
    issues/
    sections/
    data/
  styles/
    common/         # Shared styles
    components/     # Component styles
  utils/
    hooks/          # Custom hooks
    helpers/        # Helper functions
  types/            # TypeScript types (if migrating)
  public/
```

### 8.2 Configuration Files
- Move config files to root level
- Consider using `.env` files for environment variables
- Document configuration options

---

## 9. 📚 Documentation

### 9.1 Code Documentation (Medium Priority)
- Add JSDoc comments to components
- Document component props
- Add README for each major feature

### 9.2 Developer Guide
- Document content structure
- Add setup instructions
- Document deployment process
- Add troubleshooting guide

---

## 10. 🔄 Migration Plan (Suggested Order)

### Phase 1: Foundation (1-2 weeks)
1. ✅ Fix mobile carousel (DONE)
2. Standardize import paths
3. Add linting/formatting
4. Create error boundaries

### Phase 2: Component Refactoring (2-3 weeks)
1. Extract common components
2. Consolidate similar section components
3. Create shared styles

### Phase 3: Content Management (1-2 weeks)
1. Split large content files
2. Set up content structure
3. Implement content validation

### Phase 4: Type Safety (2-3 weeks)
1. Add TypeScript configuration
2. Convert utils
3. Convert components gradually

### Phase 5: Testing & Optimization (1-2 weeks)
1. Add test framework
2. Write tests for critical components
3. Performance optimization

---

## 11. 📊 Metrics to Track

After refactoring, track:
- Bundle size reduction
- Code duplication reduction
- Build time
- Developer onboarding time
- Bug rate

---

## 12. 🎯 Quick Wins (Can be done immediately)

1. ✅ Fix mobile carousel (DONE)
2. Standardize all imports to use `@/` prefix
3. Extract `ImageWithCaption` component
4. Extract `SectionHeader` component
5. Create CSS variables file
6. Add PropTypes to components
7. Add error boundary
8. Split `home.md` into smaller files

---

## Summary

**Priority Focus Areas:**
1. **High Priority:** Routing strategy, component consolidation, content splitting, TypeScript migration
2. **Medium Priority:** Import standardization, shared components, testing, accessibility
3. **Low Priority:** Performance optimization, advanced features

**Estimated Total Effort:** 6-10 weeks for full refactoring

**Immediate Next Steps:**
1. Decide on routing strategy
2. Standardize imports
3. Extract 2-3 common components
4. Split content file

---

*Last Updated: Based on codebase review in December 2024*
