import { z } from "zod";
import { defaultSort, sorting } from "./constants";

// Extract valid sort slugs from the sorting constants with proper type inference
type SortSlugs = (typeof sorting)[number]["slug"];
const validSortSlugs = sorting.map((item) => item.slug) as [SortSlugs];

// Base search schema for common search parameters
export const baseSearchSchema = z.object({
  q: z.string().optional().catch(""),
  sort: z.enum(validSortSlugs).optional().default(defaultSort.slug),
});

// Extended search schema that allows dynamic facet parameters
// This uses z.record to allow any string key with string values
export const searchSchema = baseSearchSchema.and(
  z.record(z.string(), z.string().optional()),
);

export type SearchParams = z.infer<typeof searchSchema>;

// Helper function to get facet value from search params
export function getFacetValue(
  search: SearchParams,
  facetCode: string,
): string[] {
  const value = search[facetCode];
  return value ? value.split(",") : [];
}

// Helper function to set facet value in search params
export function setFacetValue(
  search: SearchParams,
  facetCode: string,
  values: string[],
): SearchParams {
  const newSearch = { ...search };

  if (values.length > 0) {
    newSearch[facetCode] = values.join(",");
  } else {
    delete newSearch[facetCode];
  }

  return newSearch;
}
