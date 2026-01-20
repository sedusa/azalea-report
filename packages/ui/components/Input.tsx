'use client';

import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold mb-2"
          style={{ color: 'rgb(var(--text-primary))' }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resizable?: boolean;
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  resizable = true,
  style,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold mb-2"
          style={{ color: 'rgb(var(--text-primary))' }}
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`input-field ${error ? 'border-red-500' : ''} ${className}`}
        style={{
          resize: resizable ? 'vertical' : 'none',
          minHeight: '100px',
          ...style,
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
