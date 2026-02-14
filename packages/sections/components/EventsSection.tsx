'use client';

import type { EventsSectionData } from '@azalea/shared/types';

interface EventsSectionProps {
  data: EventsSectionData;
  backgroundColor?: string;
}

/**
 * Format a date string to a readable format like "Nov 27th, 2025"
 */
function formatEventDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString + 'T00:00:00'); // Add time to prevent timezone issues

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Add ordinal suffix
    const getOrdinalSuffix = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };

    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
  } catch {
    return dateString;
  }
}

/**
 * EventsSection - Displays upcoming events as a bullet list
 * Format: "Date - Event Title"
 */
export function EventsSection({ data, backgroundColor }: EventsSectionProps) {
  const { sectionTitle, events = [] } = data;

  // When backgroundColor is set, use dark text for readability on pastel backgrounds
  const hasBackground = !!backgroundColor;

  // Text colors based on background
  const textColor = hasBackground ? '#333333' : 'var(--foreground)';
  const headingColor = hasBackground ? '#333333' : 'var(--foreground)';

  // Filter out events without both date and title
  const validEvents = events.filter(event => event.date && event.title);

  // Don't render if no valid events
  if (validEvents.length === 0) {
    return null;
  }

  return (
    <section
      className={hasBackground ? 'section-card section-with-bg' : 'section-transparent'}
      style={{
        marginBottom: '2rem',
        backgroundColor: backgroundColor || 'transparent',
        borderRadius: hasBackground ? 'var(--radius, 0.75rem)' : undefined,
        padding: hasBackground ? '2rem' : undefined,
      }}
    >
      {/* Section Title */}
      {sectionTitle && (
        <h2
          className="section-title"
          style={{
            color: headingColor,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
          }}
        >
          {sectionTitle}
        </h2>
      )}

      {/* Events List */}
      <ul
        style={{
          listStyle: 'disc',
          paddingLeft: '1.5rem',
          margin: 0,
        }}
      >
        {validEvents.map((event, index) => (
          <li
            key={index}
            style={{
              color: textColor,
              fontFamily: "'Georgia', serif",
              fontSize: '1.3rem',
              lineHeight: 1.6,
              marginBottom: '0.5rem',
            }}
          >
            <span style={{ fontWeight: 'bold' }}>
              {formatEventDate(event.date)}
            </span>
            {' - '}
            <span>{event.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
