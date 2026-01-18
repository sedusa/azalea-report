'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button, Input, Card } from '@azalea/ui';
import { toast } from 'sonner';
import {
  LuUpload,
  LuSearch,
  LuTrash2,
  LuImage,
  LuFileImage,
  LuX
} from 'react-icons/lu';

interface MediaLibraryProps {
  onSelect?: (mediaId: Id<'media'>) => void;
  selectedMediaId?: Id<'media'> | null;
  mode?: 'select' | 'manage';
}

export function MediaLibrary({
  onSelect,
  selectedMediaId = null,
  mode = 'manage'
}: MediaLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForDelete, setSelectedForDelete] = useState<Id<'media'> | null>(null);
  const [uploading, setUploading] = useState(false);

  // Queries
  const allMedia = useQuery(api.media.list) || [];
  const canDeleteMedia = useQuery(
    api.media.canDelete,
    selectedForDelete ? { mediaId: selectedForDelete } : 'skip'
  );

  // Mutations
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const createMedia = useMutation(api.media.create);
  const deleteMedia = useMutation(api.media.remove);

  // Filter media by search query
  const filteredMedia = searchQuery
    ? allMedia.filter((media) =>
        media.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        media.altText?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allMedia;

  // Sort by upload date (newest first)
  const sortedMedia = [...filteredMedia].sort(
    (a, b) => b.uploadedAt - a.uploadedAt
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);

      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await result.json();

      // Step 3: Create media record
      await createMedia({
        storageId,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        altText: '',
        userId: 'temp-user-id' as Id<'users'>, // TODO: Replace with real user ID
      });

      toast.success('Image uploaded successfully');

      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedForDelete) return;

    try {
      await deleteMedia({
        id: selectedForDelete,
        userId: 'temp-user-id' as Id<'users'>, // TODO: Replace with real user ID
      });

      toast.success('Image deleted');
      setSelectedForDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Media Library</h2>
          {mode === 'manage' && (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <Button
                as="span"
                variant="primary"
                size="sm"
                disabled={uploading}
              >
                <LuUpload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </label>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by filename or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span>{sortedMedia.length} images</span>
          {searchQuery && (
            <span className="text-azalea-green">
              Filtered from {allMedia.length} total
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {sortedMedia.length === 0 ? (
          <div className="text-center py-12">
            <LuFileImage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchQuery ? 'No images found' : 'No images yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? 'Try a different search term'
                : 'Get started by uploading an image'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedMedia.map((media) => (
              <Card
                key={media._id}
                className={`relative group cursor-pointer transition-all ${
                  selectedMediaId === media._id
                    ? 'ring-2 ring-azalea-green'
                    : 'hover:shadow-md'
                }`}
                onClick={() => onSelect?.(media._id)}
              >
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  {media.url ? (
                    <img
                      src={media.url}
                      alt={media.altText || media.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <LuImage className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    {mode === 'manage' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedForDelete(media._id);
                        }}
                      >
                        <LuTrash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Selected indicator */}
                  {selectedMediaId === media._id && (
                    <div className="absolute top-2 right-2 bg-azalea-green text-white rounded-full p-1">
                      <svg
                        className="w-4 h-4"
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
                <div className="p-2">
                  <p className="text-xs text-gray-700 truncate font-medium">
                    {media.filename}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(media.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {selectedForDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Image
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {canDeleteMedia?.canDelete
                ? 'Are you sure you want to delete this image?'
                : 'This image is being used in sections and cannot be deleted.'}
            </p>
            {!canDeleteMedia?.canDelete && canDeleteMedia?.usageCount && (
              <p className="text-sm text-red-600 mb-4">
                Used in {canDeleteMedia.usageCount} section(s)
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedForDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={!canDeleteMedia?.canDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
