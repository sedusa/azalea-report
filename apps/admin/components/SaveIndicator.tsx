'use client';

import { LuCheck, LuLoader2, LuAlertCircle, LuCircleDot } from 'react-icons/lu';
import type { SaveStatus } from '../hooks/usePendingChanges';

interface SaveIndicatorProps {
  status: SaveStatus;
  lastSavedAt: Date | null;
}

export function SaveIndicator({ status, lastSavedAt }: SaveIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (status === 'idle' && !lastSavedAt) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === 'saving' && (
        <>
          <LuLoader2 className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-gray-600">Saving...</span>
        </>
      )}

      {status === 'saved' && lastSavedAt && (
        <>
          <LuCheck className="w-4 h-4 text-green-600" />
          <span className="text-gray-600">
            Saved at {formatTime(lastSavedAt)}
          </span>
        </>
      )}

      {status === 'unsaved' && (
        <>
          <LuCircleDot className="w-4 h-4 text-amber-500" />
          <span className="text-amber-600 font-medium">Unsaved changes</span>
        </>
      )}

      {status === 'error' && (
        <>
          <LuAlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-red-600">Save failed</span>
        </>
      )}

      {status === 'idle' && lastSavedAt && (
        <span className="text-gray-500 text-xs">
          Last saved {formatTime(lastSavedAt)}
        </span>
      )}
    </div>
  );
}
