"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-sage text-white hover:bg-sage-dark focus-visible:ring-sage shadow-sm",
  secondary:
    "bg-transparent border-2 border-white text-white hover:bg-white/10 focus-visible:ring-white",
  "secondary-dark":
    "bg-transparent border-2 border-sage text-sage hover:bg-sage/10 focus-visible:ring-sage",
  ghost:
    "bg-transparent text-stone hover:bg-cream hover:text-charcoal focus-visible:ring-sage",
  cta: "bg-[#c39960] text-white hover:bg-[#d0ad7d] hover:text-charcoal focus-visible:ring-[#c39960] shadow-sm",
} as const;

const sizes = {
  sm: "h-9 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-13 px-7 text-base gap-2.5 rounded-xl",
  icon: "h-11 w-11 rounded-xl",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, variants as buttonVariants };
export type { Variant as ButtonVariant, Size as ButtonSize };
