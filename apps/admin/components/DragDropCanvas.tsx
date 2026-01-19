'use client';

import {
  useDroppable,
  useDndContext,
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

/**
 * DropZone - A drop indicator that appears between sections
 */
function DropZone({ index }: { index: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-zone-${index}`,
    data: {
      type: 'drop-zone',
      index,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative transition-all duration-200 ${
        isOver ? 'py-4' : 'py-1'
      }`}
    >
      <div
        className={`h-1 rounded-full transition-all duration-200 ${
          isOver
            ? 'bg-[rgb(var(--accent-primary))] opacity-100'
            : 'bg-transparent opacity-0 hover:bg-[rgb(var(--border-primary))] hover:opacity-50'
        }`}
      />
      {isOver && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <span
            className="px-3 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: 'rgb(var(--accent-primary))',
              color: 'white',
            }}
          >
            Drop here
          </span>
        </div>
      )}
    </div>
  );
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

  const { active } = useDndContext();
  const isDragging = !!active;
  const isDraggingFromPalette = active?.id?.toString().startsWith('palette-');

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] rounded-lg transition-colors ${
        isOver && sections.length === 0 ? 'ring-2 ring-[rgb(var(--accent))] bg-[rgb(var(--accent)/0.05)]' : ''
      }`}
    >
      <SortableContext
        items={sections.map((s) => s._id)}
        strategy={verticalListSortingStrategy}
      >
        {sections.length > 0 && isDragging && (
          <DropZone index={0} />
        )}

        {sections.map((section, index) => (
          <div key={section._id}>
            <SectionCard
              section={section}
              isSelected={section._id === selectedSectionId}
              onSelect={() => onSectionSelect(section._id)}
              onDelete={() => onSectionDelete(section._id)}
              onDuplicate={() => onSectionDuplicate(section._id)}
              onToggleVisibility={() => onSectionToggleVisibility(section._id)}
            />
            {isDragging && (
              <DropZone index={index + 1} />
            )}
          </div>
        ))}
      </SortableContext>

      {sections.length === 0 && (
        <div
          className={`text-center py-12 border-2 border-dashed rounded-lg transition-colors ${
            isOver
              ? 'border-[rgb(var(--accent-primary))] bg-[rgb(var(--accent-primary)/0.05)]'
              : 'border-[rgb(var(--border-primary))]'
          }`}
        >
          <p
            className="text-sm font-medium"
            style={{ color: isOver ? 'rgb(var(--accent-primary))' : 'rgb(var(--text-tertiary))' }}
          >
            {isOver ? 'Drop here to add section' : 'Drag sections here'}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: 'rgb(var(--text-tertiary))' }}
          >
            Drag from the palette on the left
          </p>
        </div>
      )}
    </div>
  );
}
