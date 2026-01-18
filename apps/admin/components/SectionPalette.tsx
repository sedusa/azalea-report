'use client';

import { SECTION_REGISTRY } from '@azalea/shared/constants';
import type { SectionType } from '@azalea/shared/types';
import * as LucideIcons from 'react-icons/lu';

interface SectionPaletteProps {
  onAddSection: (type: SectionType) => void;
}

// Map icon names from registry to Lucide React icons
const getIcon = (iconName: string) => {
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
          Click to add a section to your issue
        </p>
      </div>

      <div className="space-y-3">
        {sectionTypes.map((section) => {
          const Icon = getIcon(section.icon);

          return (
            <button
              key={section.type}
              onClick={() => onAddSection(section.type)}
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
        })}
      </div>
    </div>
  );
}
