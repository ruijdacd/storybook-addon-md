import type { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { cva } from 'class-variance-authority';

const button = cva(
  [
    'box-border inline-flex items-center justify-center rounded-md border border-solid font-sans font-semibold leading-5 align-middle whitespace-nowrap',
    'cursor-pointer transition-colors duration-150 motion-reduce:transition-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-control-focus',
    'disabled:cursor-not-allowed disabled:border-control-border disabled:bg-control-background disabled:text-control-disabled disabled:shadow-none',
  ],
  {
    variants: {
      variant: {
        primary:
          'border-black/15 bg-control-primary text-white enabled:hover:bg-control-primary-hover enabled:active:bg-control-primary-active',
        secondary:
          'border-control-border bg-control-background text-control-foreground enabled:hover:bg-control-hover enabled:active:bg-control-active',
        danger:
          'border-control-border bg-control-background text-control-danger enabled:hover:bg-control-danger enabled:hover:text-white enabled:active:bg-control-danger-hover enabled:active:text-white',
      },
      size: {
        small: 'min-h-7 px-3 py-0.5 text-xs',
        medium: 'min-h-8 px-4 py-1 text-sm',
        large: 'min-h-10 px-5 py-2 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'medium' },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export function Button({
  label,
  variant = 'primary',
  size = 'medium',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button {...props} type={type} className={clsx(button({ variant, size }), className)}>
      {label}
    </button>
  );
}
