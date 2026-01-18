'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input, Textarea, Button } from '@azalea/ui';
import { toast } from 'sonner';
import { LuArrowLeft, LuLogOut, LuUser, LuBell, LuShield, LuGlobe, LuSave } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SettingsPage() {
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

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    name: 'Admin User',
    email: 'samuel.edusa@gmail.com',
    bio: 'Content Manager at Azalea Report',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    publishNotifications: true,
    commentNotifications: false,
  });

  // Site Settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Azalea Report',
    siteDescription: 'Monthly newsletter for SGMC Health Internal Medicine Residency',
    contactEmail: 'info@azaleareport.com',
  });

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const handleSaveProfile = () => {
    // TODO: Implement actual save logic
    toast.success('Profile updated successfully');
  };

  const handleSaveNotifications = () => {
    // TODO: Implement actual save logic
    toast.success('Notification settings updated');
  };

  const handleSaveSite = () => {
    // TODO: Implement actual save logic
    toast.success('Site settings updated');
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
              <Button variant="secondary" size="sm" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </Button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm"
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
              Settings
            </h1>
            <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
              Manage your account and preferences
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

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Settings */}
          <section className="admin-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgb(var(--accent-light))' }}
              >
                <LuUser className="w-5 h-5" style={{ color: 'rgb(var(--accent-primary))' }} />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                  Profile Settings
                </h2>
                <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Update your personal information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name"
                value={profileSettings.name}
                onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                placeholder="Enter your name"
              />
              <Input
                label="Email Address"
                type="email"
                value={profileSettings.email}
                onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                placeholder="your.email@example.com"
              />
              <Textarea
                label="Bio"
                value={profileSettings.bio}
                onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={3}
              />

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" onClick={handleSaveProfile}>
                  <LuSave className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="admin-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
              >
                <LuBell className="w-5 h-5" style={{ color: 'rgb(59 130 246)' }} />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                  Notification Settings
                </h2>
                <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Control how you receive notifications
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
                style={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}
              >
                <div>
                  <p className="font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
                    Email Notifications
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                    Receive email updates about your content
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    emailNotifications: e.target.checked
                  })}
                  className="w-5 h-5 rounded border-gray-300 text-azalea-green focus:ring-azalea-green"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
                style={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}
              >
                <div>
                  <p className="font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
                    Publish Notifications
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                    Get notified when an issue is published
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.publishNotifications}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    publishNotifications: e.target.checked
                  })}
                  className="w-5 h-5 rounded border-gray-300 text-azalea-green focus:ring-azalea-green"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
                style={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}
              >
                <div>
                  <p className="font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
                    Comment Notifications
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                    Get notified about new comments
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.commentNotifications}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    commentNotifications: e.target.checked
                  })}
                  className="w-5 h-5 rounded border-gray-300 text-azalea-green focus:ring-azalea-green"
                />
              </label>

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" onClick={handleSaveNotifications}>
                  <LuSave className="w-4 h-4 mr-2" />
                  Save Notifications
                </Button>
              </div>
            </div>
          </section>

          {/* Site Settings */}
          <section className="admin-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
              >
                <LuGlobe className="w-5 h-5" style={{ color: 'rgb(139 92 246)' }} />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                  Site Settings
                </h2>
                <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Configure your site information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Site Name"
                value={siteSettings.siteName}
                onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                placeholder="Your site name"
              />
              <Textarea
                label="Site Description"
                value={siteSettings.siteDescription}
                onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                placeholder="Describe your site"
                rows={2}
              />
              <Input
                label="Contact Email"
                type="email"
                value={siteSettings.contactEmail}
                onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                placeholder="contact@example.com"
              />

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" onClick={handleSaveSite}>
                  <LuSave className="w-4 h-4 mr-2" />
                  Save Site Settings
                </Button>
              </div>
            </div>
          </section>

          {/* Security Settings */}
          <section className="admin-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
              >
                <LuShield className="w-5 h-5" style={{ color: 'rgb(239 68 68)' }} />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                  Security Settings
                </h2>
                <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                  Manage your account security
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.info('Password change coming soon')}
                className="w-full justify-start"
              >
                Change Password
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.info('2FA coming soon')}
                className="w-full justify-start"
              >
                Enable Two-Factor Authentication
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.info('Session management coming soon')}
                className="w-full justify-start"
              >
                Manage Active Sessions
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
