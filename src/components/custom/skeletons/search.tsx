import clsx from "clsx";
import { createSkeletonArray, SkeletonItem, skeletonSizes } from "./base";

interface SearchSkeletonProps {
  className?: string;
}

// Skeleton for facets/filters in horizontal layout
export function FacetsSkeleton({ className }: SearchSkeletonProps) {
  return (
    <div className={clsx("gap-4 hidden w-full py-4 lg:flex", className)}>
      <SkeletonItem className={skeletonSizes.facetItem} />
      <SkeletonItem className={skeletonSizes.facetItem} />
      <SkeletonItem className={skeletonSizes.facetItem} />
      <SkeletonItem className={skeletonSizes.facetItem} />
    </div>
  );
}

// Skeleton for collections/filter list in vertical layout
export function FilterListSkeleton({
  className,
  itemCount = 8,
}: SearchSkeletonProps & { itemCount?: number }) {
  return (
    <div
      className={clsx(
        "col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block",
        className,
      )}
    >
      {/* Title skeletons */}
      <SkeletonItem variant="active" className={skeletonSizes.filterItem} />
      <SkeletonItem variant="active" className={skeletonSizes.filterItem} />

      {/* Filter item skeletons */}
      {createSkeletonArray(itemCount).map((_, index) => (
        <SkeletonItem
          key={`filter-${index}-${itemCount}`}
          className={skeletonSizes.filterItem}
        />
      ))}
    </div>
  );
}

// Combined search layout skeleton
export function SearchLayoutSkeleton({ className }: SearchSkeletonProps) {
  return (
    <div
      className={clsx(
        "mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white",
        className,
      )}
    >
      <div className="order-first w-full flex-none md:max-w-[125px]">
        <FilterListSkeleton />
      </div>
      <div className="order-last min-h-screen w-full md:order-0">
        <SkeletonItem className="h-20 w-full mb-4" />
      </div>
      <div className="order-0 flex-none md:order-last md:w-[125px]">
        <FilterListSkeleton itemCount={6} />
      </div>
    </div>
  );
}
