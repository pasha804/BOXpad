import { cn } from "@/lib/utils";

export function Skeleton({ className, width }: { className?: string; width?: string | number }) {
  return (
    <div className={cn("skeleton-shimmer h-3", className)} style={width ? { width } : undefined} />
  );
}
