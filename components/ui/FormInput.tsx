'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormInputProps<T = string> {
  label?: string;
  value: T;
  onChange: (value: T) => void;

  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;

  /** validation */
  validate?: (value: T) => boolean;
  errorMessage?: string;

  /** styles */
  className?: string;
  inputClassName?: string;

  /** behavior */
  disabled?: boolean;
}

export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function FormInput<T = string>({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  validate,
  errorMessage = 'Невалидна стойност',
  className,
  inputClassName,
  disabled
}: FormInputProps<T>) {
  const isInvalid = validate ? !validate(value) && value !== '' : false;

  return (
    <div className={cn('space-y-1', className)}>
      {label && <Label>{label}</Label>}

      <Input
        type={type}
        value={value as any}
        disabled={disabled}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value as T)}
        className={cn(
          'bg-gray-50 transition ',
          isInvalid && 'border-red-500 focus:ring-red-200',
          inputClassName
        )}
      />

      {isInvalid && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
