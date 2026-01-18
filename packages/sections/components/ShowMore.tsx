'use client';

import { useState, useRef, useEffect } from 'react';

interface ShowMoreProps {
  content: string;
  maxHeight?: number;
  className?: string;
}

/**
 * ShowMore component with expandable text functionality
 * Matches the azaleareport.com "Show More" pattern and module.css toggle button styles
 */
export function ShowMore({ content, maxHeight = 150, className = '' }: ShowMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setNeedsTruncation(contentRef.current.scrollHeight > maxHeight);
    }
  }, [content, maxHeight]);

  return (
    <div className={className}>
      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-out',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="toggle-button"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
}
