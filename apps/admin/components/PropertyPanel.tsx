'use client';

import { SECTION_REGISTRY } from '@azalea/shared/constants';
import type { Section } from '@azalea/shared/types';
import { Input, Textarea } from '@azalea/ui';
import { PropertyField } from './PropertyField';

interface PropertyPanelProps {
  section: Section | null;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function PropertyPanel({ section, onUpdate }: PropertyPanelProps) {
  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <svg
          className="w-16 h-16 mb-4"
          style={{ color: 'rgb(var(--text-tertiary))' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm font-semibold mb-1" style={{ color: 'rgb(var(--text-primary))' }}>
          No section selected
        </p>
        <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          Click on a section to edit its properties
        </p>
      </div>
    );
  }

  const sectionDef = SECTION_REGISTRY[section.type];

  const handleFieldChange = (fieldName: string, value: unknown) => {
    onUpdate({
      ...section.data,
      [fieldName]: value,
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div
        className="p-6 border-b sticky top-0 z-10"
        style={{
          backgroundColor: 'rgb(var(--bg-secondary))',
          borderColor: 'rgb(var(--border-primary))'
        }}
      >
        <h3 className="font-bold text-lg" style={{ color: 'rgb(var(--text-primary))' }}>
          {sectionDef.label}
        </h3>
        <p className="text-sm mt-1" style={{ color: 'rgb(var(--text-secondary))' }}>
          {sectionDef.description}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {sectionDef.fields.map((field) => (
          <PropertyField
            key={field.name}
            field={field}
            value={(section.data as Record<string, unknown>)[field.name]}
            onChange={(value) => handleFieldChange(field.name, value)}
          />
        ))}
      </div>
    </div>
  );
}
