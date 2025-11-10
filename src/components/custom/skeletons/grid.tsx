import Grid from "@/components/custom/grid";
import { createSkeletonArray, SkeletonItem, skeletonClasses } from "./base";

interface ProductGridSkeletonProps {
  itemCount?: number;
  className?: string;
}

export default function ProductGridSkeleton({
  itemCount = 12,
  className = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}: ProductGridSkeletonProps) {
  return (
    <>
      <SkeletonItem className="mb-4 h-6" />
      <Grid className={className}>
        {createSkeletonArray(itemCount).map((_, index) => {
          return (
            <Grid.Item
              key={`skeleton-${index}-${itemCount}`}
              className={skeletonClasses}
            />
          );
        })}
      </Grid>
    </>
  );
}
