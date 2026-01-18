'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

export function SectionCard({
  section,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleVisibility,
}: SectionCardProps) {
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
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
              {sectionDef.label}
            </h4>
            {!section.visible && (
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor: 'rgb(var(--bg-accent))',
                  color: 'rgb(var(--text-secondary))'
                }}
              >
                Hidden
              </span>
            )}
          </div>
          <p className="text-sm line-clamp-1" style={{ color: 'rgb(var(--text-secondary))' }}>
            {sectionDef.description}
          </p>
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
