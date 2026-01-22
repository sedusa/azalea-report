'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { ThemeToggle } from '@/components/ThemeToggle';
import Logo from '@/components/Logo';

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
            <div className="header-logo">
              <Logo color="currentColor" />
            </div>
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
