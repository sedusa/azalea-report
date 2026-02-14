'use client';

import { SECTION_REGISTRY } from '@azalea/shared/constants';
import type { Section } from '@azalea/shared/types';
import { Input, Textarea } from '@azalea/ui';
import { PropertyField } from './PropertyField';
import { ColorPicker } from './ColorPicker';

interface PropertyPanelProps {
  section: Section | null;
  onUpdate: (data: Record<string, unknown>) => void;
  onBackgroundColorChange?: (color: string | undefined) => void;
}

export function PropertyPanel({ section, onUpdate, onBackgroundColorChange }: PropertyPanelProps) {
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

  const getNestedValue = (data: Record<string, unknown>, path: string): unknown => {
    const keys = path.split('.');
    let current: unknown = data;
    for (const key of keys) {
      if (current == null || typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[key];
    }
    return current;
  };

  const setNestedValue = (data: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> => {
    const keys = path.split('.');
    if (keys.length === 1) {
      return { ...data, [keys[0]]: value };
    }
    const [first, ...rest] = keys;
    const child = (data[first] as Record<string, unknown>) || {};
    return {
      ...data,
      [first]: setNestedValue({ ...child }, rest.join('.'), value),
    };
  };

  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (fieldName.includes('.')) {
      onUpdate(setNestedValue({ ...(section.data as Record<string, unknown>) }, fieldName, value));
    } else {
      onUpdate({
        ...section.data,
        [fieldName]: value,
      });
    }
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
        {/* Background Color Pickers */}
        {onBackgroundColorChange && section.type === 'twoColumn' ? (
          /* Two Column Section - Show two color pickers for each column */
          <div className="space-y-3">
            <ColorPicker
              label="Left Column Color"
              value={(section.data as Record<string, unknown>).leftBackgroundColor as string | undefined}
              onChange={(color) => handleFieldChange('leftBackgroundColor', color)}
            />
            <ColorPicker
              label="Right Column Color"
              value={(section.data as Record<string, unknown>).rightBackgroundColor as string | undefined}
              onChange={(color) => handleFieldChange('rightBackgroundColor', color)}
            />
          </div>
        ) : onBackgroundColorChange && (
          /* Other sections - Single background color */
          <ColorPicker
            label="Background Color"
            value={section.backgroundColor}
            onChange={onBackgroundColorChange}
          />
        )}

        {/* Divider */}
        {onBackgroundColorChange && (
          <hr style={{ borderColor: 'rgb(var(--border-primary))' }} />
        )}

        {/* Section Fields */}
        {sectionDef.fields.map((field) => (
          <PropertyField
            key={field.name}
            field={field}
            value={field.name.includes('.') ? getNestedValue(section.data as Record<string, unknown>, field.name) : (section.data as Record<string, unknown>)[field.name]}
            onChange={(value) => handleFieldChange(field.name, value)}
          />
        ))}

        {/* Help Text */}
        {sectionDef.helpText && (
          <div
            className="p-3 rounded-lg text-sm"
            style={{
              backgroundColor: 'rgb(var(--bg-accent))',
              color: 'rgb(var(--text-secondary))',
            }}
          >
            {sectionDef.helpText}
          </div>
        )}
      </div>
    </div>
  );
}
