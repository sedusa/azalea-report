'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { SectionRenderer } from '@azalea/sections';
import type { Section } from '@azalea/shared/types';
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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-azalea-green text-white py-6 shadow-md">
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
      {issue ? (
        <section className="bg-azalea-peach py-12 border-b-4 border-azalea-green">
          <div className="container mx-auto px-4">
            {/* Back to Archives Link */}
            <Link
              href="/archives"
              className="inline-flex items-center gap-2 text-azalea-green hover:text-azalea-green-hover font-medium mb-6 transition-colors"
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

            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                {issue.bannerTitle || 'AZALEA REPORT'}
              </h1>
              <p className="text-xl text-gray-700 mb-2">
                {issue.title}
              </p>
              {issue.bannerDate && (
                <p className="text-md text-gray-600">
                  {new Date(issue.bannerDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              <div className="mt-4">
                <span className="inline-block px-4 py-2 bg-azalea-green text-white font-semibold rounded-full">
                  Edition {issue.edition}
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-azalea-peach py-16 border-b-4 border-azalea-green">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </section>
      )}

      {/* Issue Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {!issue ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
              <p className="text-gray-600 mt-6">
                Loading issue...
              </p>
            </div>
          ) : sections.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">
                No content available for this issue.
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
