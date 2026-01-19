'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button, Input } from '@azalea/ui';
import { toast } from 'sonner';
import { LuPlus, LuPencil, LuTrash2, LuCake, LuArrowLeft, LuLogOut } from 'react-icons/lu';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Birthday {
  _id: Id<'birthdays'>;
  name: string;
  month: number;
  day: number;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BirthdaysPage() {
  const router = useRouter();
  const [editingId, setEditingId] = useState<Id<'birthdays'> | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', month: 1, day: 1 });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowLogoutConfirm(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Queries
  const allBirthdays = useQuery(api.birthdays.list, {}) || [];

  // Mutations
  const createBirthday = useMutation(api.birthdays.create);
  const updateBirthday = useMutation(api.birthdays.update);
  const deleteBirthday = useMutation(api.birthdays.remove);

  // Group by month
  const birthdaysByMonth = allBirthdays.reduce((acc, birthday) => {
    if (!acc[birthday.month]) {
      acc[birthday.month] = [];
    }
    acc[birthday.month].push(birthday);
    return acc;
  }, {} as Record<number, Birthday[]>);

  // Sort birthdays within each month by day
  Object.keys(birthdaysByMonth).forEach((month) => {
    birthdaysByMonth[Number(month)].sort((a, b) => a.day - b.day);
  });

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      if (editingId) {
        await updateBirthday({
          id: editingId,
          name: formData.name.trim(),
          month: formData.month,
          day: formData.day,
        });
        toast.success('Birthday updated');
        setEditingId(null);
      } else {
        await createBirthday({
          name: formData.name.trim(),
          month: formData.month,
          day: formData.day,
        });
        toast.success('Birthday added');
        setShowAddForm(false);
      }

      setFormData({ name: '', month: 1, day: 1 });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save birthday');
    }
  };

  const handleEdit = (birthday: Birthday) => {
    setFormData({
      name: birthday.name,
      month: birthday.month,
      day: birthday.day,
    });
    setEditingId(birthday._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: Id<'birthdays'>) => {
    if (!confirm('Are you sure you want to delete this birthday?')) {
      return;
    }

    try {
      await deleteBirthday({ id });
      toast.success('Birthday deleted');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete birthday');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ name: '', month: 1, day: 1 });
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
              Birthday Management
            </h1>
            <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
              {allBirthdays.length} birthdays registered
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
          <Button variant="primary" size="sm" onClick={() => setShowAddForm(true)}>
            <LuPlus className="w-4 h-4 mr-2" />
            Add Birthday
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="admin-card p-6">
              <h2 className="text-lg font-bold mb-4" style={{ color: 'rgb(var(--text-primary))' }}>
                {editingId ? 'Edit Birthday' : 'Add New Birthday'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
                      Month
                    </label>
                    <select
                      value={formData.month}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          month: Number(e.target.value),
                        })
                      }
                      className="input-field"
                    >
                      {MONTHS.map((month, index) => (
                        <option key={index} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    type="number"
                    label="Day"
                    min={1}
                    max={31}
                    value={formData.day}
                    onChange={(e) =>
                      setFormData({ ...formData, day: Number(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    {editingId ? 'Update' : 'Add'} Birthday
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Birthdays by Month */}
          {allBirthdays.length === 0 ? (
            <div
              className="text-center py-12 rounded-lg border-2 border-dashed"
              style={{
                backgroundColor: 'rgb(var(--bg-secondary))',
                borderColor: 'rgb(var(--border-accent))'
              }}
            >
              <LuCake className="mx-auto h-12 w-12" style={{ color: 'rgb(var(--text-tertiary))' }} />
              <h3 className="mt-2 text-sm font-medium" style={{ color: 'rgb(var(--text-primary))' }}>
                No birthdays yet
              </h3>
              <p className="mt-1 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                Get started by adding a birthday
              </p>
            </div>
          ) : (
            MONTHS.map((monthName, index) => {
              const month = index + 1;
              const birthdays = birthdaysByMonth[month] || [];

              if (birthdays.length === 0) return null;

              return (
                <div key={month}>
                  <h2 className="text-lg font-bold mb-3" style={{ color: 'rgb(var(--text-primary))' }}>
                    {monthName}
                    <span className="text-sm font-normal ml-2" style={{ color: 'rgb(var(--text-secondary))' }}>
                      ({birthdays.length})
                    </span>
                  </h2>

                  <div className="space-y-2">
                    {birthdays.map((birthday) => (
                      <div
                        key={birthday._id}
                        className="admin-card p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                            style={{
                              backgroundColor: 'rgb(var(--accent-light))',
                              color: 'rgb(var(--accent-primary))'
                            }}
                          >
                            {birthday.day}
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
                              {birthday.name}
                            </p>
                            <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                              {monthName} {birthday.day}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(birthday)}
                            className="p-2 rounded-lg transition-colors"
                            style={{
                              color: 'rgb(var(--text-secondary))'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgb(var(--bg-accent))';
                              e.currentTarget.style.color = 'rgb(var(--text-primary))';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'rgb(var(--text-secondary))';
                            }}
                            title="Edit"
                          >
                            <LuPencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(birthday._id)}
                            className="p-2 rounded-lg transition-colors"
                            style={{
                              color: 'rgb(var(--text-secondary))'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                              e.currentTarget.style.color = 'rgb(239 68 68)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'rgb(var(--text-secondary))';
                            }}
                            title="Delete"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
