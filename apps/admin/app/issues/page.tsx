'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button, Input, Card } from '@azalea/ui';
import { toast } from 'sonner';
import { LuPlus, LuFileText, LuClock, LuCheckCircle, LuArchive, LuSearch, LuArrowLeft, LuLogOut } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function IssuesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowLogoutConfirm(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Queries
  const allIssues = useQuery(api.issues.list, {}) || [];

  // Mutations
  const createIssue = useMutation(api.issues.create);

  // Filter issues
  const filteredIssues = allIssues.filter((issue) => {
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchesSearch = searchQuery
      ? issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.edition.toString().includes(searchQuery)
      : true;
    return matchesStatus && matchesSearch;
  });

  // Sort by updated date (newest first)
  const sortedIssues = [...filteredIssues].sort((a, b) => b.updatedAt - a.updatedAt);

  const handleCreateIssue = async () => {
    try {
      // Get next edition number
      const maxEdition = allIssues.reduce((max, issue) => Math.max(max, issue.edition), 0);
      const nextEdition = maxEdition + 1;

      const newIssueId = await createIssue({
        title: `Edition ${nextEdition}`,
        edition: nextEdition,
        bannerTitle: 'AZALEA REPORT',
        bannerDate: new Date().toISOString().split('T')[0],
        userId: 'temp-user-id' as Id<'users'>, // TODO: Replace with real user ID
      });

      toast.success('Issue created');
      router.push(`/issues/${newIssueId}`);
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Failed to create issue');
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'rgb(var(--bg-primary))' }}>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
            style={{ backgroundColor: 'rgb(var(--bg-secondary))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
              >
                <LuLogOut className="w-6 h-6" style={{ color: 'rgb(239 68 68)' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                  Confirm Logout
                </h3>
                <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Are you sure you want to logout?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </Button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm"
                style={{ backgroundColor: 'rgb(239 68 68)', color: 'white' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="admin-header flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="btn-ghost flex items-center gap-2">
            <LuArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <div className="border-l pl-4" style={{ borderColor: 'rgb(var(--border-primary))' }}>
            <h1 className="text-xl font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
              Issues
            </h1>
            <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
              {sortedIssues.length} issue{sortedIssues.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleCreateIssue}>
            <LuPlus className="w-4 h-4 mr-2" />
            New Issue
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="btn-ghost"
            title="Logout"
            aria-label="Logout"
          >
            <LuLogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Filters */}
      <div
        className="border-b px-6 py-4"
        style={{
          backgroundColor: 'rgb(var(--bg-secondary))',
          borderColor: 'rgb(var(--border-primary))'
        }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <LuSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: 'rgb(var(--text-tertiary))' }}
            />
            <Input
              type="text"
              placeholder="Search by title or edition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors font-medium ${
                filterStatus === 'all'
                  ? 'text-white'
                  : ''
              }`}
              style={{
                backgroundColor: filterStatus === 'all' ? 'rgb(var(--accent-primary))' : 'rgb(var(--bg-accent))',
                color: filterStatus === 'all' ? 'white' : 'rgb(var(--text-primary))'
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors font-medium ${
                filterStatus === 'draft'
                  ? 'bg-yellow-500 text-white'
                  : ''
              }`}
              style={{
                backgroundColor: filterStatus === 'draft' ? 'rgb(251 191 36)' : 'rgb(var(--bg-accent))',
                color: filterStatus === 'draft' ? 'white' : 'rgb(var(--text-primary))'
              }}
            >
              Drafts
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors font-medium ${
                filterStatus === 'published'
                  ? 'bg-green-500 text-white'
                  : ''
              }`}
              style={{
                backgroundColor: filterStatus === 'published' ? 'rgb(34 197 94)' : 'rgb(var(--bg-accent))',
                color: filterStatus === 'published' ? 'white' : 'rgb(var(--text-primary))'
              }}
            >
              Published
            </button>
            <button
              onClick={() => setFilterStatus('archived')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors font-medium ${
                filterStatus === 'archived'
                  ? 'bg-gray-500 text-white'
                  : ''
              }`}
              style={{
                backgroundColor: filterStatus === 'archived' ? 'rgb(107 114 128)' : 'rgb(var(--bg-accent))',
                color: filterStatus === 'archived' ? 'white' : 'rgb(var(--text-primary))'
              }}
            >
              Archived
            </button>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          {sortedIssues.length === 0 ? (
            <div
              className="text-center py-12 rounded-lg border-2 border-dashed"
              style={{
                backgroundColor: 'rgb(var(--bg-secondary))',
                borderColor: 'rgb(var(--border-accent))'
              }}
            >
              <LuFileText className="mx-auto h-12 w-12" style={{ color: 'rgb(var(--text-tertiary))' }} />
              <h3 className="mt-2 text-sm font-medium" style={{ color: 'rgb(var(--text-primary))' }}>
                {searchQuery || filterStatus !== 'all' ? 'No issues found' : 'No issues yet'}
              </h3>
              <p className="mt-1 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first issue'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateIssue}
                  className="mt-4"
                >
                  <LuPlus className="w-4 h-4 mr-2" />
                  Create First Issue
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedIssues.map((issue) => (
                <Link key={issue._id} href={`/issues/${issue._id}`}>
                  <div
                    className="admin-card p-5 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                            {issue.title || 'Untitled Issue'}
                          </h3>
                          <span className={`status-badge ${issue.status}`}>
                            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                          <span className="flex items-center gap-1">
                            <LuFileText className="w-4 h-4" />
                            Edition #{issue.edition}
                          </span>
                          <span className="flex items-center gap-1">
                            <LuClock className="w-4 h-4" />
                            Updated {new Date(issue.updatedAt).toLocaleDateString()}
                          </span>
                          {issue.publishedAt && (
                            <span className="flex items-center gap-1">
                              <LuCheckCircle className="w-4 h-4" />
                              Published {new Date(issue.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ml-4">
                        <svg
                          className="w-5 h-5"
                          style={{ color: 'rgb(var(--text-tertiary))' }}
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
      </div>
    </div>
  );
}
