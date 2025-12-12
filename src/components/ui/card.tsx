import * as React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...p }) => (
  <div className={`rounded-lg border mx-panel ${className}`} {...p} />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...p }) => (
  <div className={`p-4 border-b mx-border ${className}`} {...p} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = '', ...p }) => (
  <h3 className={`text-lg font-semibold mx-accent ${className}`} {...p} />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = '', ...p }) => (
  <p className={`text-sm text-[color:rgba(151,255,151,0.8)] ${className}`} {...p} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...p }) => (
  <div className={`p-4 ${className}`} {...p} />
);