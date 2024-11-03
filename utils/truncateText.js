import { useBreakpoint } from './useBreakPoint';

// Convert to a component that returns the truncated text
const TruncateText = ({ content, maxLength }) => {
  const isMobile = useBreakpoint();
  
  // Default to mobile-friendly length if no maxLength provided
  const defaultLength = isMobile ? 200 : 450;
  const limit = maxLength || defaultLength;
  
  if (content.length <= limit) return content;
  return content.substr(0, content.lastIndexOf(' ', limit)) + '...';
};

// For non-component usage, create a simple truncate function without responsive behavior
export const truncateText = (content, maxLength) => {
  const limit = maxLength || 450;
  if (content.length <= limit) return content;
  return content.substr(0, content.lastIndexOf(' ', limit)) + '...';
};

export default TruncateText;
