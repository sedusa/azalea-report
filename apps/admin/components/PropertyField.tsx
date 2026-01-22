'use client';

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

interface PropertyFieldProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PropertyField({ field, value, onChange }: PropertyFieldProps) {
  const stringValue = value as string | undefined;
  const numberValue = value as number | undefined;

  switch (field.type) {
    case 'text':
      return (
        <Input
          label={field.label}
          placeholder={field.placeholder}
          value={stringValue || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      );

    case 'textarea':
      return (
        <Textarea
          label={field.label}
          placeholder={field.placeholder}
          value={stringValue || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={4}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          label={field.label}
          placeholder={field.placeholder}
          value={numberValue || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          required={field.required}
        />
      );

    case 'date':
      return (
        <Input
          type="date"
          label={field.label}
          value={stringValue || ''}
          onChange={(e) => onChange(e.target.value)}
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
            value={stringValue || ''}
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
            content={stringValue || ''}
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

    default:
      return (
        <div className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          Unsupported field type: {field.type}
        </div>
      );
  }
}
