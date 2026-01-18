import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  padding = 'md',
  shadow = 'md',
  className = '',
  ...props
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-card',
    lg: 'shadow-lg',
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 ${paddingStyles[padding]} ${shadowStyles[shadow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  children,
  className = '',
  ...props
}: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`} {...props}>
      <div>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
        {children}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
