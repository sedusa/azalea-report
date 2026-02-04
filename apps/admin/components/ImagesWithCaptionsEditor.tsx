'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button, Modal } from '@azalea/ui';
import { MediaLibrary } from './MediaLibrary';
import { LuImage, LuX, LuFolder, LuPencil } from 'react-icons/lu';

interface ImageWithCaption {
  mediaId: string;
  caption?: string;
}

interface ImagesWithCaptionsEditorProps {
  value?: ImageWithCaption[];
  onChange: (images: ImageWithCaption[]) => void;
  label?: string;
  required?: boolean;
  maxImages?: number;
}

/**
 * ImagesWithCaptionsEditor - For selecting multiple images with individual captions
 * Used for carousels and photo galleries where each image needs a caption
 */
export function ImagesWithCaptionsEditor({
  value = [],
  onChange,
  label = 'Images',
  required = false,
  maxImages = 10,
}: ImagesWithCaptionsEditorProps) {
  const [showBrowser, setShowBrowser] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const hasCleanedUp = useRef(false);

  // Get all media to resolve URLs
  const allMedia = useQuery(api.media.list, {}) || [];

  // Filter out entries with empty mediaId - these are invalid
  const validImages = value.filter(img => img.mediaId && img.mediaId.trim() !== '');

  // Clean up empty entries on mount only (once)
  useEffect(() => {
    if (!hasCleanedUp.current && value.length > 0 && validImages.length !== value.length) {
      // There are empty entries, clean them up
      hasCleanedUp.current = true;
      const cleaned = value.filter(img => img.mediaId && img.mediaId.trim() !== '');
      onChange(cleaned);
    }
  }, []);

  // Auto-heal: convert any URL-based mediaIds back to proper media IDs
  const hasHealedUrls = useRef(false);
  useEffect(() => {
    if (!hasHealedUrls.current && allMedia.length > 0 && validImages.length > 0) {
      let needsHeal = false;
      const healed = validImages.map((img) => {
        if (img.mediaId.startsWith('http://') || img.mediaId.startsWith('https://')) {
          const media = allMedia.find((m) => m.url === img.mediaId);
          if (media) {
            needsHeal = true;
            return { ...img, mediaId: media._id };
          }
        }
        return img;
      });
      if (needsHeal) {
        hasHealedUrls.current = true;
        onChange(healed);
      }
    }
  }, [allMedia, validImages]);

  // Get media details for selected images
  const getMediaDetails = (mediaId: string) => {
    return allMedia.find((m) => m._id === mediaId || m.url === mediaId);
  };

  const handleAddImage = (mediaId: Id<'media'>) => {
    if (editingIndex !== null) {
      // Replacing an existing image
      const newValue = [...validImages];
      newValue[editingIndex] = { ...newValue[editingIndex], mediaId };
      onChange(newValue);
      setEditingIndex(null);
    } else {
      // Adding a new image
      if (validImages.length >= maxImages) {
        setShowBrowser(false);
        return;
      }
      // Check if already added
      if (validImages.some((img) => img.mediaId === mediaId)) {
        setShowBrowser(false);
        return;
      }
      onChange([...validImages, { mediaId, caption: '' }]);
    }
    setShowBrowser(false);
  };

  const handleRemoveImage = (index: number) => {
    const newValue = [...validImages];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const newValue = [...validImages];
    newValue[index] = { ...newValue[index], caption };
    onChange(newValue);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newValue = [...validImages];
    [newValue[index - 1], newValue[index]] = [newValue[index], newValue[index - 1]];
    onChange(newValue);
  };

  const handleMoveDown = (index: number) => {
    if (index === validImages.length - 1) return;
    const newValue = [...validImages];
    [newValue[index], newValue[index + 1]] = [newValue[index + 1], newValue[index]];
    onChange(newValue);
  };

  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    setShowBrowser(true);
  };

  const handleOpenBrowser = () => {
    setEditingIndex(null);
    setShowBrowser(true);
  };

  const handleCloseBrowser = () => {
    setShowBrowser(false);
    setEditingIndex(null);
  };

  return (
    <div>
      <label
        className="block text-sm font-semibold mb-2"
        style={{ color: 'rgb(var(--text-primary))' }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        <span className="text-xs font-normal ml-2" style={{ color: 'rgb(var(--text-secondary))' }}>
          ({validImages.length}/{maxImages})
        </span>
      </label>

      {/* Selected Images List */}
      {validImages.length > 0 ? (
        <div className="space-y-3 mb-4">
          {validImages.map((img, index) => {
            const media = getMediaDetails(img.mediaId);
            const imageUrl = media?.url || (img.mediaId.startsWith('http') ? img.mediaId : null);

            return (
              <div
                key={`${img.mediaId}-${index}`}
                className="flex gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}
              >
                {/* Thumbnail - Clickable to change image */}
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditImage(index)}
                    className="w-24 h-24 rounded-lg overflow-hidden relative group cursor-pointer border-2 border-transparent hover:border-green-500 transition-colors"
                    style={{ backgroundColor: 'rgb(var(--bg-secondary))' }}
                    title="Click to change image"
                  >
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={img.caption || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <LuPencil className="w-6 h-6 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <LuImage className="w-8 h-8" style={{ color: 'rgb(var(--text-tertiary))' }} />
                      </div>
                    )}
                  </button>
                </div>

                {/* Caption and Controls */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs font-medium"
                        style={{ color: 'rgb(var(--text-secondary))' }}
                      >
                        Image {index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        {/* Move Up/Down Buttons */}
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === validImages.length - 1}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                          title="Remove image"
                        >
                          <LuX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {/* Caption Input */}
                    <input
                      type="text"
                      value={img.caption || ''}
                      onChange={(e) => handleCaptionChange(index, e.target.value)}
                      placeholder="Enter caption for this image..."
                      className="w-full px-3 py-2 text-sm rounded-md border"
                      style={{
                        backgroundColor: 'rgb(var(--bg-primary))',
                        borderColor: 'rgb(var(--border-primary))',
                        color: 'rgb(var(--text-primary))',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="mb-4 p-4 rounded-lg text-center text-sm"
          style={{
            backgroundColor: 'rgb(var(--bg-tertiary))',
            color: 'rgb(var(--text-secondary))',
          }}
        >
          No images selected. Click below to add images to the carousel.
        </div>
      )}

      {/* Add More Button */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        fullWidth
        onClick={handleOpenBrowser}
        disabled={validImages.length >= maxImages}
      >
        <LuFolder className="w-4 h-4 mr-2" />
        {validImages.length === 0 ? 'Add Images' : 'Add More Images'}
      </Button>

      {validImages.length >= maxImages && (
        <p className="text-xs mt-2 text-center" style={{ color: 'rgb(var(--text-secondary))' }}>
          Maximum of {maxImages} images reached
        </p>
      )}

      {/* Full Media Library Modal */}
      <Modal
        isOpen={showBrowser}
        onClose={handleCloseBrowser}
        title={editingIndex !== null ? 'Change Image' : 'Select Image'}
        size="xl"
      >
        <div className="h-[600px]">
          <MediaLibrary
            mode="select"
            onSelect={handleAddImage}
          />
        </div>
      </Modal>
    </div>
  );
}
