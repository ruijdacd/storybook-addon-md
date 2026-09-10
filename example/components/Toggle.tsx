import { useId, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { cva } from 'class-variance-authority';

const toggle = cva('inline-flex max-w-90 items-start gap-3 font-sans text-control-foreground', {
  variants: {
    disabled: { true: 'cursor-not-allowed opacity-55', false: 'cursor-pointer' },
  },
  defaultVariants: { disabled: false },
});

const track = clsx(
  'pointer-events-none block box-border h-[22px] w-9 rounded-full border border-solid border-control-border bg-control-active p-0.5',
  'transition-colors duration-150 motion-reduce:transition-none',
  'before:block before:size-4 before:rounded-full before:bg-white before:shadow-sm before:transition-transform before:duration-150 before:content-[" "] motion-reduce:before:transition-none',
  'peer-checked:border-control-primary peer-checked:bg-control-primary peer-checked:before:translate-x-3.5',
  'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-control-focus',
);

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: string;
  description?: string;
}

export function Toggle({
  label,
  description,
  id,
  disabled = false,
  className,
  ...props
}: ToggleProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;

  return (
    <label className={toggle({ disabled })} htmlFor={inputId}>
      <span className="relative mt-px basis-9 shrink-0">
        <input
          {...props}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className={clsx(
            'peer absolute inset-0 m-0 size-full cursor-[inherit] opacity-0',
            className,
          )}
          aria-label={label}
          aria-describedby={description ? descriptionId : undefined}
        />
        <span className={track} data-slot="toggle-track" aria-hidden="true" />
      </span>

      <span className="grid gap-1">
        <span className="text-sm font-semibold leading-[22px]">{label}</span>
        {description && (
          <span className="text-xs leading-[18px] text-control-muted" id={descriptionId}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
