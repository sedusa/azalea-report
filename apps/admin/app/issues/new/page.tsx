'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { toast } from 'sonner';

export default function NewIssuePage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const createFromLatest = useMutation(api.issues.createFromLatest);

  useEffect(() => {
    // Create new issue by cloning from latest
    if (!isCreating) {
      setIsCreating(true);

      const createNewIssue = async () => {
        try {
          // Create new issue cloned from the latest one
          const newIssueId = await createFromLatest({});

          toast.success('Issue created from previous edition');
          router.replace(`/issues/${newIssueId}`);
        } catch (error) {
          console.error('Create error:', error);
          toast.error('Failed to create issue');
          router.replace('/issues');
        }
      };

      createNewIssue();
    }
  }, [isCreating, createFromLatest, router]);

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
          Creating new issue from previous edition...
        </p>
      </div>
    </div>
  );
}
