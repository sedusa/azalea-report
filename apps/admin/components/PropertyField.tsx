'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { FieldDefinition } from '@azalea/shared/constants';
import type { Id } from '@convex/_generated/dataModel';
import { Input, Textarea } from '@azalea/ui';
import { TiptapEditor } from './TiptapEditor';
import { ImagePicker, MultiImagePicker } from './ImagePicker';
import { PersonArrayEditor } from './PersonArrayEditor';
import { DetailsArrayEditor } from './DetailsArrayEditor';
import { BulletsArrayEditor } from './BulletsArrayEditor';
import { ImagesWithCaptionsEditor } from './ImagesWithCaptionsEditor';
import { PodcastArrayEditor } from './PodcastArrayEditor';
import { EventsArrayEditor } from './EventsArrayEditor';
import { CarouselSlidesArrayEditor } from './CarouselSlidesArrayEditor';
import { PlacesArrayEditor } from './PlacesArrayEditor';

interface PropertyFieldProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

/**
 * Hook for debounced input - maintains local state for immediate feedback
 * and syncs to parent after user stops typing
 */
function useDebouncedInput<T>(
  externalValue: T,
  onExternalChange: (value: T) => void,
  delay: number = 500
) {
  const [localValue, setLocalValue] = useState<T>(externalValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInternalChangeRef = useRef(false);

  // Sync external value to local state (when parent changes value externally)
  useEffect(() => {
    if (!isInternalChangeRef.current) {
      setLocalValue(externalValue);
    }
    isInternalChangeRef.current = false;
  }, [externalValue]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = useCallback((newValue: T) => {
    // Update local state immediately for responsive UI
    setLocalValue(newValue);
    isInternalChangeRef.current = true;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the external update
    timeoutRef.current = setTimeout(() => {
      onExternalChange(newValue);
    }, delay);
  }, [onExternalChange, delay]);

  // Flush pending changes immediately (e.g., on blur)
  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      onExternalChange(localValue);
    }
  }, [localValue, onExternalChange]);

  return { localValue, handleChange, flush };
}

/**
 * DebouncedInput - Text input with local state and debounced sync
 */
function DebouncedInput({
  label,
  placeholder,
  value,
  onChange,
  required,
  type = 'text',
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: 'text' | 'number' | 'date';
}) {
  const { localValue, handleChange, flush } = useDebouncedInput(value, onChange);

  return (
    <Input
      type={type}
      label={label}
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={flush}
      required={required}
    />
  );
}

/**
 * DebouncedTextarea - Textarea with local state and debounced sync
 */
function DebouncedTextarea({
  label,
  placeholder,
  value,
  onChange,
  required,
  rows = 4,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
}) {
  const { localValue, handleChange, flush } = useDebouncedInput(value, onChange);

  return (
    <Textarea
      label={label}
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={flush}
      required={required}
      rows={rows}
    />
  );
}

export function PropertyField({ field, value, onChange }: PropertyFieldProps) {
  const stringValue = (value as string) || '';
  const numberValue = value as number | undefined;

  switch (field.type) {
    case 'text':
      return (
        <DebouncedInput
          label={field.label}
          placeholder={field.placeholder}
          value={stringValue}
          onChange={onChange}
          required={field.required}
        />
      );

    case 'textarea':
      return (
        <DebouncedTextarea
          label={field.label}
          placeholder={field.placeholder}
          value={stringValue}
          onChange={onChange}
          required={field.required}
          rows={4}
        />
      );

    case 'number':
      return (
        <DebouncedInput
          type="number"
          label={field.label}
          placeholder={field.placeholder}
          value={numberValue?.toString() || ''}
          onChange={(val) => onChange(val ? Number(val) : undefined)}
          required={field.required}
        />
      );

    case 'date':
      return (
        <DebouncedInput
          type="date"
          label={field.label}
          value={stringValue}
          onChange={onChange}
          required={field.required}
        />
      );

    case 'select':
      return (
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="input-field"
          >
            {!field.required && <option value="">Select...</option>}
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'richtext':
      return (
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <TiptapEditor
            content={stringValue}
            onChange={onChange}
            placeholder={field.placeholder}
          />
        </div>
      );

    case 'image':
      return (
        <ImagePicker
          label={field.label}
          value={value as Id<'media'> | null}
          onChange={onChange}
          required={field.required}
        />
      );

    case 'images':
      return (
        <MultiImagePicker
          label={field.label}
          value={value as Id<'media'>[] | undefined}
          onChange={onChange}
          required={field.required}
          maxImages={10}
        />
      );

    case 'imagesWithCaptions':
      return (
        <ImagesWithCaptionsEditor
          label={field.label}
          value={value as { mediaId: string; caption?: string }[] | undefined}
          onChange={onChange}
          required={field.required}
          maxImages={100}
        />
      );

    case 'chiefArray':
      return (
        <PersonArrayEditor
          label={field.label}
          value={value as { name: string; image?: string; content: string }[] | undefined}
          onChange={onChange}
          personLabel="Chief"
          maxItems={4}
        />
      );

    case 'internArray':
      return (
        <PersonArrayEditor
          label={field.label}
          value={value as { name: string; image?: string; content: string }[] | undefined}
          onChange={onChange}
          personLabel="Intern"
          maxItems={2}
        />
      );

    case 'detailsArray':
      return (
        <DetailsArrayEditor
          label={field.label}
          value={value as { label: string; value: string }[] | undefined}
          onChange={onChange}
          maxItems={10}
        />
      );

    case 'bulletsArray':
      return (
        <BulletsArrayEditor
          label={field.label}
          value={value as string[] | undefined}
          onChange={onChange}
          maxItems={10}
        />
      );

    case 'podcastArray':
      return (
        <PodcastArrayEditor
          label={field.label}
          value={value as { title: string; description: string; buttonUrl: string; buttonText: string }[] | undefined}
          onChange={onChange}
          maxItems={5}
        />
      );

    case 'eventsArray':
      return (
        <EventsArrayEditor
          label={field.label}
          value={value as { date: string; title: string }[] | undefined}
          onChange={onChange}
          required={field.required}
          maxItems={20}
        />
      );

    case 'carouselSlidesArray':
      return (
        <CarouselSlidesArrayEditor
          label={field.label}
          value={value as { title: string; mediaId: string }[] | undefined}
          onChange={onChange}
          required={field.required}
          maxItems={20}
        />
      );

    case 'placesArray':
      return (
        <PlacesArrayEditor
          label={field.label}
          value={value as { name: string; type: string; description: string; location: string; mediaId?: string; link?: string | null }[] | undefined}
          onChange={onChange}
          required={field.required}
          maxItems={20}
        />
      );

    default:
      return (
        <div className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          Unsupported field type: {field.type}
        </div>
      );
  }
}
