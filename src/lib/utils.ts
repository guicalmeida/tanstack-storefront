import { type ClassValue, clsx } from "clsx";
import type { ResultOf } from "gql.tada";
import { twMerge } from "tailwind-merge";
import type searchResultFragment from "./vendure/fragments/search-result";
import type { collectionFragment } from "./vendure/queries/collection";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createUrl = (pathname: string, params: URLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const getSearchResultPrice = (
  item: ResultOf<typeof searchResultFragment>,
) => {
  return (
    item.priceWithTax.__typename === "SinglePrice"
      ? item.priceWithTax.value
      : item.priceWithTax.__typename === "PriceRange"
        ? item.priceWithTax.max
        : 0
  ).toFixed(2);
};

export const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount / 100);
};

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getOrderStatusColor(state: string) {
  switch (state.toLowerCase()) {
    case "delivered":
      return "text-green-600 bg-green-50";
    case "shipped":
    case "fulfilled":
      return "text-blue-600 bg-blue-50";
    case "cancelled":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

/**
 * Sorts collections hierarchically to group parents with their children
 * @param collections - Array of collections to sort
 * @returns Sorted array with parents followed by their children recursively
 */
export function sortCollectionsByHierarchy(
  collections: ResultOf<typeof collectionFragment>[],
): ResultOf<typeof collectionFragment>[] {
  const sortedCollections: ResultOf<typeof collectionFragment>[] = [];
  const collectionMap = new Map(collections.map((c) => [c.id, c]));
  const processedIds = new Set<string>();

  // Helper function to add a collection and its children recursively
  const addCollectionWithChildren = (
    collection: ResultOf<typeof collectionFragment>,
  ): void => {
    if (processedIds.has(collection.id)) return;

    sortedCollections.push(collection);
    processedIds.add(collection.id);

    // Find and add all direct children
    const children = collections.filter((c) => c.parentId === collection.id);
    children.forEach((child) => {
      addCollectionWithChildren(child);
    });
  };

  // First, add all root collections (those without parents or whose parent doesn't exist)
  const rootCollections = collections.filter(
    (c) => !c.parentId || !collectionMap.has(c.parentId),
  );

  rootCollections.forEach((root) => {
    addCollectionWithChildren(root);
  });

  // Add any remaining collections that weren't processed (orphaned items)
  collections.forEach((c) => {
    if (!processedIds.has(c.id)) {
      addCollectionWithChildren(c);
    }
  });

  return sortedCollections;
}
