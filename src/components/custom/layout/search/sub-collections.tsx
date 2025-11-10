import type { ResultOf } from "gql.tada";
import { useEffect, useState } from "react";
import { FilterListSkeleton } from "@/components/custom/skeletons/search";
import { getCollections } from "@/lib/vendure";
import type { collectionFragment } from "@/lib/vendure/queries/collection";
import FilterList from "./filter";

interface SubCollectionsProps {
  parentId: string;
}

export default function SubCollections({ parentId }: SubCollectionsProps) {
  const [collections, setCollections] = useState<
    ResultOf<typeof collectionFragment>[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSubCollections() {
      setIsLoading(true);
      try {
        const fetchedCollections = await getCollections({ data: { parentId } });
        setCollections(fetchedCollections);
      } catch (error) {
        console.error("Failed to load sub-collections:", error);
        setCollections([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadSubCollections();
  }, [parentId]);

  if (isLoading) {
    return <FilterListSkeleton />;
  }

  return <FilterList list={collections} title="Collections" />;
}
