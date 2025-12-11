import * as React from 'react';

export const Progress: React.FC<{ value?: number; className?: string }> = ({ value = 0, className = '' }) => {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div className={`w-full bg-gray-200 rounded h-2 ${className}`}>
      <div style={{ width: `${clamped}%` }} className="h-full bg-blue-600 rounded" />
    </div>
  );
};

export default Progress;