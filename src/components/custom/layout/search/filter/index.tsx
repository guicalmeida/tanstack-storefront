import type { ResultOf } from "gql.tada";
import { Suspense } from "react";
import type { SortFilterItem } from "@/lib/constants";
import type { collectionFragment } from "@/lib/vendure/queries/collection";
import FilterItemDropdown from "./dropdown";
import { FilterItem } from "./item";

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = Pick<
  ResultOf<typeof collectionFragment>,
  "slug" | "parentId" | "name"
>;

function FilterItemList({ list }: { list: readonly ListItem[] }) {
  return (
    <>
      {list.map((item, i) => (
        <FilterItem key={`filter-${i}-${item.slug || item.name}`} item={item} />
      ))}
    </>
  );
}

export default function FilterList({
  list,
  title,
}: {
  list: readonly ListItem[];
  title?: string;
}) {
  return (
    <nav>
      {title ? (
        <h3 className="hidden text-xs text-neutral-500 md:block dark:text-neutral-400">
          {title}
        </h3>
      ) : null}
      <ul className="hidden md:block">
        <Suspense fallback={null}>
          <FilterItemList list={list} />
        </Suspense>
      </ul>
      <ul className="md:hidden">
        <Suspense fallback={null}>
          <FilterItemDropdown list={list} />
        </Suspense>
      </ul>
    </nav>
  );
}
