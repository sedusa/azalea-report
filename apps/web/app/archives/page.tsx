'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ArchivesPage() {
  // Fetch all published issues
  const allIssues = useQuery(api.issues.list, { status: 'published' }) || [];

  // Sort by edition (oldest first for display)
  const sortedIssues = [...allIssues].sort((a, b) => a.edition - b.edition);

  // Format issue display text
  const formatIssueText = (issue: typeof allIssues[0]) => {
    if (issue.bannerDate) {
      const date = new Date(issue.bannerDate);
      const month = date.toLocaleDateString('en-US', { month: 'long' });
      const year = date.getFullYear();
      return `Issue ${issue.edition} - ${month} ${year}`;
    }
    return `Issue ${issue.edition}`;
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
          {/* Archives Content */}
          <main className="archives-content">
            <h1 className="archives-title">Newsletter Archives</h1>
            <hr className="archives-divider" />

            {sortedIssues.length === 0 ? (
              <p className="archives-empty">
                No published issues yet. Check back soon!
              </p>
            ) : (
              <ul className="archives-list">
                {sortedIssues.map((issue) => (
                  <li key={issue._id}>
                    <Link href={`/archives/${issue.slug}`} className="archives-link">
                      {formatIssueText(issue)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </main>

          {/* Footer - same as main page */}
          <footer className="site-footer">
            <p>
              &copy; {new Date().getFullYear()} Azalea Report - SGMC Health Internal Medicine Residency Newsletter
            </p>
          </footer>
        </div>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}
