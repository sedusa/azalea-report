import { useState, useCallback, useEffect, useRef } from 'react';

export interface UndoableOperation {
  type: 'section' | 'banner';
  action: string;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
}

export interface UseUndoRedoReturn {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  addOperation: (operation: UndoableOperation) => void;
  clear: () => void;
}

/**
 * Global undo/redo system for editor operations
 *
 * Tracks operations and allows undoing/redoing with Ctrl+Z / Ctrl+Shift+Z
 * Max history: 50 operations to prevent memory issues
 */
export function useUndoRedo(): UseUndoRedoReturn {
  const [history, setHistory] = useState<UndoableOperation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isUndoRedoRef = useRef(false);

  const MAX_HISTORY = 50;

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  const addOperation = useCallback((operation: UndoableOperation) => {
    // Don't add if this is an undo/redo operation
    if (isUndoRedoRef.current) return;

    setHistory((prev) => {
      // Remove any operations after current index (user made new change after undo)
      const newHistory = prev.slice(0, currentIndex + 1);

      // Add new operation
      newHistory.push(operation);

      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
        setCurrentIndex((idx) => idx - 1);
      }

      return newHistory;
    });

    setCurrentIndex((idx) => Math.min(idx + 1, MAX_HISTORY - 1));
  }, [currentIndex]);

  const undo = useCallback(async () => {
    if (!canUndo) return;

    isUndoRedoRef.current = true;
    try {
      const operation = history[currentIndex];
      await operation.undo();
      setCurrentIndex((idx) => idx - 1);
    } catch (error) {
      console.error('Undo failed:', error);
    } finally {
      isUndoRedoRef.current = false;
    }
  }, [canUndo, currentIndex, history]);

  const redo = useCallback(async () => {
    if (!canRedo) return;

    isUndoRedoRef.current = true;
    try {
      const operation = history[currentIndex + 1];
      await operation.redo();
      setCurrentIndex((idx) => idx + 1);
    } catch (error) {
      console.error('Redo failed:', error);
    } finally {
      isUndoRedoRef.current = false;
    }
  }, [canRedo, currentIndex, history]);

  const clear = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  // Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();

        if (e.shiftKey) {
          // Ctrl+Shift+Z = Redo
          redo();
        } else {
          // Ctrl+Z = Undo
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    addOperation,
    clear,
  };
}
