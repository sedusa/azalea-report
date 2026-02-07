'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseAutoPlayCarouselOptions {
  totalSlides: number;
  interval?: number;
  resumeDelay?: number;
}

/**
 * Hook that provides auto-play carousel behavior with pause on hover and manual interaction.
 * - Auto-advances every `interval` ms (default 7000)
 * - Pauses when user hovers over the carousel area
 * - Pauses on manual navigation (prev/next/dot click), resumes after `resumeDelay` ms (default 10000)
 */
export function useAutoPlayCarousel({
  totalSlides,
  interval = 7000,
  resumeDelay = 10000,
}: UseAutoPlayCarouselOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToPrevious = useCallback(() => {
    if (isTransitioning || totalSlides <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 400);
  }, [totalSlides, isTransitioning]);

  const goToNext = useCallback(() => {
    if (isTransitioning || totalSlides <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 400);
  }, [totalSlides, isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [currentIndex, isTransitioning]);

  // Pause auto-play on manual navigation, resume after delay
  const pauseAndScheduleResume = useCallback(() => {
    setIsPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      setIsPaused(false);
    }, resumeDelay);
  }, [resumeDelay]);

  // Wrapped navigation that also pauses auto-play
  const handlePrevious = useCallback(() => {
    goToPrevious();
    pauseAndScheduleResume();
  }, [goToPrevious, pauseAndScheduleResume]);

  const handleNext = useCallback(() => {
    goToNext();
    pauseAndScheduleResume();
  }, [goToNext, pauseAndScheduleResume]);

  const handleGoToSlide = useCallback((index: number) => {
    goToSlide(index);
    pauseAndScheduleResume();
  }, [goToSlide, pauseAndScheduleResume]);

  // Hover handlers for the carousel container
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Only resume if not paused by manual navigation
    if (!resumeTimerRef.current) {
      setIsPaused(false);
    }
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || totalSlides <= 1) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 400);
    }, interval);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPaused, totalSlides, interval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (totalSlides <= 1) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, totalSlides]);

  // Reset index if out of bounds
  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [totalSlides, currentIndex]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, []);

  return {
    currentIndex,
    isTransitioning,
    goToPrevious: handlePrevious,
    goToNext: handleNext,
    goToSlide: handleGoToSlide,
    hoverProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}
