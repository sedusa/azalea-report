'use client';

import { Input } from '@azalea/ui';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

interface BulletsArrayEditorProps {
  label: string;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  maxItems?: number;
}

export function BulletsArrayEditor({
  label,
  value = [],
  onChange,
  maxItems = 10,
}: BulletsArrayEditorProps) {
  const handleAdd = () => {
    if (value.length < maxItems) {
      onChange([...value, '']);
    }
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleChange = (index: number, newValue: string) => {
    const updated = value.map((bullet, i) =>
      i === index ? newValue : bullet
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
        {label}
      </label>

      {value.map((bullet, index) => (
        <div key={index} className="flex gap-2 items-center">
          <div className="flex-1">
            <Input
              placeholder="Bullet point text"
              value={bullet}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-2 rounded hover:bg-red-500/20 transition-colors"
            style={{ color: 'rgb(var(--text-secondary))' }}
            aria-label="Remove bullet"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {value.length < maxItems && (
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors"
          style={{
            backgroundColor: 'rgb(var(--accent) / 0.1)',
            color: 'rgb(var(--accent))',
          }}
        >
          <LuPlus className="w-4 h-4" />
          Add Bullet Point
        </button>
      )}
    </div>
  );
}
