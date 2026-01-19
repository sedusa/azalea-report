'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { SectionPalette, getIcon } from '@/components/SectionPalette';
import { DragDropCanvas } from '@/components/DragDropCanvas';
import { PropertyPanel } from '@/components/PropertyPanel';
import { PreviewPane } from '@/components/PreviewPane';
import { SaveIndicator } from '@/components/SaveIndicator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SectionCard } from '@/components/SectionCard';
import { Button } from '@azalea/ui';
import { Modal } from '@azalea/ui';
import { useAutosave } from '@/hooks/useAutosave';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { SECTION_REGISTRY } from '@azalea/shared/constants';
import type { SectionType, Section, Issue } from '@azalea/shared/types';
import { toast } from 'sonner';
import { LuEye, LuUndo2, LuRedo2, LuArrowLeft, LuMenu, LuX, LuSave, LuTrash2 } from 'react-icons/lu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImagePicker } from '@/components/ImagePicker';

interface IssueEditorProps {
  issueId: string;
}

export function IssueEditor({ issueId }: IssueEditorProps) {
  const router = useRouter();
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activePaletteType, setActivePaletteType] = useState<SectionType | null>(null);
  const [bannerData, setBannerData] = useState<{
    title: string;
    bannerTitle: string;
    bannerDate: string;
    bannerImage: Id<'media'> | null;
  }>({
    title: '',
    bannerTitle: '',
    bannerDate: '',
    bannerImage: null,
  });
  const [initializedIssueId, setInitializedIssueId] = useState<string | null>(null);

  // Undo/redo system
  const { canUndo, canRedo, undo, redo, addOperation } = useUndoRedo();

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check if issueId is a valid Convex ID (not "new" or other invalid values)
  const isValidId = issueId && issueId !== 'new' && issueId.length > 10;

  // Fetch data from Convex (skip if invalid ID)
  const issue = useQuery(
    api.issues.get,
    isValidId ? { id: issueId as Id<'issues'> } : 'skip'
  );
  const sections = useQuery(
    api.sections.listByIssue,
    isValidId ? { issueId: issueId as Id<'issues'> } : 'skip'
  ) || [];

  // Mutations
  const createSection = useMutation(api.sections.create);
  const updateSection = useMutation(api.sections.update);
  const deleteSection = useMutation(api.sections.remove);
  const duplicateSection = useMutation(api.sections.duplicate);
  const toggleVisibility = useMutation(api.sections.toggleVisibility);
  const updateBackgroundColor = useMutation(api.sections.updateBackgroundColor);
  const reorderSections = useMutation(api.sections.reorder);
  const updateIssue = useMutation(api.issues.update);
  const publishIssue = useMutation(api.issues.publish);
  const deleteIssue = useMutation(api.issues.remove);

  // Autosave for banner data
  const { status, lastSavedAt, saveNow } = useAutosave({
    data: bannerData,
    onSave: async (data) => {
      if (!issue) return;
      await updateIssue({
        id: issueId as Id<'issues'>,
        title: data.title,
        bannerTitle: data.bannerTitle,
        bannerDate: data.bannerDate,
        bannerImage: data.bannerImage || undefined,
        userId: issue.createdBy,
      });
    },
  });

  // Manual save handler with toast notification
  const handleManualSave = async () => {
    await saveNow();
    toast.success('Changes saved');
  };

  // Keyboard shortcut for Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveNow]);

  // Warn user when leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [status]);

  // Handle mobile drawer - prevent body scroll and handle ESC key
  useEffect(() => {
    if (showMobileDrawer) {
      document.body.classList.add('drawer-open');

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowMobileDrawer(false);
        }
      };

      window.addEventListener('keydown', handleEscape);

      return () => {
        document.body.classList.remove('drawer-open');
        window.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.classList.remove('drawer-open');
    }
  }, [showMobileDrawer]);

  // Close delete confirm modal on Escape
  useEffect(() => {
    if (showDeleteConfirm) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowDeleteConfirm(false);
        }
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [showDeleteConfirm]);

  // Initialize banner data when issue loads (only once per issue)
  useEffect(() => {
    if (issue && initializedIssueId !== issue._id) {
      setBannerData({
        title: issue.title,
        bannerTitle: issue.bannerTitle,
        bannerDate: issue.bannerDate,
        // Use bannerImageId (the media ID) for saving, not the resolved URL
        bannerImage: (issue as any).bannerImageId || null,
      });
      setInitializedIssueId(issue._id);
    }
  }, [issue, initializedIssueId]);

  const selectedSection = sections.find((s) => s._id === selectedSectionId);

  const handleAddSection = async (type: SectionType, insertAtIndex?: number) => {
    try {
      const sectionDef = SECTION_REGISTRY[type];
      const newSectionId = await createSection({
        issueId: issueId as Id<'issues'>,
        type,
        data: sectionDef.exampleData(),
        userId: issue?.createdBy as Id<'users'>,
        backgroundColor: sectionDef.defaultBackgroundColor,
      });

      // If insertAtIndex is specified, reorder to put the new section in the right position
      if (insertAtIndex !== undefined && insertAtIndex < sections.length) {
        // Build new order: insert new section at the specified index
        const currentIds = sections.map((s) => s._id);
        const newOrder = [
          ...currentIds.slice(0, insertAtIndex),
          newSectionId,
          ...currentIds.slice(insertAtIndex),
        ];
        await reorderSections({
          issueId: issueId as Id<'issues'>,
          sectionIds: newOrder as Id<'sections'>[],
        });
      }

      addOperation({
        type: 'section',
        action: 'add',
        undo: async () => {
          await deleteSection({
            id: newSectionId as Id<'sections'>,
            userId: issue?.createdBy as Id<'users'>,
          });
          toast.success('Undid add section');
        },
        redo: async () => {
          toast.info('Redo not fully implemented for add operations');
        },
      });

      setSelectedSectionId(newSectionId);
      toast.success(`${sectionDef.label} added`);
    } catch (error) {
      toast.error('Failed to add section');
      console.error(error);
    }
  };

  const handleSectionUpdate = async (sectionId: string, data: Record<string, unknown>) => {
    try {
      const previousSection = sections.find(s => s._id === sectionId);
      const previousData = previousSection?.data;

      await updateSection({
        id: sectionId as Id<'sections'>,
        data,
        userId: issue?.createdBy as Id<'users'>,
      });

      if (previousData) {
        addOperation({
          type: 'section',
          action: 'update',
          undo: async () => {
            await updateSection({
              id: sectionId as Id<'sections'>,
              data: previousData,
              userId: issue?.createdBy as Id<'users'>,
            });
            toast.success('Undid update');
          },
          redo: async () => {
            await updateSection({
              id: sectionId as Id<'sections'>,
              data,
              userId: issue?.createdBy as Id<'users'>,
            });
            toast.success('Redid update');
          },
        });
      }
    } catch (error) {
      toast.error('Failed to update section');
      console.error(error);
    }
  };

  const handleBackgroundColorChange = async (sectionId: string, color: string | undefined) => {
    try {
      await updateBackgroundColor({
        id: sectionId as Id<'sections'>,
        backgroundColor: color,
        userId: issue?.createdBy as Id<'users'>,
      });
    } catch (error) {
      toast.error('Failed to update background color');
      console.error(error);
    }
  };

  const handleSectionDelete = async (sectionId: string) => {
    try {
      const section = sections.find(s => s._id === sectionId);
      if (!section) return;

      await deleteSection({
        id: sectionId as Id<'sections'>,
        userId: issue?.createdBy as Id<'users'>,
      });

      addOperation({
        type: 'section',
        action: 'delete',
        undo: async () => {
          await createSection({
            issueId: issueId as Id<'issues'>,
            type: section.type,
            data: section.data,
            userId: issue?.createdBy as Id<'users'>,
          });
          toast.success('Undid delete');
        },
        redo: async () => {
          await deleteSection({
            id: sectionId as Id<'sections'>,
            userId: issue?.createdBy as Id<'users'>,
          });
          toast.success('Redid delete');
        },
      });

      if (selectedSectionId === sectionId) {
        setSelectedSectionId(null);
      }

      toast.success('Section deleted');
    } catch (error) {
      toast.error('Failed to delete section');
      console.error(error);
    }
  };

  const handleSectionDuplicate = async (sectionId: string) => {
    try {
      const newSectionId = await duplicateSection({
        id: sectionId as Id<'sections'>,
        userId: issue?.createdBy as Id<'users'>,
      });

      setSelectedSectionId(newSectionId);
      toast.success('Section duplicated');
    } catch (error) {
      toast.error('Failed to duplicate section');
      console.error(error);
    }
  };

  const handleToggleVisibility = async (sectionId: string) => {
    try {
      await toggleVisibility({
        id: sectionId as Id<'sections'>,
        userId: issue?.createdBy as Id<'users'>,
      });
    } catch (error) {
      toast.error('Failed to toggle visibility');
      console.error(error);
    }
  };

  const handleReorder = async (sectionIds: string[]) => {
    try {
      await reorderSections({
        issueId: issueId as Id<'issues'>,
        sectionIds: sectionIds as Id<'sections'>[],
        userId: issue?.createdBy as Id<'users'>,
      });
    } catch (error) {
      toast.error('Failed to reorder sections');
      console.error(error);
    }
  };

  // DnD event handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeIdStr = active.id as string;

    if (activeIdStr.startsWith('palette-')) {
      // Dragging from palette
      const sectionType = active.data.current?.sectionType as SectionType;
      setActivePaletteType(sectionType);
      setActiveId(null);
    } else {
      // Dragging existing section
      setActiveId(activeIdStr);
      setActivePaletteType(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActivePaletteType(null);

    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    // Check if we're dragging from palette
    if (activeIdStr.startsWith('palette-') && active.data.current?.type === 'palette-item') {
      const sectionType = active.data.current.sectionType as SectionType;

      // Determine insertion index based on where we're dropping
      let insertAtIndex: number | undefined;

      if (overIdStr === 'canvas-droppable') {
        // Dropped on empty canvas or at the end
        insertAtIndex = undefined; // Add at end
      } else if (overIdStr.startsWith('drop-zone-')) {
        // Dropped on a drop zone between sections
        insertAtIndex = parseInt(overIdStr.replace('drop-zone-', ''), 10);
      } else {
        // Dropped on an existing section - insert before it
        const overIndex = sections.findIndex((s) => s._id === overIdStr);
        if (overIndex !== -1) {
          insertAtIndex = overIndex;
        }
      }

      await handleAddSection(sectionType, insertAtIndex);
      return;
    }

    // Otherwise, we're reordering sections
    if (activeIdStr !== overIdStr) {
      const oldIndex = sections.findIndex((s) => s._id === activeIdStr);
      let newIndex = sections.findIndex((s) => s._id === overIdStr);

      // Handle drop zones
      if (overIdStr.startsWith('drop-zone-')) {
        newIndex = parseInt(overIdStr.replace('drop-zone-', ''), 10);
        // Adjust if moving down
        if (oldIndex < newIndex) {
          newIndex = newIndex - 1;
        }
      }

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newSections = arrayMove(sections, oldIndex, newIndex);
        await handleReorder(newSections.map((s) => s._id));
      }
    }
  };

  const activeSectionForOverlay = sections.find((s) => s._id === activeId);

  const handlePublish = async () => {
    try {
      await publishIssue({
        id: issueId as Id<'issues'>,
        userId: issue?.createdBy as Id<'users'>,
      });
      toast.success('Issue published!');
    } catch (error) {
      toast.error('Failed to publish issue');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIssue({
        id: issueId as Id<'issues'>,
      });
      toast.success('Issue deleted');
      router.push('/issues');
    } catch (error) {
      toast.error('Failed to delete issue. Only draft issues can be deleted.');
      console.error(error);
    }
    setShowDeleteConfirm(false);
  };

  if (!issue) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="skeleton w-12 h-12 rounded-full mx-auto mb-4"></div>
          <p style={{ color: 'rgb(var(--text-secondary))' }}>Loading issue...</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'rgb(var(--bg-primary))' }}>
      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-drawer-overlay ${showMobileDrawer ? 'visible' : 'hidden'}`}
        onClick={() => setShowMobileDrawer(false)}
      />

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${showMobileDrawer ? 'open' : 'closed'}`}>
        <div className="p-4 border-b" style={{ borderColor: 'rgb(var(--border-primary))' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
              Sections
            </h2>
            <button
              onClick={() => setShowMobileDrawer(false)}
              className="hamburger-btn"
              aria-label="Close menu"
            >
              <LuX className="w-5 h-5" style={{ color: 'rgb(var(--text-primary))' }} />
            </button>
          </div>
        </div>
        <SectionPalette onAddSection={(type) => {
          handleAddSection(type);
          setShowMobileDrawer(false);
        }} />
      </div>

      {/* Header */}
      <header className="admin-header flex-shrink-0">
        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden hamburger-btn mr-4"
          onClick={() => setShowMobileDrawer(true)}
          aria-label="Open menu"
        >
          <LuMenu className="w-5 h-5" style={{ color: 'rgb(var(--text-primary))' }} />
        </button>

        <div className="flex items-center gap-4 flex-1">
          <Link href="/issues" className="btn-ghost flex items-center gap-2">
            <LuArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="border-l border-r px-4" style={{ borderColor: 'rgb(var(--border-primary))' }}>
            <h1 className="text-lg font-bold truncate max-w-xs">
              {issue.title || 'Untitled Issue'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`status-badge ${issue.status}`}>
                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
              </span>
              <SaveIndicator status={status} lastSavedAt={lastSavedAt} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Undo/Redo Buttons */}
          <div className="hidden md:flex items-center gap-1 mr-2 pr-3 border-r" style={{ borderColor: 'rgb(var(--border-primary))' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="btn-ghost"
            >
              <LuUndo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
              className="btn-ghost"
            >
              <LuRedo2 className="w-4 h-4" />
            </Button>
          </div>

          <ThemeToggle />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualSave}
            disabled={status === 'saving'}
            title="Save (Ctrl+S)"
            className="btn-ghost hidden sm:flex items-center gap-2"
          >
            <LuSave className="w-4 h-4" />
            <span>{status === 'saving' ? 'Saving...' : 'Save'}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPreview(true)}
            className="btn-secondary hidden sm:flex items-center gap-2"
          >
            <LuEye className="w-4 h-4" />
            <span>Preview</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePublish}
            disabled={issue.status === 'published'}
            className="btn-primary"
          >
            {issue.status === 'published' ? 'Published' : 'Publish'}
          </Button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
            title="Delete Issue"
            aria-label="Delete Issue"
          >
            <LuTrash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowDeleteConfirm(false)}
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
                <LuTrash2 className="w-6 h-6" style={{ color: 'rgb(239 68 68)' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'rgb(var(--text-primary))' }}>
                  Delete Issue?
                </h3>
                <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: 'rgb(var(--text-secondary))' }}>
              Are you sure you want to delete "{issue.title}"? All sections will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm"
                style={{ backgroundColor: 'rgb(239 68 68)', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Section Palette - 25% on desktop, hidden on mobile */}
        <div className="hidden lg:flex lg:w-[25%] border-r overflow-hidden" style={{
          backgroundColor: 'rgb(var(--bg-secondary))',
          borderColor: 'rgb(var(--border-primary))'
        }}>
          <SectionPalette onAddSection={handleAddSection} />
        </div>

        {/* Canvas & Property Panel Container - 75% combined */}
        <div className="flex-1 lg:flex-none lg:w-[75%] flex flex-col lg:flex-row overflow-hidden">
          {/* Drag & Drop Canvas - 35% of total width on desktop (46.67% of 75%), full width on mobile */}
          <div className="w-full lg:w-[46.67%] overflow-y-auto" style={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-4xl mx-auto space-y-4">
                {/* Banner Section */}
                <div className="section-card">
                  <h3 className="font-bold text-lg mb-4">Banner</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--text-secondary))' }}>
                        Issue Title
                      </label>
                      <input
                        type="text"
                        placeholder="January 2026 Edition"
                        value={bannerData.title}
                        onChange={(e) => setBannerData({ ...bannerData, title: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--text-secondary))' }}>
                        Banner Title
                      </label>
                      <input
                        type="text"
                        placeholder="AZALEA REPORT"
                        value={bannerData.bannerTitle}
                        onChange={(e) => setBannerData({ ...bannerData, bannerTitle: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(var(--text-secondary))' }}>
                        Date
                      </label>
                      <input
                        type="date"
                        value={bannerData.bannerDate}
                        onChange={(e) => setBannerData({ ...bannerData, bannerDate: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <ImagePicker
                        label="Banner Image"
                        value={bannerData.bannerImage}
                        onChange={(mediaId) => setBannerData({ ...bannerData, bannerImage: mediaId })}
                        required={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Sections */}
                {sections.length > 0 ? (
                  <DragDropCanvas
                    sections={sections as Section[]}
                    selectedSectionId={selectedSectionId}
                    onSectionSelect={setSelectedSectionId}
                    onSectionDelete={handleSectionDelete}
                    onSectionDuplicate={handleSectionDuplicate}
                    onSectionToggleVisibility={handleToggleVisibility}
                  />
                ) : (
                  <div className="text-center py-12 section-card border-dashed" style={{ borderWidth: '2px' }}>
                    <svg
                      className="mx-auto h-12 w-12 mb-4"
                      style={{ color: 'rgb(var(--text-tertiary))' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <h3 className="text-sm font-medium mb-2">No sections</h3>
                    <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                      Add sections from the palette
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Property Panel - 40% of total width on desktop (53.33% of 75%), full width on mobile when section selected */}
          <div
            className={`
              w-full lg:w-[53.33%] border-l overflow-hidden
              ${selectedSection ? 'block' : 'hidden lg:block'}
            `}
            style={{
              backgroundColor: 'rgb(var(--bg-secondary))',
              borderColor: 'rgb(var(--border-primary))'
            }}
          >
            <PropertyPanel
              section={selectedSection as Section | null}
              onUpdate={(data) => {
                if (selectedSectionId) {
                  handleSectionUpdate(selectedSectionId, data);
                }
              }}
              onBackgroundColorChange={(color) => {
                if (selectedSectionId) {
                  handleBackgroundColorChange(selectedSectionId, color);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Preview"
        size="full"
      >
        <PreviewPane
          issue={issue as Issue}
          sections={sections as Section[]}
        />
      </Modal>
    </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeSectionForOverlay ? (
          <div className="opacity-70">
            <SectionCard
              section={activeSectionForOverlay}
              isSelected={false}
              onSelect={() => {}}
              onDelete={() => {}}
              onDuplicate={() => {}}
              onToggleVisibility={() => {}}
            />
          </div>
        ) : activePaletteType ? (
          <div
            className="palette-item opacity-70"
            style={{ width: '240px' }}
          >
            <div className="palette-icon-wrapper">
              {(() => {
                const Icon = getIcon(SECTION_REGISTRY[activePaletteType].icon);
                return <Icon className="palette-icon" />;
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
                {SECTION_REGISTRY[activePaletteType].label}
              </p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
