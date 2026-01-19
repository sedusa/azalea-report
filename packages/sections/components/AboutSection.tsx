import type { AboutSectionData } from '@azalea/shared/types';

interface AboutSectionProps {
  data: AboutSectionData;
  backgroundColor?: string;
}

/**
 * AboutSection - Welcome/About section for the newsletter
 * Used as the hero/intro block - matches BasicSection.module.css
 */
export function AboutSection({ data, backgroundColor }: AboutSectionProps) {
  const { sectionTitle = 'Welcome', content, signature } = data;

  // When no backgroundColor is set, use transparent class for proper dark mode text colors
  const hasBackground = !!backgroundColor;

  return (
    <section
      className={hasBackground ? 'basic-content section-with-bg' : 'section-transparent'}
      style={{
        marginBottom: '2rem',
        backgroundColor: backgroundColor || 'transparent',
        borderRadius: hasBackground ? 'var(--radius, 0.75rem)' : undefined,
        padding: hasBackground ? '2rem' : undefined,
      }}
    >
      {sectionTitle && (
        <h2 className="basic-title">
          {sectionTitle}
        </h2>
      )}
      <div
        className="basic-text"
        style={hasBackground ? { color: '#333333' } : {}}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {signature && (
        <p className="basic-author" style={{ marginTop: '1.5rem', fontStyle: 'italic' }}>
          — {signature}
        </p>
      )}
    </section>
  );
}
