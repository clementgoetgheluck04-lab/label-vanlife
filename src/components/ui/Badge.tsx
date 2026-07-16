"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  success:
    "bg-sage/15 text-sage-dark border-sage/25",
  warning:
    "bg-amber/15 text-amber border-amber/25",
  info:
    "bg-sage-light/20 text-sage-dark border-sage-light/30",
  ghost:
    "bg-transparent text-stone border-stone/20",
  premium:
    "bg-amber/20 text-amber border-amber/30",
} as const;

type BadgeVariant = keyof typeof badgeVariants;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

function Badge({ className, variant = "info", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border",
        "transition-colors duration-200",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
export type { BadgeVariant };