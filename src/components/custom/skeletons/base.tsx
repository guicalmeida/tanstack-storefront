import clsx from "clsx";

// Base skeleton styling that can be reused across components
export const skeletonBase = "animate-pulse rounded";
export const skeletonBackground = "bg-neutral-400 dark:bg-neutral-700";
export const skeletonActiveBackground = "bg-neutral-800 dark:bg-neutral-300";

// Combined classes for convenience
export const skeletonClasses = clsx(skeletonBase, skeletonBackground);
export const skeletonActiveClasses = clsx(
  skeletonBase,
  skeletonActiveBackground,
);

interface SkeletonItemProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "active";
}

// Simple reusable skeleton div
export function SkeletonItem({
  className,
  children,
  variant = "default",
}: SkeletonItemProps) {
  const baseClasses =
    variant === "active" ? skeletonActiveClasses : skeletonClasses;
  return <div className={clsx(baseClasses, className)}>{children}</div>;
}

// Utility function to generate array for skeleton items
export function createSkeletonArray(count: number) {
  return Array(count).fill(0);
}

// Common skeleton dimensions
export const skeletonSizes = {
  filterItem: "mb-3 h-4 w-5/6",
  facetItem: "h-10 w-full",
  gridItem: "h-48 w-full",
  text: "h-4 w-3/4",
  title: "h-6 w-1/2",
} as const;
