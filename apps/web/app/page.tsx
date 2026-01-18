'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { SectionRenderer } from '@azalea/sections';
import type { Section } from '@azalea/shared/types';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  // Fetch latest published issue
  const latestIssue = useQuery(api.issues.getLatestPublished);

  // Fetch sections for the latest issue
  const sections = useQuery(
    api.sections.listVisibleByIssue,
    latestIssue?._id ? { issueId: latestIssue._id } : 'skip'
  ) || [];

  // Format edition and date
  const formatEditionDate = (issue: typeof latestIssue) => {
    if (!issue) return '';
    const date = issue.bannerDate
      ? new Date(issue.bannerDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '';
    return `Edition ${issue.edition} | ${date}`;
  };

  return (
    <div className="page-background">
      {/* Fixed Header - matches Header.module.css */}
      <header className="site-header">
        <div className="header-content">
          <Link href="/" className="header-left">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--primary-color)' }}>
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <span className="header-title">Azalea Report</span>
          </Link>
          <nav className="desktop-nav">
            <Link href="/archives">Previous Issues</Link>
          </nav>
        </div>
      </header>

      {/* Header spacer for fixed header */}
      <div className="header-spacer">
        {/* Newsletter container - matches header width */}
        <div className="newsletter-container">
          {/* Banner Section - matches Banner.module.css structure */}
          <div className="banner-section">
            <div className="banner-content">
              <div className="banner-image-container">
                {(latestIssue as any)?.bannerImageUrl ? (
                  <img
                    src={(latestIssue as any).bannerImageUrl}
                    alt={latestIssue.title || 'Newsletter banner'}
                    className="banner-image"
                  />
                ) : (
                  <div
                    className="banner-image"
                    style={{
                      backgroundColor: 'var(--card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: 'var(--muted-foreground)' }}>Banner Image</span>
                  </div>
                )}
              </div>
              <div className="banner-overlay"></div>
              <div className="banner-text">
                <h1 className="banner-title">
                  {latestIssue?.bannerTitle || 'AZALEA REPORT'}
                </h1>
                <p className="banner-subtitle">
                  SGMC Health Internal Medicine Residency Newsletter
                </p>
                {latestIssue && (
                  <p className="banner-date">
                    {formatEditionDate(latestIssue)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - matches Layout.module.css */}
          <main className="main-content">
            {!latestIssue ? (
              <div className="section-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="animate-pulse">
                  <div className="h-8 rounded w-1/2 mx-auto mb-4" style={{ backgroundColor: 'var(--border)' }}></div>
                  <div className="h-4 rounded w-3/4 mx-auto" style={{ backgroundColor: 'var(--border)' }}></div>
                </div>
                <p className="mt-6" style={{ color: 'var(--muted-foreground)' }}>
                  Loading latest issue...
                </p>
              </div>
            ) : sections.length === 0 ? (
              <div className="section-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ fontSize: '1.3rem', color: 'var(--card-text)' }}>
                  No content available yet.
                </p>
                <p style={{ fontSize: '1rem', marginTop: '0.5rem', color: 'var(--muted)' }}>
                  Check back soon for updates!
                </p>
              </div>
            ) : (
              <div>
                {sections.map((section) => (
                  <SectionRenderer
                    key={section._id}
                    section={section as Section}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Footer - matches Footer.module.css */}
          <footer className="site-footer">
            <p>
              &copy; {new Date().getFullYear()} SGMC Internal Medicine Residency Program
            </p>
            <p style={{ marginTop: '0.25rem', opacity: 0.7 }}>
              Azalea Report Newsletter
            </p>
          </footer>
        </div>
      </div>

      {/* Theme Toggle - Sun/Moon icons like CMS */}
      <ThemeToggle />
    </div>
  );
}
