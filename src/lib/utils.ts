import { type ClassValue, clsx } from "clsx";
import type { ResultOf } from "gql.tada";
import { twMerge } from "tailwind-merge";
import type searchResultFragment from "./vendure/fragments/search-result";

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
