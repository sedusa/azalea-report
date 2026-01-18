'use client';

import { useState } from 'react';
import { Input } from '@azalea/ui';
import { TiptapEditor } from './TiptapEditor';
import { ImagePicker } from './ImagePicker';
import type { Id } from '@convex/_generated/dataModel';
import { LuPlus, LuTrash2, LuChevronDown, LuChevronUp } from 'react-icons/lu';

interface PersonData {
  name: string;
  image?: string;
  content: string;
}

interface PersonArrayEditorProps {
  label: string;
  value: PersonData[] | undefined;
  onChange: (value: PersonData[]) => void;
  personLabel: string; // "Chief" or "Intern"
  maxItems?: number;
}

export function PersonArrayEditor({
  label,
  value = [],
  onChange,
  personLabel,
  maxItems = 4,
}: PersonArrayEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(value.length > 0 ? 0 : null);

  const handleAdd = () => {
    if (value.length >= maxItems) return;
    const newPerson: PersonData = {
      name: '',
      image: '',
      content: '',
    };
    onChange([...value, newPerson]);
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

  const handleUpdate = (index: number, field: keyof PersonData, fieldValue: unknown) => {
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
            Add {personLabel}
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
          <p className="text-sm mb-2">No {personLabel.toLowerCase()}s added yet</p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-sm font-medium hover:underline"
            style={{ color: 'rgb(var(--accent-primary))' }}
          >
            Add your first {personLabel.toLowerCase()}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((person, index) => (
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
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: 'rgb(var(--accent-primary))',
                      color: 'white',
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="font-medium" style={{ color: 'rgb(var(--text-primary))' }}>
                    {person.name || `${personLabel} ${index + 1}`}
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
                    title={`Remove ${personLabel}`}
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
                  {/* Name */}
                  <Input
                    label={`${personLabel}'s Name`}
                    placeholder={`Dr. Jane Smith`}
                    value={person.name || ''}
                    onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                    required
                  />

                  {/* Image */}
                  <ImagePicker
                    label="Photo"
                    value={person.image as Id<'media'> | null}
                    onChange={(val) => handleUpdate(index, 'image', val)}
                    required={false}
                  />

                  {/* Content/Bio */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
                      Bio / Message
                    </label>
                    <TiptapEditor
                      content={person.content || ''}
                      onChange={(val) => handleUpdate(index, 'content', val)}
                      placeholder={`Write a bio or message from this ${personLabel.toLowerCase()}...`}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && value.length < maxItems && (
        <p className="text-xs mt-2" style={{ color: 'rgb(var(--text-tertiary))' }}>
          {value.length} of {maxItems} {personLabel.toLowerCase()}s added.
          {value.length === 1 ? ' Add one more for two-column layout.' : ''}
        </p>
      )}
    </div>
  );
}
