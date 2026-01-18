'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { SectionRenderer } from '@azalea/sections';
import type { Section, Issue } from '@azalea/shared/types';

export default function HomePage() {
  // Fetch latest published issue
  const latestIssue = useQuery(api.issues.getLatestPublished);

  // Fetch sections for the latest issue
  const sections = useQuery(
    api.sections.listVisibleByIssue,
    latestIssue?._id ? { issueId: latestIssue._id } : 'skip'
  ) || [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-azalea-green text-white py-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold hover:text-azalea-peach transition-colors">
              Azalea Report
            </Link>
            <nav className="flex gap-6">
              <Link href="/archives" className="hover:text-azalea-peach transition-colors">
                Archives
              </Link>
              <Link href="/about" className="hover:text-azalea-peach transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Banner Section */}
      {latestIssue ? (
        <section className="bg-azalea-peach py-12 border-b-4 border-azalea-green">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              {latestIssue.bannerTitle || 'AZALEA REPORT'}
            </h1>
            <p className="text-xl text-gray-700 mb-2">
              {latestIssue.title}
            </p>
            {latestIssue.bannerDate && (
              <p className="text-md text-gray-600">
                {new Date(latestIssue.bannerDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </section>
      ) : (
        <section className="bg-azalea-peach py-16 border-b-4 border-azalea-green">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              AZALEA REPORT
            </h1>
            <p className="text-xl text-gray-700">
              The official newsletter of the SGMC Internal Medicine Residency Program
            </p>
          </div>
        </section>
      )}

      {/* Issue Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {!latestIssue ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
              <p className="text-gray-600 mt-6">
                Loading latest issue...
              </p>
            </div>
          ) : sections.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">
                No content available yet.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Check back soon for updates!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {sections.map((section) => (
                <SectionRenderer
                  key={section._id}
                  section={section as Section}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Archives Link */}
      {latestIssue && (
        <section className="py-8 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 text-center">
            <Link
              href="/archives"
              className="inline-flex items-center gap-2 text-azalea-green hover:text-azalea-green-hover font-semibold text-lg transition-colors"
            >
              View All Issues
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} SGMC Internal Medicine Residency Program
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Azalea Report Newsletter
          </p>
        </div>
      </footer>
    </main>
  );
}
