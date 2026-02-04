'use client';

import { useState, useRef, useEffect } from 'react';

interface ShowMoreProps {
  content: string;
  maxHeight?: number;
  className?: string;
  /** Force dark text color (#333333) - use when inside sections with pastel backgrounds */
  forceDarkText?: boolean;
}

/**
 * ShowMore component with expandable text functionality
 * Matches the azaleareport.com "Show More" pattern and module.css toggle button styles
 */
export function ShowMore({ content, maxHeight = 600, className = '', forceDarkText = false }: ShowMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setNeedsTruncation(contentRef.current.scrollHeight > maxHeight);
    }
  }, [content, maxHeight]);

  // Inline styles for dark text when on colored backgrounds
  const textStyle = forceDarkText ? { color: '#333333' } : {};

  return (
    <div className={className} style={textStyle}>
      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-out',
          ...(forceDarkText ? { color: '#333333' } : {}),
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="toggle-button"
          style={{
            backgroundColor: '#016f53',
            color: '#ffffff',
          }}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
}
