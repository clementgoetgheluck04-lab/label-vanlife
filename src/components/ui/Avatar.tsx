"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const avatarSizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

type AvatarSize = keyof typeof avatarSizes;

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  online?: boolean;
}

function Avatar({
  className,
  src,
  alt = "",
  initials,
  size = "md",
  online = false,
  ...props
}: AvatarProps) {
  return (
    <div className="relative inline-flex shrink-0">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "rounded-full object-cover",
            avatarSizes[size],
            className
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full bg-sage/20 text-sage-dark font-semibold flex items-center justify-center",
            avatarSizes[size],
            className
          )}
          aria-label={alt || initials}
          {...props}
        >
          {initials?.slice(0, 2).toUpperCase() || "?"}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-sage border-2 border-white" />
      )}
    </div>
  );
}

export { Avatar, avatarSizes };
export type { AvatarSize };