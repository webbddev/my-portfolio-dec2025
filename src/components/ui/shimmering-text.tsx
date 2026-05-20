"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShimmeringTextProps {
  text: string;
  className?: string;
}

export const ShimmeringText: React.FC<ShimmeringTextProps> = ({
  text,
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-block animate-shimmer bg-[linear-gradient(110deg,#fff,45%,#888,55%,#fff)] bg-[length:200%_100%] bg-clip-text text-transparent transition-colors",
        className
      )}
    >
      {text}
    </span>
  );
};
