import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-xl border-2 border-[#262626] bg-[#262626] px-4 py-3 text-sm text-white shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:border-[#B51D2A] focus:outline-none focus:ring-2 focus:ring-[#B51D2A]/30 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };