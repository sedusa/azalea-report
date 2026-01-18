'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button, Modal } from '@azalea/ui';
import { MediaLibrary } from './MediaLibrary';
import { LuImage, LuX, LuFolder } from 'react-icons/lu';

interface ImagePickerProps {
  value?: Id<'media'> | null;
  onChange: (mediaId: Id<'media'> | null) => void;
  label?: string;
  required?: boolean;
}

/**
 * ImagePicker component for selecting images
 * Shows 6-8 recent images inline, with "Browse all" button for full library
 */
export function ImagePicker({
  value,
  onChange,
  label = 'Image',
  required = false,
}: ImagePickerProps) {
  const [showBrowser, setShowBrowser] = useState(false);

  // Get recent media (first 8)
  const recentMedia = useQuery(api.media.list) || [];
  const recentMediaSlice = recentMedia
    .sort((a, b) => b.uploadedAt - a.uploadedAt)
    .slice(0, 8);

  // Get selected media details
  const selectedMedia = useQuery(
    api.media.get,
    value ? { id: value } : 'skip'
  );

  const handleSelect = (mediaId: Id<'media'>) => {
    onChange(mediaId);
    setShowBrowser(false);
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Selected Image Preview */}
      {value && selectedMedia ? (
        <div className="mb-3">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-azalea-green">
              {selectedMedia.url ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.altText || selectedMedia.filename}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <LuImage className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <LuX className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {selectedMedia.filename}
          </p>
        </div>
      ) : (
        <div className="mb-3 text-sm text-gray-500">No image selected</div>
      )}

      {/* Recent Images Grid */}
      {recentMediaSlice.length > 0 && (
        <>
          <div className="text-xs font-medium text-gray-700 mb-2">
            Recent Images
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {recentMediaSlice.map((media) => (
              <button
                key={media._id}
                type="button"
                onClick={() => handleSelect(media._id)}
                className={`aspect-square rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-azalea-green transition-all ${
                  value === media._id ? 'ring-2 ring-azalea-green' : ''
                }`}
                title={media.filename}
              >
                {media.url ? (
                  <img
                    src={media.url}
                    alt={media.altText || media.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <LuImage className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Browse All Button */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        fullWidth
        onClick={() => setShowBrowser(true)}
      >
        <LuFolder className="w-4 h-4 mr-2" />
        Browse All Images
      </Button>

      {/* Full Media Library Modal */}
      <Modal
        isOpen={showBrowser}
        onClose={() => setShowBrowser(false)}
        title="Select Image"
        size="xl"
      >
        <div className="h-[600px]">
          <MediaLibrary
            mode="select"
            selectedMediaId={value}
            onSelect={handleSelect}
          />
        </div>
      </Modal>
    </div>
  );
}

interface MultiImagePickerProps {
  value?: Id<'media'>[];
  onChange: (mediaIds: Id<'media'>[]) => void;
  label?: string;
  required?: boolean;
  maxImages?: number;
}

/**
 * MultiImagePicker component for selecting multiple images
 * Used for carousels and photo galleries
 */
export function MultiImagePicker({
  value = [],
  onChange,
  label = 'Images',
  required = false,
  maxImages = 10,
}: MultiImagePickerProps) {
  const [showBrowser, setShowBrowser] = useState(false);

  // Get all selected media details
  const selectedMediaIds = value;
  const allMedia = useQuery(api.media.list) || [];
  const selectedMedia = allMedia.filter((m) => selectedMediaIds.includes(m._id));

  const handleAdd = (mediaId: Id<'media'>) => {
    if (value.length >= maxImages) {
      return;
    }
    if (!value.includes(mediaId)) {
      onChange([...value, mediaId]);
    }
    setShowBrowser(false);
  };

  const handleRemove = (mediaId: Id<'media'>) => {
    onChange(value.filter((id) => id !== mediaId));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newValue = [...value];
    const [removed] = newValue.splice(fromIndex, 1);
    newValue.splice(toIndex, 0, removed);
    onChange(newValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        <span className="text-xs text-gray-500 ml-2">
          ({value.length}/{maxImages})
        </span>
      </label>

      {/* Selected Images Grid */}
      {selectedMedia.length > 0 ? (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {selectedMedia.map((media, index) => (
            <div key={media._id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300">
                {media.url ? (
                  <img
                    src={media.url}
                    alt={media.altText || media.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <LuImage className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(media._id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove"
              >
                <LuX className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-3 text-sm text-gray-500">No images selected</div>
      )}

      {/* Add More Button */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        fullWidth
        onClick={() => setShowBrowser(true)}
        disabled={value.length >= maxImages}
      >
        <LuFolder className="w-4 h-4 mr-2" />
        {value.length === 0 ? 'Select Images' : 'Add More Images'}
      </Button>

      {/* Full Media Library Modal */}
      <Modal
        isOpen={showBrowser}
        onClose={() => setShowBrowser(false)}
        title="Select Images"
        size="xl"
      >
        <div className="h-[600px]">
          <MediaLibrary
            mode="select"
            onSelect={handleAdd}
          />
        </div>
      </Modal>
    </div>
  );
}
