'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MediaLibrary } from '@/components/MediaLibrary';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LuArrowLeft, LuLogOut } from 'react-icons/lu';
import { toast } from 'sonner';

export default function MediaPage() {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowLogoutConfirm(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

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
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2.5 rounded-xl font-semibold transition-all duration-200"
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
              Media Library
            </h1>
            <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
              Manage images and files
            </p>
          </div>
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

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <MediaLibrary mode="manage" />
      </div>
    </div>
  );
}
