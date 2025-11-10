import { getRouteApi, useNavigate } from "@tanstack/react-router";
import type { ResultOf } from "gql.tada";
import { useMemo } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { readFragment } from "@/gql/graphql";
import { getFacetValue, setFacetValue } from "@/lib/search-schema";
import {
  type facetFragment,
  facetValueFragment,
} from "@/lib/vendure/fragments/facet";

export default function FacetsFilterItem({
  item,
  collectionFacetValues,
}: {
  item: ResultOf<typeof facetFragment>;
  collectionFacetValues: ResultOf<typeof facetValueFragment>[];
}) {
  const navigate = useNavigate();
  const routeApi = getRouteApi("/_default/_search/collections/$collection");
  const search = routeApi.useSearch();

  function onFilterChange(group: string, value: string[]) {
    const newSearch = setFacetValue(search, group, value);

    navigate({
      to: ".",
      search: newSearch,
    });
  }

  const defaultValue = useMemo(() => {
    return getFacetValue(search, item.code);
  }, [search, item.code]);

  return (
    <div className="max-w-[50%] md:max-w-[250px] shrink-0 grow">
      <h3 className="mb-2 block text-xs text-neutral-500 dark:text-neutral-400">
        {item.name}
      </h3>
      <div>
        <MultiSelect
          defaultValue={defaultValue}
          options={item.values
            .map((valueFragment) =>
              readFragment(facetValueFragment, valueFragment),
            )
            .filter(
              (itemValue) =>
                collectionFacetValues.findIndex(
                  (facetValue) => facetValue.id === itemValue.id,
                ) > -1,
            )
            .map((itemValue) => ({
              label: itemValue.name,
              value: itemValue.id,
            }))}
          onValueChange={(value) => onFilterChange(item.code, value)}
        />
      </div>
    </div>
  );
}
