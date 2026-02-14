'use client';

import { useState, useEffect, useRef } from 'react';

interface EventItem {
  date: string;
  title: string;
}

interface BirthdayItem {
  _id: string;
  name: string;
  day: number;
  month: number;
}

interface EventsBirthdaysSectionData {
  eventsTitle?: string;
  events?: EventItem[];
  eventsBackgroundColor?: string;
  birthdaysTitle?: string;
  birthdays?: BirthdayItem[];
  birthdaysBackgroundColor?: string;
}

interface EventsBirthdaysSectionProps {
  data: EventsBirthdaysSectionData;
  backgroundColor?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_ABBREV = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Format a date string to a readable format like "Nov 27th, 2025"
 */
function formatEventDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString + 'T00:00:00');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

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
 * EventsBirthdaysSection - Displays events and birthdays side by side
 * Left: Upcoming Events (with optional background color)
 * Right: Birthdays (with background color card)
 */
export function EventsBirthdaysSection({ data, backgroundColor }: EventsBirthdaysSectionProps) {
  const {
    eventsTitle = 'Upcoming Events',
    events = [],
    eventsBackgroundColor = '#f7f3e8', // Default warm cream
    birthdaysTitle,
    birthdays = [],
    birthdaysBackgroundColor = '#E8C840',
  } = data;

  // Track container width for responsive layout
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        // Stack columns when container is less than 600px wide
        setIsMobile(containerRef.current.offsetWidth < 600);
      }
    };

    // Check on mount
    checkWidth();

    // Use ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(checkWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Current month for birthdays
  const currentMonth = new Date().getMonth() + 1;
  const monthName = MONTH_NAMES[currentMonth - 1];
  const monthAbbrev = MONTH_ABBREV[currentMonth - 1];

  // Filter and sort birthdays for current month
  const currentMonthBirthdays = birthdays
    .filter(b => b.month === currentMonth)
    .sort((a, b) => a.day - b.day);

  // Filter valid events
  const validEvents = events.filter(e => e.date && e.title);

  // Section background
  const hasBackground = !!backgroundColor;

  // Text colors - consistent across both columns
  const headingColor = '#016f53'; // Green for headings
  const textColor = '#333333'; // Dark for content

  return (
    <section
      ref={containerRef}
      className={hasBackground ? 'section-card section-with-bg' : 'section-transparent'}
      style={{
        marginBottom: '2rem',
        backgroundColor: backgroundColor || 'transparent',
        borderRadius: hasBackground ? 'var(--radius, 0.75rem)' : undefined,
        padding: hasBackground ? '2rem' : undefined,
      }}
    >
      <div
        className="events-birthdays-grid"
        style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: isMobile ? 'column' : undefined,
          gridTemplateColumns: isMobile ? undefined : '1fr 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Upcoming Events */}
        <div
          className="section-with-bg"
          style={{
            backgroundColor: eventsBackgroundColor || '#f7f3e8',
            borderRadius: 'var(--radius, 0.75rem)',
            padding: '2rem',
          }}
        >
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1.75rem',
              fontWeight: 700,
              color: headingColor,
              marginBottom: '1.5rem',
            }}
          >
            {eventsTitle}
          </h2>

          {validEvents.length === 0 ? (
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1.25rem',
                color: '#333333',
              }}
            >
              No upcoming events
            </p>
          ) : (
            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: '1.5rem',
                margin: 0,
              }}
            >
              {validEvents.map((event, index) => (
                <li
                  key={`${event.date}-${event.title}-${index}`}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '1.25rem',
                    lineHeight: 1.4,
                    marginBottom: '0.75rem',
                    color: '#333333',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#016f53' }}>
                    {formatEventDate(event.date)}
                  </span>
                  <span style={{ color: '#333333' }}>{' - '}{event.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Column: Birthdays */}
        <div
          className="section-with-bg"
          style={{
            backgroundColor: birthdaysBackgroundColor,
            borderRadius: 'var(--radius, 0.75rem)',
            padding: '2rem',
          }}
        >
          <h2
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: '1.75rem',
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#016f53',
              marginBottom: '1.5rem',
              lineHeight: 1.2,
            }}
          >
            {birthdaysTitle || `${monthName} Birthdays`}
          </h2>

          {currentMonthBirthdays.length === 0 ? (
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: '1.25rem',
                color: '#333333',
              }}
            >
              No birthdays this month
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentMonthBirthdays.map((birthday) => (
                <p
                  key={birthday._id}
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: '1.25rem',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#016f53' }}>{birthday.name}:</span>{' '}
                  <span style={{ color: '#333333' }}>{birthday.day} {monthAbbrev}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
