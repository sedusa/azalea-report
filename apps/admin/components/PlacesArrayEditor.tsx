'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button, Modal } from '@azalea/ui';
import { MediaLibrary } from './MediaLibrary';
import { LuPlus, LuTrash2, LuChevronDown, LuChevronUp, LuImage, LuPencil } from 'react-icons/lu';

interface PlaceItem {
  name: string;
  type: string;
  description: string;
  location: string;
  googleMapsUrl?: string | null;
  mediaId?: string;
  link?: string | null;
}

interface PlacesArrayEditorProps {
  value?: PlaceItem[];
  onChange: (places: PlaceItem[]) => void;
  label?: string;
  required?: boolean;
  maxItems?: number;
}

export function PlacesArrayEditor({
  value = [],
  onChange,
  label = 'Places',
  required = false,
  maxItems = 20,
}: PlacesArrayEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(value.length > 0 ? 0 : null);
  const [showBrowser, setShowBrowser] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const allMedia = useQuery(api.media.list, {}) || [];

  const getMediaDetails = (mediaId?: string) => {
    if (!mediaId) return null;
    return allMedia.find((m) => m._id === mediaId || m.url === mediaId);
  };

  const handleAdd = () => {
    if (value.length >= maxItems) return;
    const newPlace: PlaceItem = {
      name: '',
      type: '',
      description: '',
      location: '',
      googleMapsUrl: '',
      mediaId: undefined,
      link: '',
    };
    onChange([...value, newPlace]);
    setExpandedIndex(value.length);
  };

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
    if (expandedIndex === index) {
      setExpandedIndex(newValue.length > 0 ? 0 : null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleUpdate = (index: number, field: keyof PlaceItem, fieldValue: unknown) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], [field]: fieldValue };
    onChange(newValue);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    setShowBrowser(true);
  };

  const handleSelectImage = (mediaId: Id<'media'>) => {
    if (editingIndex !== null) {
      handleUpdate(editingIndex, 'mediaId', mediaId);
      setEditingIndex(null);
    }
    setShowBrowser(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          <span className="text-xs font-normal ml-2" style={{ color: 'rgb(var(--text-secondary))' }}>
            ({value.length}/{maxItems})
          </span>
        </label>
        {value.length < maxItems && (
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'rgb(var(--accent-primary))',
              color: 'white',
            }}
          >
            <LuPlus size={14} />
            Add Place
          </button>
        )}
      </div>

      {value.length === 0 ? (
        <div
          className="text-center py-8 rounded-lg border-2 border-dashed"
          style={{
            borderColor: 'rgb(var(--border-primary))',
            color: 'rgb(var(--text-secondary))',
          }}
        >
          <p className="text-sm mb-2">No places added yet</p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-sm font-medium hover:underline"
            style={{ color: 'rgb(var(--accent-primary))' }}
          >
            Add your first place
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((place, index) => {
            const media = getMediaDetails(place.mediaId);
            const imageUrl = media?.url || (place.mediaId?.startsWith('http') ? place.mediaId : null);

            return (
              <div
                key={index}
                className="rounded-lg border overflow-hidden"
                style={{
                  borderColor: 'rgb(var(--border-primary))',
                  backgroundColor: 'rgb(var(--bg-secondary))',
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer"
                  onClick={() => toggleExpand(index)}
                  style={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: 'rgb(var(--accent-primary))',
                        color: 'white',
                      }}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium" style={{ color: 'rgb(var(--text-primary))' }}>
                      {place.name || `Place ${index + 1}`}
                    </span>
                    {place.type && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgb(var(--bg-primary))', color: 'rgb(var(--text-secondary))' }}>
                        {place.type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(index);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 transition-colors"
                      style={{ color: 'rgb(var(--status-error))' }}
                      title="Remove place"
                    >
                      <LuTrash2 size={16} />
                    </button>
                    {expandedIndex === index ? (
                      <LuChevronUp size={20} style={{ color: 'rgb(var(--text-secondary))' }} />
                    ) : (
                      <LuChevronDown size={20} style={{ color: 'rgb(var(--text-secondary))' }} />
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {expandedIndex === index && (
                  <div className="p-4 space-y-4 border-t" style={{ borderColor: 'rgb(var(--border-primary))' }}>
                    {/* Image */}
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'rgb(var(--text-tertiary))' }}>
                        Photo
                      </label>
                      <button
                        type="button"
                        onClick={() => handleEditImage(index)}
                        className="w-full h-32 rounded-lg overflow-hidden relative group cursor-pointer border-2 border-dashed hover:border-green-500 transition-colors"
                        style={{
                          borderColor: 'rgb(var(--border-primary))',
                          backgroundColor: 'rgb(var(--bg-tertiary))',
                        }}
                        title="Click to select image"
                      >
                        {imageUrl ? (
                          <>
                            <img
                              src={imageUrl}
                              alt={place.name || 'Place image'}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <LuPencil className="w-6 h-6 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center gap-2" style={{ color: 'rgb(var(--text-tertiary))' }}>
                            <LuImage className="w-6 h-6" />
                            <span className="text-sm">Click to add image</span>
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'rgb(var(--text-tertiary))' }}>
                        Name
                      </label>
                      <input
                        type="text"
                        value={place.name || ''}
                        onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                        placeholder="e.g., Wild Adventures Theme Park"
                        className="w-full px-3 py-2 text-sm rounded-md border"
                        style={{
                          backgroundColor: 'rgb(var(--bg-primary))',
                          borderColor: 'rgb(var(--border-primary))',
                          color: 'rgb(var(--text-primary))',
                        }}
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'rgb(var(--text-tertiary))' }}>
                        Type
                      </label>
                      <input
                        type="text"
                        value={place.type || ''}
                        onChange={(e) => handleUpdate(index, 'type', e.target.value)}
                        placeholder="e.g., Restaurant, Park, Museum..."
                        className="w-full px-3 py-2 text-sm rounded-md border"
                        style={{
                          backgroundColor: 'rgb(var(--bg-primary))',
                          borderColor: 'rgb(var(--border-primary))',
                          color: 'rgb(var(--text-primary))',
                        }}
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'rgb(var(--text-tertiary))' }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={place.location || ''}
                        onChange={(e) => handleUpdate(index, 'location', e.target.value)}
                        placeholder="e.g., 3766 Old Clyattville Rd, Valdosta"
                        className="w-full px-3 py-2 text-sm rounded-md border"
                        style={{
                          backgroundColor: 'rgb(var(--bg-primary))',
                          borderColor: 'rgb(var(--border-primary))',
                          color: 'rgb(var(--text-primary))',
                        }}
                      />
                    </div>

                    {/* Google Maps URL */}
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'rgb(var(--text-tertiary))' }}>
                        Google Maps URL (optional)
                      </label>
                      <input
                        type="url"
                        value={place.googleMapsUrl || ''}
                        onChange={(e) => handleUpdate(index, 'googleMapsUrl', e.target.value || null)}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-3 py-2 text-sm rounded-md border"
                        style={{
                          backgroundColor: 'rgb(var(--bg-primary))',
                          borderColor: 'rgb(var(--border-primary))',
                          color: 'rgb(var(--text-primary))',
                        }}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'rgb(var(--text-tertiary))' }}>
                        Description
                      </label>
                      <textarea
                        value={place.description || ''}
                        onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                        placeholder="Brief description of this place..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm rounded-md border resize-y"
                        style={{
                          backgroundColor: 'rgb(var(--bg-primary))',
                          borderColor: 'rgb(var(--border-primary))',
                          color: 'rgb(var(--text-primary))',
                        }}
                      />
                    </div>

                    {/* Link */}
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'rgb(var(--text-tertiary))' }}>
                        Website Link (optional)
                      </label>
                      <input
                        type="url"
                        value={place.link || ''}
                        onChange={(e) => handleUpdate(index, 'link', e.target.value || null)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-sm rounded-md border"
                        style={{
                          backgroundColor: 'rgb(var(--bg-primary))',
                          borderColor: 'rgb(var(--border-primary))',
                          color: 'rgb(var(--text-primary))',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {value.length > 0 && value.length < maxItems && (
        <div className="mt-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth
            onClick={handleAdd}
          >
            <LuPlus className="w-4 h-4 mr-2" />
            Add Place
          </Button>
        </div>
      )}

      <Modal
        isOpen={showBrowser}
        onClose={() => { setShowBrowser(false); setEditingIndex(null); }}
        title="Select Place Image"
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
