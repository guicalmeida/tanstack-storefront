import type { ResultOf } from "gql.tada";
import type { collectionFragment } from "@/lib/vendure/queries/collection";
import FilterList from "./filter";

interface CollectionsProps {
  collections: ResultOf<typeof collectionFragment>[];
}

export default function Collections({ collections }: CollectionsProps) {
  return <FilterList list={collections} title="Collections" />;
}
