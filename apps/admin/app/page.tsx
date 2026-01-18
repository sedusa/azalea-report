'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { LuFileText, LuClock, LuCheckCircle, LuPlus, LuImage, LuCake, LuLogOut, LuMenu, LuX } from 'react-icons/lu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Fetch recent issues
  const allIssues = useQuery(api.issues.list, {}) || [];

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowLogoutConfirm(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen || showLogoutConfirm) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }
    return () => document.body.classList.remove('drawer-open');
  }, [isMobileMenuOpen, showLogoutConfirm]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  // Separate by status
  const draftIssues = allIssues.filter(issue => issue.status === 'draft');
  const publishedIssues = allIssues.filter(issue => issue.status === 'published');

  // Sort by updated date (most recent first)
  const recentIssues = [...allIssues]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  // Sidebar navigation items - shared between desktop and mobile
  const navItems = [
    { href: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', active: true },
    { href: '/issues', label: 'Issues', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', active: false },
    { href: '/media', label: 'Media Library', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', active: false },
    { href: '/birthdays', label: 'Birthdays', icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z', active: false },
    { href: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', active: false, extraPath: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(var(--bg-primary))' }}>
      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-drawer-overlay lg:hidden ${isMobileMenuOpen ? 'visible' : 'hidden'}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside className={`mobile-drawer lg:hidden ${isMobileMenuOpen ? 'open' : 'closed'}`}>
        <div className="flex items-center justify-between px-6 py-6 border-b" style={{ borderColor: 'rgb(var(--border-primary))' }}>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Azalea Report
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgb(var(--text-tertiary))' }}>
              Content Management
            </p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn-ghost"
            aria-label="Close menu"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${item.active ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                {item.extraPath && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.extraPath} />
                )}
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t" style={{ borderColor: 'rgb(var(--border-primary))' }}>
          <div>
            <p className="text-sm font-medium" style={{ color: 'rgb(var(--text-primary))' }}>Admin</p>
            <p className="text-xs" style={{ color: 'rgb(var(--text-tertiary))' }}>samuel.edusa@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar hidden lg:flex">
        <div className="admin-sidebar-header">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Azalea Report
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgb(var(--text-tertiary))' }}>
            Content Management
          </p>
        </div>

        <nav className="admin-sidebar-nav space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`nav-link ${item.active ? 'active' : ''}`}>
              <svg className="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                {item.extraPath && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.extraPath} />
                )}
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div>
            <p className="text-sm font-medium" style={{ color: 'rgb(var(--text-primary))' }}>Admin</p>
            <p className="text-xs" style={{ color: 'rgb(var(--text-tertiary))' }}>samuel.edusa@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <>
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
        </>
      )}

      {/* Main Content - with left margin on desktop to account for fixed sidebar */}
      <main className="min-h-screen lg:ml-72">
        {/* Header - Full Width */}
        <header className="admin-header w-full">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="hamburger-btn lg:hidden mr-4"
            aria-label="Open menu"
          >
            <LuMenu className="w-5 h-5" style={{ color: 'rgb(var(--text-primary))' }} />
          </button>

          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgb(var(--text-secondary))' }}>
              Welcome back, manage your content
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
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

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in">
            <Link href="/issues/new" className="admin-card group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgb(var(--accent-light))' }}>
                  <LuPlus className="w-6 h-6" style={{ color: 'rgb(var(--accent-primary))' }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">New Issue</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                    Create a new newsletter issue
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/media" className="admin-card group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgb(59 130 246 / 0.15)' }}>
                  <LuImage className="w-6 h-6" style={{ color: 'rgb(59 130 246)' }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Media Library</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                    Manage images and files
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/birthdays" className="admin-card group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgb(251 191 36 / 0.15)' }}>
                  <LuCake className="w-6 h-6" style={{ color: 'rgb(251 191 36)' }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Birthdays</h3>
                  <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                    Manage birthday entries
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in-delay-1">
            <div className="stat-card group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: 'rgb(var(--text-secondary))' }}>
                    Total Issues
                  </p>
                  <p className="text-4xl font-bold">
                    {allIssues.length}
                  </p>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgb(148 163 184 / 0.15)' }}>
                  <LuFileText className="w-7 h-7" style={{ color: 'rgb(148 163 184)' }} />
                </div>
              </div>
            </div>

            <div className="stat-card group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: 'rgb(var(--text-secondary))' }}>
                    Drafts
                  </p>
                  <p className="text-4xl font-bold">
                    {draftIssues.length}
                  </p>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgb(251 191 36 / 0.15)' }}>
                  <LuClock className="w-7 h-7" style={{ color: 'rgb(251 191 36)' }} />
                </div>
              </div>
            </div>

            <div className="stat-card group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: 'rgb(var(--text-secondary))' }}>
                    Published
                  </p>
                  <p className="text-4xl font-bold">
                    {publishedIssues.length}
                  </p>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgb(34 197 94 / 0.15)' }}>
                  <LuCheckCircle className="w-7 h-7" style={{ color: 'rgb(34 197 94)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Issues */}
          <div className="admin-card animate-fade-in-delay-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recent Issues</h3>
              <Link href="/issues" className="text-sm font-semibold" style={{ color: 'rgb(var(--accent-primary))' }}>
                View all →
              </Link>
            </div>

            {recentIssues.length === 0 ? (
              <div className="text-center py-16">
                <LuFileText className="mx-auto h-16 w-16 mb-4" style={{ color: 'rgb(var(--text-tertiary))' }} />
                <p style={{ color: 'rgb(var(--text-secondary))' }}>No issues yet</p>
                <p className="text-sm mt-2" style={{ color: 'rgb(var(--text-tertiary))' }}>
                  Create your first issue to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentIssues.map((issue) => (
                  <Link
                    key={issue._id}
                    href={`/issues/${issue._id}`}
                    className="block p-5 rounded-xl border transition-all duration-200 hover:scale-[1.01]"
                    style={{
                      backgroundColor: 'rgb(var(--bg-tertiary))',
                      borderColor: 'rgb(var(--border-primary))',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">
                          {issue.title || 'Untitled Issue'}
                        </h4>
                        <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                          Edition #{issue.edition} • Updated{' '}
                          {new Date(issue.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`status-badge ${issue.status}`}>
                        {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
