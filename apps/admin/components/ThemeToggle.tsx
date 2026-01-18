'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { LuSun, LuMoon } from 'react-icons/lu';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn group"
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-icon-wrapper">
        <LuSun className={`theme-icon sun ${theme === 'light' ? 'active' : ''}`} />
        <LuMoon className={`theme-icon moon ${theme === 'dark' ? 'active' : ''}`} />
      </div>
    </button>
  );
}
