'use client';

import { SECTION_BACKGROUND_COLORS } from '@azalea/shared/constants';
import { LuCheck, LuBan } from 'react-icons/lu';

interface ColorPickerProps {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  compact?: boolean;
}

/**
 * ColorPicker - A compact pastel color palette picker for section backgrounds
 * Shows a row of color swatches with labels on hover
 * Includes a "No Background" option (undefined/transparent)
 */
export function ColorPicker({ label, value, onChange, compact = false }: ColorPickerProps) {
  const isNoBackground = value === undefined;

  return (
    <div className="color-picker-wrapper">
      <div className="color-picker-header">
        <label className="color-picker-label" style={{ color: 'rgb(var(--text-secondary))' }}>
          {label}
        </label>
      </div>
      <div className="color-picker-row">
        {/* No Background option */}
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={`color-dot no-bg ${isNoBackground ? 'selected' : ''}`}
          title="No Background"
        >
          {isNoBackground ? (
            <LuCheck className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <LuBan className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Color options */}
        {SECTION_BACKGROUND_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`color-dot ${value === color.value ? 'selected' : ''}`}
            style={{ backgroundColor: color.value }}
            title={color.label}
          >
            {value === color.value && (
              <LuCheck className="w-3.5 h-3.5 text-gray-700" />
            )}
          </button>
        ))}
      </div>

      <style jsx>{`
        .color-picker-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .color-picker-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .color-picker-label {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .color-picker-row {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .color-dot {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .color-dot.no-bg {
          background: linear-gradient(
            45deg,
            #f0f0f0 25%,
            transparent 25%,
            transparent 75%,
            #f0f0f0 75%
          ),
          linear-gradient(
            45deg,
            #f0f0f0 25%,
            transparent 25%,
            transparent 75%,
            #f0f0f0 75%
          );
          background-size: 8px 8px;
          background-position: 0 0, 4px 4px;
          background-color: #ffffff;
          border-color: #d1d5db;
        }

        .color-dot:hover {
          transform: scale(1.15);
        }

        .color-dot.selected {
          border-color: #016f53;
          box-shadow: 0 0 0 1px rgba(1, 111, 83, 0.3);
        }

        .color-dot.no-bg.selected {
          border-color: #016f53;
        }
      `}</style>
    </div>
  );
}
