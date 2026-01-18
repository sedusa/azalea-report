'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { SectionDefinition } from '@azalea/shared/constants';
import type { SectionType } from '@azalea/shared/types';

interface DraggablePaletteItemProps {
  section: SectionDefinition;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

export function DraggablePaletteItem({ section, icon: Icon, onClick }: DraggablePaletteItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${section.type}`,
    data: {
      type: 'palette-item',
      sectionType: section.type as SectionType,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="palette-item text-left"
    >
      <div className="palette-icon-wrapper">
        <Icon className="palette-icon" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold mb-0.5" style={{ color: 'rgb(var(--text-primary))' }}>
          {section.label}
        </p>
        <p className="text-xs line-clamp-2" style={{ color: 'rgb(var(--text-secondary))' }}>
          {section.description}
        </p>
      </div>
    </button>
  );
}
