'use client';

import { useState } from 'react';
import { LuMonitor, LuTablet, LuSmartphone } from 'react-icons/lu';
import type { Issue, Section } from '@azalea/shared/types';
import { SectionRenderer } from '@azalea/sections';

interface PreviewPaneProps {
  issue: Issue;
  sections: Section[];
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

// CSS variables matching the original azaleareport.com
const previewStyles = {
  '--background-color': '#1a1a1a',
  '--bg-primary': '#1a1a1a',
  '--bg-secondary': '#212121',
  '--card-bg': '#f7f3e8', /* Light cream for section cards */
  '--card-bg-alt': '#FFE6D6', /* Peach/salmon for alternate sections */
  '--card-bg-green': '#e6f0ed', /* Light green tint */
  '--card-text': '#333333', /* Dark text for light card backgrounds */
  '--card-heading': '#016f53', /* Green headings */
  '--text-primary': '#ffffff',
  '--text-secondary': '#d4d4d4',
  '--text-muted': '#a3a3a3',
  '--text-dark': '#1a1a1a',
  '--text-dark-secondary': '#4a4a4a',
  '--accent-green': '#016f53',
  '--accent-green-light': '#34d399',
  '--border-color': '#333333',
} as React.CSSProperties;

export function PreviewPane({ issue, sections }: PreviewPaneProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  const viewportStyles = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] mx-auto',
    mobile: 'max-w-[375px] mx-auto',
  };

  const visibleSections = sections.filter((s) => s.visible);

  // Format edition and date
  const formatEditionDate = () => {
    if (!issue) return '';
    const date = issue.bannerDate
      ? new Date(issue.bannerDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '';
    return `Edition ${issue.edition || 1} | ${date}`;
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: 'rgb(var(--bg-secondary))',
        ...previewStyles
      }}
    >
      {/* Toolbar */}
      <div
        className="border-b p-4 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)'
        }}
      >
        <h3
          className="font-semibold"
          style={{
            color: 'var(--text-primary)',
            fontFamily: "'Playfair Display', Georgia, serif"
          }}
        >
          Preview
        </h3>

        {/* Viewport Toggles */}
        <div
          className="flex items-center gap-2 p-1 rounded-lg"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <button
            onClick={() => setViewport('desktop')}
            className="p-2 rounded transition-colors"
            style={{
              backgroundColor: viewport === 'desktop' ? 'var(--accent-green)' : 'transparent',
              color: viewport === 'desktop' ? '#ffffff' : 'var(--text-muted)',
            }}
            title="Desktop view"
          >
            <LuMonitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className="p-2 rounded transition-colors"
            style={{
              backgroundColor: viewport === 'tablet' ? 'var(--accent-green)' : 'transparent',
              color: viewport === 'tablet' ? '#ffffff' : 'var(--text-muted)',
            }}
            title="Tablet view"
          >
            <LuTablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className="p-2 rounded transition-colors"
            style={{
              backgroundColor: viewport === 'mobile' ? 'var(--accent-green)' : 'transparent',
              color: viewport === 'mobile' ? '#ffffff' : 'var(--text-muted)',
            }}
            title="Mobile view"
          >
            <LuSmartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area - Mimics the actual website layout */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className={`${viewportStyles[viewport]} transition-all duration-300`}>
          {/* Header Preview */}
          <header
            className="sticky top-0 z-50"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderBottom: '1px solid var(--border-color)'
            }}
          >
            <div className="max-w-[900px] mx-auto px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2" style={{ color: '#ffffff' }}>
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                  <span
                    className="text-xl font-semibold tracking-tight"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Azalea Report
                  </span>
                </div>
                <nav>
                  <span
                    className="font-medium"
                    style={{
                      color: '#ffffff',
                      fontFamily: "'Montserrat', sans-serif"
                    }}
                  >
                    Previous Issues
                  </span>
                </nav>
              </div>
            </div>
          </header>

          {/* Banner Preview */}
          <div className="max-w-[900px] mx-auto px-6">
            <div
              className="relative rounded-xl overflow-hidden my-6"
              style={{ minHeight: '400px' }}
            >
              {(issue as any).bannerImageUrl ? (
                <img
                  src={(issue as any).bannerImageUrl}
                  alt={issue.title || 'Newsletter banner'}
                  className="w-full h-auto object-cover"
                  style={{ minHeight: '400px' }}
                />
              ) : (
                <div
                  className="w-full flex items-center justify-center"
                  style={{
                    backgroundColor: '#2a2a2a',
                    minHeight: '400px',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Banner Image</span>
                </div>
              )}
              <div
                className="absolute bottom-0 left-0 right-0 p-8"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.6) 50%, transparent 100%)'
                }}
              >
                <h1
                  className="text-5xl font-bold uppercase tracking-wider mb-2"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: '#ffffff',
                    lineHeight: 1.1,
                    letterSpacing: '0.05em'
                  }}
                >
                  {issue.bannerTitle || 'AZALEA REPORT'}
                </h1>
                <p
                  className="text-xl font-medium mb-1"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: '#ffffff'
                  }}
                >
                  SGMC Health Internal Medicine Residency Newsletter
                </p>
                <p
                  className="text-base"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  {formatEditionDate()}
                </p>
              </div>
            </div>
          </div>

          {/* Sections Preview */}
          <section className="py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="max-w-[900px] mx-auto px-6">
              {visibleSections.length > 0 ? (
                <div className="newsletter-container">
                  {visibleSections.map((section) => (
                    <SectionRenderer
                      key={section._id}
                      section={section}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="section-card"
                  style={{
                    backgroundColor: 'var(--card-bg, #f7f3e8)',
                    borderRadius: '15px',
                    padding: '30px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ color: 'var(--card-text, #333333)', fontFamily: "'Georgia', serif" }}>No visible sections</p>
                  <p style={{ color: 'var(--card-text, #333333)', fontFamily: "'Georgia', serif", fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.7 }}>
                    Add sections to see preview
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Footer Preview */}
          <footer
            className="py-8 text-center"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border-color)'
            }}
          >
            <p style={{ color: 'var(--text-muted)' }}>
              &copy; {new Date().getFullYear()} SGMC Internal Medicine Residency Program
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--text-muted)', opacity: 0.7 }}
            >
              Azalea Report Newsletter
            </p>
          </footer>
        </div>
      </div>

      {/* Add Google Fonts and section styles for preview */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700&display=swap');

        .newsletter-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Section with background - always dark text */
        .section-with-bg,
        .section-with-bg p,
        .section-with-bg .basic-text,
        .section-with-bg .spotlight-text,
        .section-with-bg .spotlightText {
          color: #333333 !important;
        }

        .section-with-bg .basic-title,
        .section-with-bg .section-title,
        .section-with-bg h2,
        .section-with-bg h3,
        .section-with-bg strong {
          color: #016f53 !important;
        }

        /* Transparent section - white text in preview (dark bg) */
        .section-transparent,
        .section-transparent p,
        .section-transparent .basic-text,
        .section-transparent .basic-text * {
          color: #ffffff !important;
        }

        .section-transparent .basic-title,
        .section-transparent h2,
        .section-transparent strong {
          color: #016f53 !important;
        }

        /* Basic content section */
        .basic-content {
          background-color: #FFE6D6;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 2rem;
        }

        .basic-title {
          color: #016f53;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .basic-text {
          font-family: 'Georgia', serif;
          font-size: 1.3rem;
          line-height: 1.6;
        }

        .basic-author {
          font-style: italic;
          margin-top: 1.5rem;
        }

        /* Two column layout */
        .twoColumns {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .twoColumns .column {
          flex: 1;
        }

        .sectionTitle {
          color: #016f53;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .spotlightImage {
          width: 100%;
          max-width: 300px;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .spotlightName {
          color: #016f53;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.3rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .spotlightText {
          font-family: 'Georgia', serif;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .spotlightContainer {
          padding: 1.5rem;
          border-radius: 8px;
        }

        .featureImage {
          width: 100%;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .featureCaption {
          font-size: 0.9rem;
          font-style: italic;
          color: #666666;
        }

        .featureBullets {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 1rem;
        }

        .featureBullets li {
          margin-bottom: 0.5rem;
          font-family: 'Georgia', serif;
        }

        /* Chiefs/Interns sections */
        .chiefs-section,
        .interns-section {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          padding: 2rem;
          border-radius: 8px;
        }

        .chiefs-section {
          background-color: #f7f3e8;
        }

        .interns-section {
          background-color: rgb(221, 254, 233);
        }

        .chief-column,
        .intern-column {
          flex: 1;
          min-width: 250px;
          text-align: center;
        }

        .chief-image,
        .intern-image {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
        }

        .chief-name,
        .intern-name {
          color: #016f53 !important;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.3rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .chief-text,
        .intern-text {
          font-family: 'Georgia', serif;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #333333 !important;
        }

        /* Spotlight grid */
        .spotlight-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 2rem;
          align-items: start;
        }

        .spotlight-image {
          width: 250px;
          border-radius: 8px;
        }

        .spotlight-name {
          color: #016f53;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.3rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .spotlight-text {
          font-family: 'Georgia', serif;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        /* Section title */
        .section-title {
          color: #016f53;
          font-family: 'Montserrat', sans-serif;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        /* Text image grid */
        .text-image-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        /* Toggle button for ShowMore */
        .toggle-button {
          background-color: #016f53;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          margin-top: 1rem;
        }

        .toggle-button:hover {
          background-color: #014d3a;
        }

        /* Feature image container */
        .featureImageContainer {
          margin-bottom: 1rem;
        }

        /* Community Service section - float layout for text wrapping */
        .community-service-image {
          margin-bottom: 1rem;
          max-width: 45%;
        }
        .community-service-image.float-left {
          float: left;
          margin-right: 1.5rem;
        }
        .community-service-image.float-right {
          float: right;
          margin-left: 1.5rem;
        }
        .community-service-image img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          object-fit: cover;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .twoColumns {
            flex-direction: column;
          }

          .spotlight-grid {
            grid-template-columns: 1fr;
          }

          .text-image-grid {
            grid-template-columns: 1fr;
          }

          /* Community Service image stacks on mobile */
          .community-service-image,
          .community-service-image.float-left,
          .community-service-image.float-right {
            float: none;
            max-width: 100%;
            margin-right: 0;
            margin-left: 0;
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
