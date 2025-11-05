import type { ResultOf } from "gql.tada";
import type {
  facetFragment,
  facetValueFragment,
} from "@/lib/vendure/fragments/facet";
import FacetsFilterItem from "./item";

export default function FacetsFilter({
  list,
  collectionFacetValues,
}: {
  list: ResultOf<typeof facetFragment>[];
  collectionFacetValues: ResultOf<typeof facetValueFragment>[];
}) {
  return (
    <div className="flex flex-wrap justify-start gap-4 md:items-center">
      {list
        .filter(
          (facet) =>
            collectionFacetValues.findIndex(
              (facetValue) => facetValue.facetId === facet.id,
            ) > -1,
        )
        .map((facet) => {
          return (
            <FacetsFilterItem
              item={facet}
              key={facet.id}
              collectionFacetValues={collectionFacetValues}
            ></FacetsFilterItem>
          );
        })}
    </div>
  );
}
