'use client';

import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { SECTION_REGISTRY } from '@azalea/shared/constants';
import type { Section } from '@azalea/shared/types';
import { LuGripVertical, LuEye, LuEyeOff, LuCopy, LuTrash2 } from 'react-icons/lu';

interface SectionCardProps {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
}

type EditingField = 'label' | 'description' | null;

export function SectionCard({
  section,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleVisibility,
}: SectionCardProps) {
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const updateLabel = useMutation(api.sections.updateLabel);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sectionDef = SECTION_REGISTRY[section.type];
  const displayLabel = section.customLabel || sectionDef.label;
  const displayDescription = section.customDescription || sectionDef.description;

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  const handleStartEdit = (field: 'label' | 'description', e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(field === 'label' ? displayLabel : displayDescription);
    setEditingField(field);
  };

  const handleSave = async () => {
    if (!editingField) return;
    const trimmed = editValue.trim();

    if (editingField === 'label') {
      const newLabel = trimmed === '' || trimmed === sectionDef.label ? undefined : trimmed;
      await updateLabel({
        id: section._id as Id<'sections'>,
        customLabel: newLabel,
      });
    } else {
      const newDesc = trimmed === '' || trimmed === sectionDef.description ? undefined : trimmed;
      await updateLabel({
        id: section._id as Id<'sections'>,
        customDescription: newDesc,
      });
    }
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        section-card
        ${isSelected ? 'selected' : ''}
        ${isDragging ? 'opacity-50' : ''}
        ${!section.visible ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          className="drag-handle mt-1 flex-shrink-0"
          {...attributes}
          {...listeners}
        >
          <LuGripVertical className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onSelect}>
          {/* Title row */}
          <div className="flex items-center gap-2 mb-1">
            {editingField === 'label' ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-sm px-1.5 py-0.5 rounded border outline-none w-full"
                style={{
                  color: 'rgb(var(--text-primary))',
                  backgroundColor: 'rgb(var(--bg-primary))',
                  borderColor: 'rgb(var(--accent-primary))',
                }}
              />
            ) : (
              <h4
                className="font-semibold hover:underline decoration-dotted underline-offset-2 cursor-text"
                style={{ color: 'rgb(var(--text-primary))' }}
                onClick={(e) => handleStartEdit('label', e)}
                title="Click to rename"
              >
                {displayLabel}
              </h4>
            )}
            {!section.visible && (
              <span
                className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                style={{
                  backgroundColor: 'rgb(var(--bg-accent))',
                  color: 'rgb(var(--text-secondary))'
                }}
              >
                Hidden
              </span>
            )}
          </div>

          {/* Subtitle row */}
          {editingField === 'description' ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="text-sm px-1.5 py-0.5 rounded border outline-none w-full"
              style={{
                color: 'rgb(var(--text-secondary))',
                backgroundColor: 'rgb(var(--bg-primary))',
                borderColor: 'rgb(var(--accent-primary))',
              }}
            />
          ) : (
            <p
              className="text-sm line-clamp-1 hover:underline decoration-dotted underline-offset-2 cursor-text"
              style={{ color: 'rgb(var(--text-secondary))' }}
              onClick={(e) => handleStartEdit('description', e)}
              title="Click to edit subtitle"
            >
              {displayDescription}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className="p-2 rounded-md transition-all duration-200"
            style={{
              color: 'rgb(var(--text-tertiary))'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(var(--text-primary))';
              e.currentTarget.style.backgroundColor = 'rgb(var(--bg-accent))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgb(var(--text-tertiary))';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={section.visible ? 'Hide section' : 'Show section'}
          >
            {section.visible ? (
              <LuEye className="w-4 h-4" />
            ) : (
              <LuEyeOff className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-2 rounded-md transition-all duration-200"
            style={{
              color: 'rgb(var(--text-tertiary))'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(var(--text-primary))';
              e.currentTarget.style.backgroundColor = 'rgb(var(--bg-accent))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgb(var(--text-tertiary))';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Duplicate section"
          >
            <LuCopy className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this section?')) {
                onDelete();
              }
            }}
            className="p-2 rounded-md transition-all duration-200"
            style={{
              color: 'rgb(var(--text-tertiary))'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(239 68 68)';
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgb(var(--text-tertiary))';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Delete section"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
