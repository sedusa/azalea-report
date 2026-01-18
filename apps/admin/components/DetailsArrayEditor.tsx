'use client';

import { Input } from '@azalea/ui';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

interface Detail {
  label: string;
  value: string;
}

interface DetailsArrayEditorProps {
  label: string;
  value: Detail[] | undefined;
  onChange: (value: Detail[]) => void;
  maxItems?: number;
}

export function DetailsArrayEditor({
  label,
  value = [],
  onChange,
  maxItems = 10,
}: DetailsArrayEditorProps) {
  const handleAdd = () => {
    if (value.length < maxItems) {
      onChange([...value, { label: '', value: '' }]);
    }
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleChange = (index: number, field: 'label' | 'value', newValue: string) => {
    const updated = value.map((detail, i) =>
      i === index ? { ...detail, [field]: newValue } : detail
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>
        {label}
      </label>

      {value.map((detail, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1">
            <Input
              placeholder="Label (e.g., Birth place)"
              value={detail.label}
              onChange={(e) => handleChange(index, 'label', e.target.value)}
            />
          </div>
          <div className="flex-[2]">
            <Input
              placeholder="Value (e.g., Atlanta, GA)"
              value={detail.value}
              onChange={(e) => handleChange(index, 'value', e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-2 rounded hover:bg-red-500/20 transition-colors"
            style={{ color: 'rgb(var(--text-secondary))' }}
            aria-label="Remove detail"
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
          Add Detail
        </button>
      )}
    </div>
  );
}
