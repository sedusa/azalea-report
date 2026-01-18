'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { SectionCard } from './SectionCard';
import type { Section } from '@azalea/shared/types';

interface DragDropCanvasProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSectionSelect: (sectionId: string) => void;
  onSectionReorder: (sectionIds: string[]) => void;
  onSectionDelete: (sectionId: string) => void;
  onSectionDuplicate: (sectionId: string) => void;
  onSectionToggleVisibility: (sectionId: string) => void;
}

export function DragDropCanvas({
  sections,
  selectedSectionId,
  onSectionSelect,
  onSectionReorder,
  onSectionDelete,
  onSectionDuplicate,
  onSectionToggleVisibility,
}: DragDropCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s._id === active.id);
      const newIndex = sections.findIndex((s) => s._id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      onSectionReorder(newSections.map((s) => s._id));
    }
  };

  const activeSection = sections.find((s) => s._id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
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
      </div>

      <DragOverlay>
        {activeSection ? (
          <div className="opacity-50">
            <SectionCard
              section={activeSection}
              isSelected={false}
              onSelect={() => {}}
              onDelete={() => {}}
              onDuplicate={() => {}}
              onToggleVisibility={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
