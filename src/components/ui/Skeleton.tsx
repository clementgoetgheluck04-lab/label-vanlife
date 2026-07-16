"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const skeletonVariants = {
  text: "h-4 w-full rounded-md",
  card: "h-40 w-full rounded-xl",
  image: "aspect-video w-full rounded-xl",
  circle: "h-10 w-10 rounded-full",
} as const;

type SkeletonVariant = keyof typeof skeletonVariants;

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-skeleton bg-sand/60",
        skeletonVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };
export type { SkeletonVariant };