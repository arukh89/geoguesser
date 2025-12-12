import * as React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

export const Button: React.FC<ButtonProps> = ({ className = '', ...rest }) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded border px-4 py-2 transition mx-ring';
  const matrix = 'border-[rgba(0,255,65,0.3)] text-[var(--accent)] hover:bg-[rgba(0,255,65,0.06)] shadow-[var(--shadow)]';
  return <button className={`${base} ${matrix} ${className}`.trim()} {...rest} />;
};

export default Button;