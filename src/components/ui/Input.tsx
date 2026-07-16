"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          className={cn(
            "peer w-full rounded-xl border bg-white px-4 pt-6 pb-2 text-sm text-charcoal",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            icon && "pl-11",
            error
              ? "border-red-400 focus:ring-red-400"
              : success
              ? "border-sage focus:ring-sage"
              : "border-border focus:border-sage focus:ring-sage",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-4 top-4 text-sm text-stone pointer-events-none",
              "peer-focus:text-xs peer-focus:-translate-y-2.5",
              "peer-placeholder-shown:text-sm peer-placeholder-shown:translate-y-0",
              "peer-focus:translate-y-0",
              "transition-all duration-200",
              "peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-2.5",
              error && "text-red-400 peer-focus:text-red-400",
              success && "text-sage peer-focus:text-sage",
              icon && "left-11"
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };