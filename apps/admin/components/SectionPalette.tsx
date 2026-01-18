'use client';

import { SECTION_REGISTRY } from '@azalea/shared/constants';
import type { SectionType } from '@azalea/shared/types';
import * as LucideIcons from 'react-icons/lu';
import { DraggablePaletteItem } from './DraggablePaletteItem';

interface SectionPaletteProps {
  onAddSection: (type: SectionType) => void;
}

// Map icon names from registry to Lucide React icons
export const getIcon = (iconName: string) => {
  // Convert icon name to PascalCase for Lucide
  const pascalName = iconName
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const iconKey = `Lu${pascalName}` as keyof typeof LucideIcons;
  const Icon = LucideIcons[iconKey] as React.ComponentType<{ className?: string }>;

  return Icon || LucideIcons.LuSquare;
};

export function SectionPalette({ onAddSection }: SectionPaletteProps) {
  const sectionTypes = Object.values(SECTION_REGISTRY);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h3 className="text-base font-bold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
          Add Section
        </h3>
        <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          Drag or click to add a section
        </p>
      </div>

      <div className="space-y-3">
        {sectionTypes.map((section) => {
          const Icon = getIcon(section.icon);

          return (
            <DraggablePaletteItem
              key={section.type}
              section={section}
              icon={Icon}
              onClick={() => onAddSection(section.type)}
            />
          );
        })}
      </div>
    </div>
  );
}
