'use client';

import type { BirthdaysSectionData } from '@azalea/shared/types';

interface BirthdaysSectionProps {
  data: BirthdaysSectionData;
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
 * BirthdaysSection - Displays birthdays for the current month
 * Birthdays are passed via the data prop (populated by parent from Convex)
 */
export function BirthdaysSection({ data, backgroundColor }: BirthdaysSectionProps) {
  // Always use current month
  const currentMonth = new Date().getMonth() + 1; // 1-12

  // Get birthdays from data (filtered by current month)
  const allBirthdays = data.birthdays || [];
  const birthdays = allBirthdays.filter(b => b.month === currentMonth);

  // Sort birthdays by day
  const sortedBirthdays = [...birthdays].sort((a, b) => a.day - b.day);

  // Get month name for title
  const monthName = MONTH_NAMES[currentMonth - 1];
  const monthAbbrev = MONTH_ABBREV[currentMonth - 1];

  // Default yellow background like in the screenshot
  const bgColor = backgroundColor || '#E8C840';

  return (
    <section
      className="birthdays-section section-with-bg"
      style={{
        backgroundColor: bgColor,
        borderRadius: 'var(--radius, 0.75rem)',
        padding: '2rem',
        marginBottom: '2rem',
      }}
    >
      {/* Section Title */}
      <h2
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: '1.75rem',
          fontWeight: 700,
          fontStyle: 'italic',
          color: '#333333',
          marginBottom: '1.5rem',
          lineHeight: 1.2,
        }}
      >
        {data.sectionTitle || `${monthName} Birthdays`}
      </h2>

      {/* Birthdays List */}
      {sortedBirthdays.length === 0 ? (
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: '1.1rem',
            color: '#333333',
          }}
        >
          No birthdays this month
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedBirthdays.map((birthday) => (
            <p
              key={birthday._id}
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: '1.25rem',
                color: '#333333',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              <strong style={{ fontWeight: 700 }}>{birthday.name}:</strong>{' '}
              {birthday.day} {monthAbbrev}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
