'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { SectionRenderer } from '@azalea/sections';
import type { Section } from '@azalea/shared/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import { notFound } from 'next/navigation';

interface ArchivePageProps {
  params: {
    slug: string;
  };
}

export default function ArchivePage({ params }: ArchivePageProps) {
  const { slug } = params;

  // Fetch issue by slug
  const issue = useQuery(api.issues.getBySlug, { slug });

  // Fetch sections for this issue
  const sections = useQuery(
    api.sections.listVisibleByIssue,
    issue?._id ? { issueId: issue._id } : 'skip'
  ) || [];

  // If issue is not found and not loading, show 404
  if (issue === null) {
    notFound();
  }

  // Format edition and date
  const formatEditionDate = () => {
    if (!issue) return '';
    const date = issue.bannerDate
      ? new Date(issue.bannerDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '';
    return `Edition ${issue.edition} | ${date}`;
  };

  return (
    <div className="page-background">
      {/* Fixed Header - same as main page */}
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
        <div className="newsletter-container">
          {/* Back to Archives Link - Above Banner */}
          <Link
            href="/archives"
            className="back-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--foreground)',
              textDecoration: 'none',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1rem',
              marginBottom: '1rem',
              padding: '0.5rem 0',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Archives
          </Link>

          {/* Banner Section */}
          <div className="banner-section">
            <div className="banner-content">
              <div className="banner-image-container">
                {(issue as any)?.bannerImageUrl ? (
                  <img
                    src={(issue as any).bannerImageUrl}
                    alt={issue?.title || 'Newsletter banner'}
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
                  {issue?.bannerTitle || 'AZALEA REPORT'}
                </h1>
                <p className="banner-subtitle">
                  SGMC Health Internal Medicine Residency Newsletter
                </p>
                {issue && (
                  <p className="banner-date">
                    {formatEditionDate()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="main-content">
            {!issue ? (
              <div className="section-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="animate-pulse">
                  <div className="h-8 rounded w-1/2 mx-auto mb-4" style={{ backgroundColor: 'var(--border)' }}></div>
                  <div className="h-4 rounded w-3/4 mx-auto" style={{ backgroundColor: 'var(--border)' }}></div>
                </div>
                <p className="mt-6" style={{ color: 'var(--muted-foreground)' }}>
                  Loading issue...
                </p>
              </div>
            ) : sections.length === 0 ? (
              <div className="section-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ fontSize: '1.3rem', color: 'var(--card-text)' }}>
                  No content available for this issue.
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

          {/* Footer */}
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

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}
