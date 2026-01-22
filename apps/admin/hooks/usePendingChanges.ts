import { useState, useCallback, useRef, useEffect } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved' | 'error';

interface PendingSectionUpdate {
  sectionId: string;
  data: Record<string, unknown>;
  previousData?: Record<string, unknown>;
}

interface PendingBackgroundColorUpdate {
  sectionId: string;
  color: string | undefined;
}

interface UsePendingChangesOptions<T> {
  initialData: T;
  onSave: (data: T, sectionUpdates: PendingSectionUpdate[], backgroundUpdates: PendingBackgroundColorUpdate[]) => Promise<void>;
}

/**
 * Hook for tracking pending changes that only save when explicitly triggered.
 * Provides local state management with unsaved changes indicator.
 */
export function usePendingChanges<T extends Record<string, unknown>>({
  initialData,
  onSave,
}: UsePendingChangesOptions<T>) {
  const [localData, setLocalData] = useState<T>(initialData);
  const [pendingSectionUpdates, setPendingSectionUpdates] = useState<Map<string, PendingSectionUpdate>>(new Map());
  const [pendingBackgroundUpdates, setPendingBackgroundUpdates] = useState<Map<string, PendingBackgroundColorUpdate>>(new Map());
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const initialDataRef = useRef<T>(initialData);
  const hasInitialized = useRef(false);

  // Track if there are unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    // Check if banner data has changed
    const bannerChanged = JSON.stringify(localData) !== JSON.stringify(initialDataRef.current);
    // Check if there are pending section updates
    const sectionsChanged = pendingSectionUpdates.size > 0 || pendingBackgroundUpdates.size > 0;
    return bannerChanged || sectionsChanged;
  }, [localData, pendingSectionUpdates, pendingBackgroundUpdates]);

  // Update status based on changes
  useEffect(() => {
    if (status !== 'saving' && status !== 'saved') {
      if (hasUnsavedChanges()) {
        setStatus('unsaved');
      } else {
        setStatus('idle');
      }
    }
  }, [localData, pendingSectionUpdates, pendingBackgroundUpdates, status, hasUnsavedChanges]);

  // Sync initial data when it changes (e.g., issue data loads or switching issues)
  useEffect(() => {
    // Check if this is an actual change with meaningful data
    const hasData = Object.values(initialData).some(v => v !== '' && v !== null && v !== undefined);
    const currentHasData = Object.values(initialDataRef.current).some(v => v !== '' && v !== null && v !== undefined);

    // If new data has values and is different from current, sync it
    if (hasData && JSON.stringify(initialData) !== JSON.stringify(initialDataRef.current)) {
      setLocalData(initialData);
      initialDataRef.current = initialData;
      // Only reset pending updates if we're switching to completely different data (not initial load)
      if (currentHasData) {
        setPendingSectionUpdates(new Map());
        setPendingBackgroundUpdates(new Map());
      }
      setStatus('idle');
    }
  }, [initialData]);

  // Update local banner data
  const updateLocalData = useCallback((updates: Partial<T>) => {
    setLocalData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Queue a section update (stores locally, doesn't save to Convex)
  const queueSectionUpdate = useCallback((sectionId: string, data: Record<string, unknown>, previousData?: Record<string, unknown>) => {
    setPendingSectionUpdates((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(sectionId);
      newMap.set(sectionId, {
        sectionId,
        data,
        // Keep the original previousData if we already have a pending update
        previousData: existing?.previousData || previousData,
      });
      return newMap;
    });
  }, []);

  // Queue a background color update
  const queueBackgroundColorUpdate = useCallback((sectionId: string, color: string | undefined) => {
    setPendingBackgroundUpdates((prev) => {
      const newMap = new Map(prev);
      newMap.set(sectionId, { sectionId, color });
      return newMap;
    });
  }, []);

  // Save all pending changes to Convex
  const saveNow = useCallback(async () => {
    if (status === 'saving') return;

    // Check if there are changes to save
    if (!hasUnsavedChanges()) {
      return;
    }

    setStatus('saving');
    try {
      await onSave(
        localData,
        Array.from(pendingSectionUpdates.values()),
        Array.from(pendingBackgroundUpdates.values())
      );

      // Update the reference to current saved state
      initialDataRef.current = localData;

      // Clear pending updates
      setPendingSectionUpdates(new Map());
      setPendingBackgroundUpdates(new Map());

      setStatus('saved');
      setLastSavedAt(new Date());

      // Reset to idle after showing "saved" for 2 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Save error:', error);
      setStatus('error');
    }
  }, [localData, pendingSectionUpdates, pendingBackgroundUpdates, onSave, status, hasUnsavedChanges]);

  // Discard all pending changes
  const discardChanges = useCallback(() => {
    setLocalData(initialDataRef.current);
    setPendingSectionUpdates(new Map());
    setPendingBackgroundUpdates(new Map());
    setStatus('idle');
  }, []);

  // Get pending data for a specific section (to merge with Convex data for display)
  const getPendingSectionData = useCallback((sectionId: string) => {
    return pendingSectionUpdates.get(sectionId)?.data;
  }, [pendingSectionUpdates]);

  // Get pending background color for a specific section
  const getPendingBackgroundColor = useCallback((sectionId: string) => {
    return pendingBackgroundUpdates.get(sectionId)?.color;
  }, [pendingBackgroundUpdates]);

  return {
    localData,
    updateLocalData,
    queueSectionUpdate,
    queueBackgroundColorUpdate,
    saveNow,
    discardChanges,
    status,
    lastSavedAt,
    hasUnsavedChanges: hasUnsavedChanges(),
    isSaving: status === 'saving',
    isSaved: status === 'saved',
    hasError: status === 'error',
    pendingSectionIds: Array.from(pendingSectionUpdates.keys()),
    getPendingSectionData,
    getPendingBackgroundColor,
  };
}
