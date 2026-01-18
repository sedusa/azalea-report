import type { AboutSectionData } from '@azalea/shared/types';

interface AboutSectionProps {
  data: AboutSectionData;
}

/**
 * AboutSection - Welcome/About section for the newsletter
 * Used as the hero/intro block - matches BasicSection.module.css
 */
export function AboutSection({ data }: AboutSectionProps) {
  const { sectionTitle = 'Welcome', content, signature } = data;

  return (
    <section className="basic-content" style={{ marginBottom: '2rem' }}>
      {sectionTitle && (
        <h2 className="basic-title">
          {sectionTitle}
        </h2>
      )}
      <div
        className="basic-text"
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
