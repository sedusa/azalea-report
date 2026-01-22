'use client';

import { useState } from 'react';
import { Button } from '@azalea/ui';
import { LuPlus, LuX, LuGripVertical } from 'react-icons/lu';

interface EventItem {
  date: string;
  title: string;
}

interface EventsArrayEditorProps {
  value?: EventItem[];
  onChange: (events: EventItem[]) => void;
  label?: string;
  required?: boolean;
  maxItems?: number;
}

/**
 * EventsArrayEditor - For adding/editing multiple events
 * Each event has a date and title/activity
 */
export function EventsArrayEditor({
  value = [],
  onChange,
  label = 'Events',
  required = false,
  maxItems = 20,
}: EventsArrayEditorProps) {
  const handleAddEvent = () => {
    if (value.length >= maxItems) return;
    onChange([...value, { date: '', title: '' }]);
  };

  const handleRemoveEvent = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleEventChange = (index: number, field: keyof EventItem, fieldValue: string) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], [field]: fieldValue };
    onChange(newValue);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newValue = [...value];
    [newValue[index - 1], newValue[index]] = [newValue[index], newValue[index - 1]];
    onChange(newValue);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const newValue = [...value];
    [newValue[index], newValue[index + 1]] = [newValue[index + 1], newValue[index]];
    onChange(newValue);
  };

  return (
    <div>
      <label
        className="block text-sm font-semibold mb-2"
        style={{ color: 'rgb(var(--text-primary))' }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        <span className="text-xs font-normal ml-2" style={{ color: 'rgb(var(--text-secondary))' }}>
          ({value.length}/{maxItems})
        </span>
      </label>

      {/* Events List */}
      {value.length > 0 ? (
        <div className="space-y-3 mb-4">
          {value.map((event, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 rounded-lg"
              style={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}
            >
              {/* Drag Handle / Reorder */}
              <div className="flex flex-col items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <LuGripVertical className="w-4 h-4" style={{ color: 'rgb(var(--text-tertiary))' }} />
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === value.length - 1}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Event Fields */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'rgb(var(--text-secondary))' }}
                  >
                    Event {index + 1}
                  </span>
                </div>

                {/* Date Field */}
                <div>
                  <label
                    className="block text-xs mb-1"
                    style={{ color: 'rgb(var(--text-tertiary))' }}
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    value={event.date || ''}
                    onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md border"
                    style={{
                      backgroundColor: 'rgb(var(--bg-primary))',
                      borderColor: 'rgb(var(--border-primary))',
                      color: 'rgb(var(--text-primary))',
                    }}
                  />
                </div>

                {/* Title/Activity Field */}
                <div>
                  <label
                    className="block text-xs mb-1"
                    style={{ color: 'rgb(var(--text-tertiary))' }}
                  >
                    Activity/Event Name
                  </label>
                  <input
                    type="text"
                    value={event.title || ''}
                    onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                    placeholder="e.g., Thanksgiving, Grand Rounds..."
                    className="w-full px-3 py-2 text-sm rounded-md border"
                    style={{
                      backgroundColor: 'rgb(var(--bg-primary))',
                      borderColor: 'rgb(var(--border-primary))',
                      color: 'rgb(var(--text-primary))',
                    }}
                  />
                </div>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveEvent(index)}
                className="self-start p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                title="Remove event"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="mb-4 p-4 rounded-lg text-center text-sm"
          style={{
            backgroundColor: 'rgb(var(--bg-tertiary))',
            color: 'rgb(var(--text-secondary))',
          }}
        >
          No events added. Click below to add an event.
        </div>
      )}

      {/* Add Event Button */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        fullWidth
        onClick={handleAddEvent}
        disabled={value.length >= maxItems}
      >
        <LuPlus className="w-4 h-4 mr-2" />
        Add Event
      </Button>

      {value.length >= maxItems && (
        <p className="text-xs mt-2 text-center" style={{ color: 'rgb(var(--text-secondary))' }}>
          Maximum of {maxItems} events reached
        </p>
      )}
    </div>
  );
}
