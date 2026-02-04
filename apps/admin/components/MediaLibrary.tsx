'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button, Input } from '@azalea/ui';
import { toast } from 'sonner';
import {
  LuUpload,
  LuSearch,
  LuTrash2,
  LuImage,
  LuFileImage,
  LuX,
  LuCheckSquare,
  LuSquare,
  LuAlertTriangle,
} from 'react-icons/lu';

interface MediaLibraryProps {
  onSelect?: (mediaId: Id<'media'>) => void;
  selectedMediaId?: Id<'media'> | null;
  mode?: 'select' | 'manage';
}

interface MediaItem {
  _id: Id<'media'>;
  filename: string;
  url: string | null;
  size: number;
  uploadedAt: number;
  mimeType: string;
}

export function MediaLibrary({
  onSelect,
  selectedMediaId = null,
  mode = 'manage'
}: MediaLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<Id<'media'>>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Queries
  const allMedia = useQuery(api.media.list, {}) || [];

  // Mutations
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const createMedia = useMutation(api.media.create);
  const deleteMedia = useMutation(api.media.remove);

  // Filter media by search query
  const filteredMedia = searchQuery
    ? allMedia.filter((media) =>
        media.filename.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allMedia;

  // Sort by upload date (newest first)
  const sortedMedia = [...filteredMedia].sort(
    (a, b) => b.uploadedAt - a.uploadedAt
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allFiles = Array.from(files);

    // Validate upfront: filter out non-images and >10MB files
    const validFiles: File[] = [];
    for (const file of allFiles) {
      if (!file.type.startsWith('image/')) {
        toast.error(`Skipped "${file.name}" — not an image`);
      } else if (file.size > 10 * 1024 * 1024) {
        toast.error(`Skipped "${file.name}" — exceeds 10MB`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: validFiles.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setUploadProgress({ current: i + 1, total: validFiles.length });

      try {
        const uploadUrl = await generateUploadUrl();

        const result = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error('Upload failed');
        }

        const { storageId } = await result.json();

        await createMedia({
          storageId,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        });

        successCount++;
      } catch (error) {
        console.error(`Upload error for "${file.name}":`, error);
        failCount++;
      }
    }

    if (failCount === 0) {
      toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded`);
    } else {
      toast.error(`Uploaded ${successCount}, failed ${failCount} of ${validFiles.length}`);
    }

    // Reset
    e.target.value = '';
    setUploading(false);
    setUploadProgress(null);
  };

  const handleImageClick = (media: MediaItem) => {
    if (mode === 'select') {
      // In picker mode, select for the parent component
      onSelect?.(media._id);
    } else if (isSelectionMode) {
      // In selection mode, toggle selection
      const newSelected = new Set(selectedIds);
      if (newSelected.has(media._id)) {
        newSelected.delete(media._id);
      } else {
        newSelected.add(media._id);
      }
      setSelectedIds(newSelected);
    } else {
      // Normal mode - open preview
      setPreviewMedia(media);
    }
  };

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      // Exiting selection mode - clear selections
      setSelectedIds(new Set());
    }
    setIsSelectionMode(!isSelectionMode);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    setDeleting(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedIds) {
      try {
        await deleteMedia({ id });
        successCount++;
      } catch (error) {
        failCount++;
        console.error('Delete error:', error);
      }
    }

    setDeleting(false);
    setShowDeleteConfirm(false);
    setSelectedIds(new Set());
    setIsSelectionMode(false);

    if (failCount === 0) {
      toast.success(`Deleted ${successCount} image${successCount > 1 ? 's' : ''}`);
    } else {
      toast.error(`Deleted ${successCount}, failed to delete ${failCount} (may be in use)`);
    }
  };

  const selectAll = () => {
    setSelectedIds(new Set(sortedMedia.map(m => m._id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'rgb(var(--bg-primary))' }}>
      {/* Header */}
      <div
        className="p-6 border-b"
        style={{
          backgroundColor: 'rgb(var(--bg-secondary))',
          borderColor: 'rgb(var(--border-primary))'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
            Media Library
          </h2>
          <div className="flex items-center gap-2">
            {mode === 'manage' && (
              <>
                {/* Selection Mode Toggle */}
                <Button
                  variant={isSelectionMode ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={toggleSelectionMode}
                >
                  {isSelectionMode ? (
                    <>
                      <LuX className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <LuCheckSquare className="w-4 h-4 mr-2" />
                      Select
                    </>
                  )}
                </Button>

                {/* Upload Button */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <span
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      uploading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer'
                    }`}
                  >
                    <LuUpload className="w-4 h-4 mr-2" />
                    {uploading && uploadProgress
                      ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...`
                      : uploading
                        ? 'Uploading...'
                        : 'Upload'}
                  </span>
                </label>
              </>
            )}
          </div>
        </div>

        {/* Selection Mode Actions */}
        {isSelectionMode && (
          <div className="flex items-center gap-3 mb-4 p-3 rounded-lg" style={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}>
            <span className="text-sm font-medium" style={{ color: 'rgb(var(--text-primary))' }}>
              {selectedIds.size} selected
            </span>
            <Button variant="ghost" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={deselectAll}>
              Deselect All
            </Button>
            <div className="flex-1" />
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={selectedIds.size === 0}
            >
              <LuTrash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.size})
            </Button>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <LuSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'rgb(var(--text-tertiary))' }}
          />
          <Input
            type="text"
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          <span>{sortedMedia.length} images</span>
          {searchQuery && (
            <span style={{ color: 'rgb(var(--accent-primary))' }}>
              Filtered from {allMedia.length} total
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div
        className="flex-1 overflow-y-auto p-6"
        style={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}
      >
        {sortedMedia.length === 0 ? (
          <div className="text-center py-12">
            <LuFileImage
              className="mx-auto h-12 w-12"
              style={{ color: 'rgb(var(--text-tertiary))' }}
            />
            <h3
              className="mt-2 text-sm font-medium"
              style={{ color: 'rgb(var(--text-primary))' }}
            >
              {searchQuery ? 'No images found' : 'No images yet'}
            </h3>
            <p className="mt-1 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
              {searchQuery
                ? 'Try a different search term'
                : 'Get started by uploading an image'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {sortedMedia.map((media) => {
              const isSelected = isSelectionMode && selectedIds.has(media._id);
              const isPickerSelected = mode === 'select' && selectedMediaId === media._id;

              return (
                <div
                  key={media._id}
                  className={`relative cursor-pointer transition-all rounded-lg overflow-hidden ${
                    isSelected || isPickerSelected ? 'ring-2 ring-emerald-500' : ''
                  }`}
                  style={{
                    backgroundColor: 'rgb(var(--bg-secondary))',
                    border: '1px solid rgb(var(--border-primary))',
                  }}
                  onClick={() => handleImageClick(media as MediaItem)}
                >
                  <div
                    className="aspect-square relative rounded-t-lg overflow-hidden"
                    style={{ backgroundColor: 'rgb(var(--bg-accent))' }}
                  >
                    {media.url ? (
                      <img
                        src={media.url}
                        alt={media.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <LuImage
                          className="w-8 h-8"
                          style={{ color: 'rgb(var(--text-tertiary))' }}
                        />
                      </div>
                    )}

                    {/* Selection checkbox */}
                    {isSelectionMode && (
                      <div className="absolute top-1 left-1">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div
                            className="w-5 h-5 rounded border-2 border-white bg-black/30"
                          />
                        )}
                      </div>
                    )}

                    {/* Picker selected indicator */}
                    {isPickerSelected && (
                      <div
                        className="absolute top-1 right-1 text-white rounded-full p-0.5"
                        style={{ backgroundColor: 'rgb(var(--accent-primary))' }}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-1.5">
                    <p
                      className="text-[10px] truncate font-medium"
                      style={{ color: 'rgb(var(--text-primary))' }}
                    >
                      {media.filename}
                    </p>
                    <p
                      className="text-[10px]"
                      style={{ color: 'rgb(var(--text-secondary))' }}
                    >
                      {new Date(media.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewMedia && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)' }}
          onClick={() => setPreviewMedia(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <LuX className="w-8 h-8" />
            </button>

            {/* Image */}
            {previewMedia.url && (
              <img
                src={previewMedia.url}
                alt={previewMedia.filename}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}

            {/* Image info */}
            <div className="mt-4 text-center text-white">
              <p className="font-medium">{previewMedia.filename}</p>
              <p className="text-sm text-gray-300">
                {(previewMedia.size / 1024).toFixed(1)} KB • Uploaded {new Date(previewMedia.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
            style={{ backgroundColor: 'rgb(var(--bg-secondary))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
              >
                <LuAlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: 'rgb(var(--text-primary))' }}
                >
                  Delete {selectedIds.size} Image{selectedIds.size > 1 ? 's' : ''}?
                </h3>
                <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
                  This action is risky and cannot be undone
                </p>
              </div>
            </div>

            <div
              className="p-3 rounded-lg mb-4"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            >
              <p className="text-sm text-red-600">
                <strong>Warning:</strong> Deleting images that are used in newsletter sections may cause broken images.
                Images currently in use will fail to delete.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleBulkDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : `Yes, Delete ${selectedIds.size} Image${selectedIds.size > 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
