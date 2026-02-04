'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { toast } from 'sonner';
import { LuFileText, LuCopy, LuArrowLeft, LuClock, LuCheckCircle, LuArchive } from 'react-icons/lu';

type ViewState = 'choice' | 'pick-source' | 'creating';

export default function NewIssuePage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>('choice');

  const allIssues = useQuery(api.issues.list, {});
  const createBlank = useMutation(api.issues.createBlank);
  const cloneFrom = useMutation(api.issues.cloneFrom);

  const handleCreateBlank = async () => {
    setView('creating');
    try {
      const newIssueId = await createBlank({});
      toast.success('Blank issue created');
      router.replace(`/issues/${newIssueId}`);
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Failed to create issue');
      setView('choice');
    }
  };

  const handleCloneFrom = async (sourceIssueId: Id<'issues'>) => {
    setView('creating');
    try {
      const newIssueId = await cloneFrom({ sourceIssueId });
      toast.success('Issue cloned successfully');
      router.replace(`/issues/${newIssueId}`);
    } catch (error) {
      console.error('Clone error:', error);
      toast.error('Failed to clone issue');
      setView('pick-source');
    }
  };

  // Sort issues by edition descending for the picker
  const sortedIssues = allIssues
    ? [...allIssues].sort((a, b) => b.edition - a.edition)
    : [];

  const statusColor = (status: string) => {
    switch (status) {
      case 'published': return 'rgb(34 197 94)';
      case 'draft': return 'rgb(251 191 36)';
      case 'archived': return 'rgb(107 114 128)';
      default: return 'rgb(var(--text-secondary))';
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'published': return <LuCheckCircle className="w-3.5 h-3.5" />;
      case 'archived': return <LuArchive className="w-3.5 h-3.5" />;
      default: return <LuFileText className="w-3.5 h-3.5" />;
    }
  };

  // Creating spinner
  if (view === 'creating') {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: 'rgb(var(--bg-primary))' }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: 'rgb(var(--accent-primary))' }}
          />
          <p style={{ color: 'rgb(var(--text-secondary))' }}>
            Creating new issue...
          </p>
        </div>
      </div>
    );
  }

  // Pick source view
  if (view === 'pick-source') {
    return (
      <div
        className="h-screen flex flex-col"
        style={{ backgroundColor: 'rgb(var(--bg-primary))' }}
      >
        {/* Header */}
        <header
          className="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0"
          style={{
            backgroundColor: 'rgb(var(--bg-secondary))',
            borderColor: 'rgb(var(--border-primary))',
          }}
        >
          <button
            onClick={() => setView('choice')}
            className="btn-ghost flex items-center gap-2"
          >
            <LuArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="border-l pl-4" style={{ borderColor: 'rgb(var(--border-primary))' }}>
            <h1 className="text-xl font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
              Choose Issue to Clone
            </h1>
            <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
              Select an issue to use as a template
            </p>
          </div>
        </header>

        {/* Issue list */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-3">
            {!allIssues ? (
              <div className="text-center py-12">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-3"
                  style={{ borderColor: 'rgb(var(--accent-primary))' }}
                />
                <p style={{ color: 'rgb(var(--text-secondary))' }}>Loading issues...</p>
              </div>
            ) : sortedIssues.length === 0 ? (
              <div className="text-center py-12">
                <LuFileText className="mx-auto h-12 w-12" style={{ color: 'rgb(var(--text-tertiary))' }} />
                <p className="mt-2" style={{ color: 'rgb(var(--text-secondary))' }}>
                  No issues available to clone
                </p>
              </div>
            ) : (
              sortedIssues.map((issue) => (
                <button
                  key={issue._id}
                  onClick={() => handleCloneFrom(issue._id)}
                  className="w-full text-left admin-card p-5 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                          {issue.title || 'Untitled Issue'}
                        </h3>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: `${statusColor(issue.status)}20`,
                            color: statusColor(issue.status),
                          }}
                        >
                          <StatusIcon status={issue.status} />
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
                      </div>
                    </div>
                    <div className="ml-4">
                      <LuCopy className="w-5 h-5" style={{ color: 'rgb(var(--text-tertiary))' }} />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Choice view (default)
  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: 'rgb(var(--bg-primary))' }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0"
        style={{
          backgroundColor: 'rgb(var(--bg-secondary))',
          borderColor: 'rgb(var(--border-primary))',
        }}
      >
        <Link href="/issues" className="btn-ghost flex items-center gap-2">
          <LuArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <div className="border-l pl-4" style={{ borderColor: 'rgb(var(--border-primary))' }}>
          <h1 className="text-xl font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
            New Issue
          </h1>
          <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
            How would you like to start?
          </p>
        </div>
      </header>

      {/* Choice cards */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
          {/* Blank Issue */}
          <button
            onClick={handleCreateBlank}
            className="admin-card p-8 cursor-pointer text-center transition-all hover:scale-[1.02] group"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors"
              style={{ backgroundColor: 'rgba(var(--accent-primary), 0.1)' }}
            >
              <LuFileText className="w-8 h-8" style={{ color: 'rgb(var(--accent-primary))' }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
              Create Blank Issue
            </h3>
            <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
              Start fresh with an empty issue. Add sections manually as you build your edition.
            </p>
          </button>

          {/* Clone Issue */}
          <button
            onClick={() => setView('pick-source')}
            className="admin-card p-8 cursor-pointer text-center transition-all hover:scale-[1.02] group"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors"
              style={{ backgroundColor: 'rgba(var(--accent-primary), 0.1)' }}
            >
              <LuCopy className="w-8 h-8" style={{ color: 'rgb(var(--accent-primary))' }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
              Clone an Issue
            </h3>
            <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
              Copy all sections from an existing issue as a starting point for the new edition.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
