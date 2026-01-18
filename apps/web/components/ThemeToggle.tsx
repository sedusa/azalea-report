'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { LuSun, LuMoon } from 'react-icons/lu';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <LuSun className="theme-icon" />
      ) : (
        <LuMoon className="theme-icon" />
      )}
    </button>
  );
}
