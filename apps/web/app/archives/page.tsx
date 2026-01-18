'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Issue } from '@azalea/shared/types';

export default function ArchivesPage() {
  // Fetch all published issues
  const allIssues = useQuery(api.issues.list, { status: 'published' }) || [];

  // Sort by edition (newest first)
  const sortedIssues = [...allIssues].sort((a, b) => b.edition - a.edition);

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
              <Link href="/archives" className="text-azalea-peach font-semibold">
                Archives
              </Link>
              <Link href="/about" className="hover:text-azalea-peach transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-azalea-peach py-12 border-b-4 border-azalea-green">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Archives
          </h1>
          <p className="text-lg text-gray-700">
            Browse all published issues of the Azalea Report
          </p>
        </div>
      </section>

      {/* Archives List */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {sortedIssues.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">
                No published issues yet.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Check back soon for updates!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedIssues.map((issue) => (
                <Link
                  key={issue._id}
                  href={`/archives/${issue.slug}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-block px-3 py-1 bg-azalea-green text-white text-sm font-semibold rounded">
                            Edition {issue.edition}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(issue.publishedAt || issue.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-azalea-green transition-colors">
                          {issue.title}
                        </h2>

                        {issue.bannerDate && (
                          <p className="text-sm text-gray-600">
                            Published: {new Date(issue.bannerDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                            })}
                          </p>
                        )}
                      </div>

                      <div className="ml-4">
                        <svg
                          className="w-6 h-6 text-gray-400 group-hover:text-azalea-green transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
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
