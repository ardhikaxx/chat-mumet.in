import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B51D2A]/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-[#181818] shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-br from-[#B51D2A] to-[#8e1620] text-white hover:from-[#9e1a26] hover:to-[#75121b]',
        outline: 'border border-[#262626] bg-[#262626] text-white hover:bg-[#2e2e2e]',
      },
      size: {
        default: 'h-12 px-6 py-3',
        sm: 'h-9 px-4 rounded-lg',
        lg: 'h-14 px-10 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };