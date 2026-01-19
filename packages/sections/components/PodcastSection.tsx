'use client';

import type { PodcastSectionData, PodcastEpisode } from '@azalea/shared/types';

interface PodcastSectionProps {
  data: PodcastSectionData;
  backgroundColor?: string;
}

/**
 * PodcastSection - Displays featured podcast episodes with links to listen
 * Features a podcast-themed design with soundwave decorations
 * Supports multiple episodes with customizable button text
 */
export function PodcastSection({ data, backgroundColor }: PodcastSectionProps) {
  const { sectionTitle = 'Podcasts', title, subtitle, episodes = [] } = data;

  // When backgroundColor is set, use dark text for readability on pastel backgrounds
  const hasBackground = !!backgroundColor;

  // Text colors based on background
  const headingColor = '#016f53';
  const titleColor = hasBackground ? '#333333' : 'var(--foreground)';
  const subtitleColor = hasBackground ? '#666666' : 'var(--muted-foreground)';
  const textColor = hasBackground ? '#333333' : 'var(--foreground)';

  // Filter out empty episodes
  const validEpisodes = episodes.filter(ep => ep.title || ep.description);

  return (
    <section
      className={hasBackground ? 'section-card section-with-bg' : 'section-transparent'}
      style={{
        marginBottom: '2rem',
        backgroundColor: backgroundColor || 'transparent',
        borderRadius: hasBackground ? 'var(--radius, 0.75rem)' : undefined,
        padding: hasBackground ? '2rem' : undefined,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative soundwave pattern (subtle background) */}
      <div
        className="podcast-soundwave-bg"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '200px',
          opacity: 0.05,
          pointerEvents: 'none',
          background: `repeating-linear-gradient(
            90deg,
            ${headingColor} 0px,
            ${headingColor} 3px,
            transparent 3px,
            transparent 8px
          )`,
          maskImage: 'linear-gradient(to left, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
        }}
      />

      {/* Section Title */}
      {sectionTitle && (
        <h2
          className="section-title"
          style={{
            color: headingColor,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            position: 'relative',
          }}
        >
          {sectionTitle}
        </h2>
      )}

      {/* Podcast Series Title */}
      {title && (
        <h3
          style={{
            color: titleColor,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.4rem',
            fontWeight: 'bold',
            marginBottom: '0.25rem',
            position: 'relative',
          }}
        >
          {title}
        </h3>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            color: subtitleColor,
            fontFamily: "'Georgia', serif",
            fontSize: '1rem',
            marginBottom: '2rem',
            position: 'relative',
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Episodes */}
      {validEpisodes.length > 0 && (
        <div className="podcast-episodes" style={{ position: 'relative' }}>
          {validEpisodes.map((episode, index) => (
            <EpisodeCard
              key={index}
              episode={episode}
              hasBackground={hasBackground}
              textColor={textColor}
              headingColor={headingColor}
              isLast={index === validEpisodes.length - 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface EpisodeCardProps {
  episode: PodcastEpisode;
  hasBackground: boolean;
  textColor: string;
  headingColor: string;
  isLast: boolean;
}

function EpisodeCard({ episode, hasBackground, textColor, headingColor, isLast }: EpisodeCardProps) {
  const { title, description, buttonUrl, buttonText } = episode;

  return (
    <div
      className="podcast-episode"
      style={{
        marginBottom: isLast ? 0 : '2rem',
        paddingBottom: isLast ? 0 : '2rem',
        borderBottom: isLast ? 'none' : `1px solid ${hasBackground ? 'rgba(0,0,0,0.1)' : 'var(--border)'}`,
      }}
    >
      {/* Episode Title */}
      {title && (
        <h4
          style={{
            color: headingColor,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '0.75rem',
          }}
        >
          {title}
        </h4>
      )}

      {/* Description */}
      {description && (
        <p
          className="basic-text"
          style={{
            color: textColor,
            fontFamily: "'Georgia', serif",
            fontSize: '1.2rem',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}
        >
          {description}
        </p>
      )}

      {/* Listen Button */}
      {buttonUrl && buttonText && (
        <a
          href={buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="podcast-listen-button"
          style={{
            display: 'block',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            border: `2px solid ${headingColor}`,
            backgroundColor: hasBackground ? 'rgba(255,255,255,0.8)' : 'var(--card)',
            color: headingColor,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '1rem',
            fontWeight: 600,
            textAlign: 'center',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = headingColor;
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = hasBackground ? 'rgba(255,255,255,0.8)' : 'var(--card)';
            e.currentTarget.style.color = headingColor;
          }}
        >
          {buttonText}
        </a>
      )}
    </div>
  );
}
