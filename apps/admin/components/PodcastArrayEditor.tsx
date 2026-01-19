'use client';

import { useState } from 'react';
import { Input, Textarea } from '@azalea/ui';
import { LuPlus, LuTrash2, LuChevronDown, LuChevronUp, LuMic } from 'react-icons/lu';

interface PodcastEpisode {
  title: string;
  description: string;
  buttonUrl: string;
  buttonText: string;
}

interface PodcastArrayEditorProps {
  label: string;
  value: PodcastEpisode[] | undefined;
  onChange: (value: PodcastEpisode[]) => void;
  maxItems?: number;
}

export function PodcastArrayEditor({
  label,
  value = [],
  onChange,
  maxItems = 5,
}: PodcastArrayEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(value.length > 0 ? 0 : null);

  const handleAdd = () => {
    if (value.length >= maxItems) return;
    const newEpisode: PodcastEpisode = {
      title: '',
      description: '',
      buttonUrl: '',
      buttonText: '',
    };
    onChange([...value, newEpisode]);
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

  const handleUpdate = (index: number, field: keyof PodcastEpisode, fieldValue: string) => {
    const newValue = [...value];
    newValue[index] = {
      ...newValue[index],
      [field]: fieldValue,
    };
    onChange(newValue);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
          {label}
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
            Add Episode
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
          <LuMic size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm mb-2">No episodes added yet</p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-sm font-medium hover:underline"
            style={{ color: 'rgb(var(--accent-primary))' }}
          >
            Add your first episode
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((episode, index) => (
            <div
              key={index}
              className="rounded-lg border overflow-hidden"
              style={{
                borderColor: 'rgb(var(--border-primary))',
                backgroundColor: 'rgb(var(--bg-secondary))',
              }}
            >
              {/* Header - always visible */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => toggleExpand(index)}
                style={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgb(var(--accent-primary))',
                      color: 'white',
                    }}
                  >
                    <LuMic size={16} />
                  </span>
                  <span className="font-medium" style={{ color: 'rgb(var(--text-primary))' }}>
                    {episode.title || `Episode ${index + 1}`}
                  </span>
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
                    title="Remove Episode"
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
                  {/* Episode Title */}
                  <Input
                    label="Episode Title"
                    placeholder="Episode #5 - Joseph Hayes, MD"
                    value={episode.title || ''}
                    onChange={(e) => handleUpdate(index, 'title', e.target.value)}
                    required
                  />

                  {/* Description */}
                  <Textarea
                    label="Description"
                    placeholder="This episode of the podcast features..."
                    value={episode.description || ''}
                    onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                    rows={3}
                  />

                  {/* Button URL */}
                  <Input
                    label="Button URL"
                    placeholder="https://open.spotify.com/episode/..."
                    value={episode.buttonUrl || ''}
                    onChange={(e) => handleUpdate(index, 'buttonUrl', e.target.value)}
                    required
                  />

                  {/* Button Text */}
                  <Input
                    label="Button Text"
                    placeholder="Listen to Episode 5 with Dr. Joseph Hayes on Spotify"
                    value={episode.buttonText || ''}
                    onChange={(e) => handleUpdate(index, 'buttonText', e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && value.length < maxItems && (
        <p className="text-xs mt-2" style={{ color: 'rgb(var(--text-tertiary))' }}>
          {value.length} of {maxItems} episodes added.
        </p>
      )}
    </div>
  );
}
