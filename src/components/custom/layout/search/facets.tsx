import type { ResultOf } from "gql.tada";
import { useEffect, useState } from "react";
import { FacetsSkeleton } from "@/components/custom/skeletons/search";
import { getCollectionFacetValues } from "@/lib/vendure";
import type {
  facetFragment,
  facetValueFragment,
} from "@/lib/vendure/fragments/facet";
import FacetsFilter from "./facets-filter";

function FacetsList({
  collection,
  facets,
}: {
  collection: string;
  facets: ResultOf<typeof facetFragment>[];
}) {
  const [collectionFacetValues, setCollectionFacetValues] = useState<
    ResultOf<typeof facetValueFragment>[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCollectionFacetValues() {
      setIsLoading(true);
      try {
        const values = collection
          ? await getCollectionFacetValues({ data: { collection } })
          : [];
        setCollectionFacetValues(values);
      } catch (error) {
        console.error("Failed to load collection facet values:", error);
        setCollectionFacetValues([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadCollectionFacetValues();
  }, [collection]);

  if (isLoading) {
    return <FacetsSkeleton />;
  }

  return (
    <FacetsFilter list={facets} collectionFacetValues={collectionFacetValues} />
  );
}

export default function Facets({
  collection,
  facets,
}: {
  collection: string;
  facets: ResultOf<typeof facetFragment>[];
}) {
  return <FacetsList facets={facets} collection={collection} />;
}
