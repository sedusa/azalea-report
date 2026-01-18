import { useEffect, useRef, useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutosaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
}

/**
 * Autosave hook - automatically saves data after user stops editing
 */
export function useAutosave<T>({
  data,
  onSave,
  delay = 2500, // 2.5 seconds as per spec
}: UseAutosaveOptions<T>) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const debouncedData = useDebounce(data, delay);
  const isFirstRender = useRef(true);
  const dataRef = useRef(data);

  // Keep dataRef updated with latest data
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (status === 'saving') return; // Prevent double saves

    setStatus('saving');
    try {
      await onSave(dataRef.current);
      setStatus('saved');
      setLastSavedAt(new Date());

      // Reset to idle after showing "saved" for 2 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Manual save error:', error);
      setStatus('error');
    }
  }, [onSave, status]);

  useEffect(() => {
    // Skip first render to avoid saving initial data
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const save = async () => {
      setStatus('saving');
      try {
        await onSave(debouncedData);
        setStatus('saved');
        setLastSavedAt(new Date());

        // Reset to idle after showing "saved" for 2 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 2000);
      } catch (error) {
        console.error('Autosave error:', error);
        setStatus('error');
      }
    };

    save();
  }, [debouncedData]);

  return {
    status,
    lastSavedAt,
    isSaving: status === 'saving',
    isSaved: status === 'saved',
    hasError: status === 'error',
    saveNow,
  };
}
