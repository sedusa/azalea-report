'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button, Modal } from '@azalea/ui';
import { MediaLibrary } from './MediaLibrary';
import { LuPlus, LuX, LuGripVertical, LuImage, LuPencil } from 'react-icons/lu';

interface CarouselSlide {
  title: string;
  mediaId: string;
}

interface CarouselSlidesArrayEditorProps {
  value?: CarouselSlide[];
  onChange: (slides: CarouselSlide[]) => void;
  label?: string;
  required?: boolean;
  maxItems?: number;
}

export function CarouselSlidesArrayEditor({
  value = [],
  onChange,
  label = 'Carousel Slides',
  required = false,
  maxItems = 20,
}: CarouselSlidesArrayEditorProps) {
  const [showBrowser, setShowBrowser] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const allMedia = useQuery(api.media.list, {}) || [];

  const getMediaDetails = (mediaId: string) => {
    return allMedia.find((m) => m._id === mediaId || m.url === mediaId);
  };

  const handleAddSlide = () => {
    if (value.length >= maxItems) return;
    setEditingIndex(null);
    setShowBrowser(true);
  };

  const handleSelectImage = (mediaId: Id<'media'>) => {
    if (editingIndex !== null) {
      const newValue = [...value];
      newValue[editingIndex] = { ...newValue[editingIndex], mediaId };
      onChange(newValue);
      setEditingIndex(null);
    } else {
      onChange([...value, { title: '', mediaId }]);
    }
    setShowBrowser(false);
  };

  const handleRemoveSlide = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleTitleChange = (index: number, title: string) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], title };
    onChange(newValue);
  };

  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    setShowBrowser(true);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newValue = [...value];
    [newValue[index - 1], newValue[index]] = [newValue[index], newValue[index - 1]];
    onChange(newValue);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const newValue = [...value];
    [newValue[index], newValue[index + 1]] = [newValue[index + 1], newValue[index]];
    onChange(newValue);
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
          ({value.length}/{maxItems})
        </span>
      </label>

      {value.length > 0 ? (
        <div className="space-y-3 mb-4">
          {value.map((slide, index) => {
            const media = getMediaDetails(slide.mediaId);
            const imageUrl = media?.url || (slide.mediaId.startsWith('http') ? slide.mediaId : null);

            return (
              <div
                key={`${slide.mediaId}-${index}`}
                className="flex gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}
              >
                {/* Reorder */}
                <div className="flex flex-col items-center justify-center gap-1">
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
                  <LuGripVertical className="w-4 h-4" style={{ color: 'rgb(var(--text-tertiary))' }} />
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === value.length - 1}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditImage(index)}
                    className="w-24 h-16 rounded-lg overflow-hidden relative group cursor-pointer border-2 border-transparent hover:border-green-500 transition-colors"
                    style={{ backgroundColor: 'rgb(var(--bg-secondary))' }}
                    title="Click to change image"
                  >
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={slide.title || `Slide ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <LuPencil className="w-5 h-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <LuImage className="w-6 h-6" style={{ color: 'rgb(var(--text-tertiary))' }} />
                      </div>
                    )}
                  </button>
                </div>

                {/* Title */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>
                      Slide {index + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={slide.title || ''}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    placeholder="Slide title overlay..."
                    className="w-full px-3 py-2 text-sm rounded-md border"
                    style={{
                      backgroundColor: 'rgb(var(--bg-primary))',
                      borderColor: 'rgb(var(--border-primary))',
                      color: 'rgb(var(--text-primary))',
                    }}
                  />
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemoveSlide(index)}
                  className="self-start p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                  title="Remove slide"
                >
                  <LuX className="w-4 h-4" />
                </button>
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
          No slides added. Click below to add a carousel slide.
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        fullWidth
        onClick={handleAddSlide}
        disabled={value.length >= maxItems}
      >
        <LuPlus className="w-4 h-4 mr-2" />
        Add Slide
      </Button>

      {value.length >= maxItems && (
        <p className="text-xs mt-2 text-center" style={{ color: 'rgb(var(--text-secondary))' }}>
          Maximum of {maxItems} slides reached
        </p>
      )}

      <Modal
        isOpen={showBrowser}
        onClose={() => { setShowBrowser(false); setEditingIndex(null); }}
        title={editingIndex !== null ? 'Change Slide Image' : 'Select Slide Image'}
        size="xl"
      >
        <div className="h-[600px]">
          <MediaLibrary
            mode="select"
            onSelect={handleSelectImage}
          />
        </div>
      </Modal>
    </div>
  );
}
