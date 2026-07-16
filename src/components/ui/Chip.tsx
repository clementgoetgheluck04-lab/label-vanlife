"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const chipVariants = {
  default: "bg-cream text-charcoal border-transparent hover:bg-sand",
  selected: "bg-sage text-white border-sage",
  filter: "bg-white text-stone border-border hover:border-sage hover:text-sage",
} as const;

type ChipVariant = keyof typeof chipVariants;

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  removable?: boolean;
  onRemove?: () => void;
  icon?: ReactNode;
}

function Chip({
  className,
  variant = "default",
  removable = false,
  onRemove,
  icon,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-1",
        chipVariants[variant],
        className
      )}
      type="button"
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {removable && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onRemove?.();
            }
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 transition-colors"
          aria-label="Supprimer"
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}

export { Chip, chipVariants };
export type { ChipVariant };