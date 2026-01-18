'use client';

import {
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SectionCard } from './SectionCard';
import type { Section } from '@azalea/shared/types';

interface DragDropCanvasProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSectionSelect: (sectionId: string) => void;
  onSectionDelete: (sectionId: string) => void;
  onSectionDuplicate: (sectionId: string) => void;
  onSectionToggleVisibility: (sectionId: string) => void;
}

export function DragDropCanvas({
  sections,
  selectedSectionId,
  onSectionSelect,
  onSectionDelete,
  onSectionDuplicate,
  onSectionToggleVisibility,
}: DragDropCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
    data: {
      type: 'canvas',
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-4 min-h-[200px] rounded-lg transition-colors ${
        isOver ? 'ring-2 ring-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.05)]' : ''
      }`}
    >
      <SortableContext
        items={sections.map((s) => s._id)}
        strategy={verticalListSortingStrategy}
      >
        {sections.map((section) => (
          <SectionCard
            key={section._id}
            section={section}
            isSelected={section._id === selectedSectionId}
            onSelect={() => onSectionSelect(section._id)}
            onDelete={() => onSectionDelete(section._id)}
            onDuplicate={() => onSectionDuplicate(section._id)}
            onToggleVisibility={() => onSectionToggleVisibility(section._id)}
          />
        ))}
      </SortableContext>

      {sections.length === 0 && isOver && (
        <div className="text-center py-8 border-2 border-dashed border-[rgb(var(--accent))] rounded-lg">
          <p className="text-sm font-medium" style={{ color: 'rgb(var(--accent))' }}>
            Drop here to add section
          </p>
        </div>
      )}
    </div>
  );
}
