import { isVendureError } from "@/lib/type-guards";
import {
  collectionFragment,
  getCollectionFacetValuesQuery,
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import { getProductQuery, getProductsQuery } from "./queries/product";
import {
  addItemToOrder,
  adjustOrderLineMutation,
  removeOrderLineMutation,
} from "./mutations/active-order";
import { type DocumentNode, print } from "graphql";
import { getActiveOrderQuery } from "./queries/active-order";
import { getActiveChannelQuery } from "./queries/active-channel";
import { getFacetsQuery } from "./queries/facets";
import { facetFragment, facetValueFragment } from "./fragments/facet";
import activeOrderFragment from "./fragments/active-order";
import searchResultFragment from "./fragments/search-result";
import { authenticate } from "@/lib/vendure/mutations/customer";
import { updateCustomerMutation } from "@/lib/vendure/mutations/update-customer";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  activeCustomerFragment,
  getActiveCustomerQuery,
} from "@/lib/vendure/queries/active-customer";
import {
  getCustomerOrdersQuery,
  getOrderByCodeQuery,
} from "@/lib/vendure/queries/customer-orders";
import orderFragment from "@/lib/vendure/fragments/order";
import type { VariablesOf, ResultOf } from "gql.tada";
import { readFragment } from "@/gql/graphql";
import activeChannelFragment from "@/lib/vendure/fragments/active-channel";
import productFragment from "@/lib/vendure/fragments/product";

const endpoint =
  typeof window === "undefined"
    ? process.env.VENDURE_API_ENDPOINT || "http://localhost:3000/shop-api"
    : (import.meta as any).env?.VITE_VENDURE_API_ENDPOINT ||
      "http://localhost:3000/shop-api";

const AUTH_TOKEN_KEY = "vendure-token";
const AUTH_HEADER_KEY = "vendure-auth-token";

function getAuthToken(serverToken?: string): string | null {
  if (serverToken) return serverToken;
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function saveAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export async function vendureFetch<
  T,
  V extends Record<string, any> = Record<string, any>,
>({
  cache = "force-cache",
  headers,
  query,
  variables,
  token,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: DocumentNode | TypedDocumentNode<T, V> | string;
  variables?: V;
  token?: string;
}): Promise<{ status: number; body: T; headers: Headers } | never> {
  try {
    const isServer = typeof window === "undefined";
    const authToken = getAuthToken(token);
    const mergedHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...(headers || {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };

    const result = await fetch(endpoint, {
      method: "POST",
      headers: mergedHeaders,
      body: JSON.stringify({
        ...(query && {
          query: typeof query === "string" ? query : print(query),
        }),
        ...(variables && { variables }),
      }),
      cache,
    });

    if (!isServer) {
      const newToken = result.headers.get(AUTH_HEADER_KEY);
      if (newToken) {
        saveAuthToken(newToken);
      }
    }

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body: body.data,
      headers: result.headers,
    };
  } catch (e) {
    console.log({ e });
    if (isVendureError(e)) {
      throw {
        cause: e.cause?.toString() || "unknown",
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw {
      error: e,
      query,
    };
  }
}

export async function addToCart(productVariantId: string, quantity: number) {
  const res = await vendureFetch({
    query: addItemToOrder,
    variables: {
      productVariantId,
      quantity,
    },
    cache: "no-store",
  });

  return res.body.addItemToOrder;
}

export async function adjustCartItem(orderLineId: string, quantity: number) {
  const res = await vendureFetch({
    query: adjustOrderLineMutation,
    variables: {
      orderLineId,
      quantity,
    },
    cache: "no-store",
  });

  return res.body.adjustOrderLine;
}

export async function removeFromCart(orderLineId: string) {
  const res = await vendureFetch({
    query: removeOrderLineMutation,
    variables: {
      orderLineId,
    },
    cache: "no-store",
  });

  return res.body.removeOrderLine;
}

export async function getActiveOrder(): Promise<ResultOf<
  typeof activeOrderFragment
> | null> {
  const res = await vendureFetch({
    query: getActiveOrderQuery,
  });

  return res.body.activeOrder
    ? readFragment(activeOrderFragment, res.body.activeOrder)
    : null;
}

export async function getActiveChannel(): Promise<
  ResultOf<typeof activeChannelFragment>
> {
  const res = await vendureFetch({
    query: getActiveChannelQuery,
  });

  return readFragment(activeChannelFragment, res.body.activeChannel);
}

export async function getCollection(
  handle: string,
): Promise<ResultOf<typeof collectionFragment> | null> {
  const res = await vendureFetch({
    query: getCollectionQuery,

    variables: {
      slug: handle,
    },
  });

  return res.body.collection
    ? readFragment(collectionFragment, res.body.collection)
    : null;
}

export async function getCollectionProducts({
  collection,
  sortKey,
  direction,
  facetValueFilters,
}: {
  collection: string;
  sortKey?: string;
  direction?: "ASC" | "DESC";
  facetValueFilters?: VariablesOf<
    typeof getCollectionProductsQuery
  >["facetValueFilters"];
}): Promise<ResultOf<typeof searchResultFragment>[]> {
  const res = await vendureFetch({
    query: getCollectionProductsQuery,
    variables: {
      slug: collection,
      facetValueFilters,
      sortKey: {
        [sortKey || "name"]: direction || "ASC",
      },
    },
  });

  return res.body.search.items.map((item) =>
    readFragment(searchResultFragment, item),
  );
}

export async function getCollectionFacetValues({
  collection,
  sortKey,
  direction,
}: {
  collection: string;
  sortKey?: string;
  direction?: "ASC" | "DESC";
}): Promise<ResultOf<typeof facetValueFragment>[]> {
  const res = await vendureFetch({
    query: getCollectionFacetValuesQuery,
    variables: {
      slug: collection,
      sortKey: {
        [sortKey || "name"]: direction || "ASC",
      },
    },
  });

  return res.body.search.facetValues.map((item) =>
    readFragment(facetValueFragment, item.facetValue),
  );
}

export async function getCollections({
  topLevelOnly = false,
  parentId,
}: {
  topLevelOnly?: boolean;
  parentId?: string;
} = {}): Promise<ResultOf<typeof collectionFragment>[]> {
  const res = await vendureFetch({
    query: getCollectionsQuery,

    variables: {
      topLevelOnly,
      ...(parentId && { filter: { parentId: { eq: parentId } } }),
    },
  });

  return res.body.collections.items.map((item) =>
    readFragment(collectionFragment, item),
  );
}

export async function getFacets(): Promise<ResultOf<typeof facetFragment>[]> {
  const res = await vendureFetch({
    query: getFacetsQuery,
  });

  return res.body.facets.items.map((item) => readFragment(facetFragment, item));
}

export async function getMenu(): Promise<
  ResultOf<typeof collectionFragment>[]
> {
  const res = await vendureFetch({
    query: getMenuQuery,
  });

  return res.body.collections.items.map((item) =>
    readFragment(collectionFragment, item),
  );
}

export async function getProduct(handle: string) {
  const res = await vendureFetch({
    query: getProductQuery,

    variables: {
      slug: handle,
    },
  });

  return readFragment(productFragment, res.body.product);
}

export async function getProducts({
  query,
  direction,
  sortKey,
}: {
  query?: string;
  direction?: string;
  sortKey?: string;
}) {
  const res = await vendureFetch({
    query: getProductsQuery,

    variables: {
      query,
      sortKey: {
        [sortKey || "name"]: direction || "ASC",
      },
    },
  });

  return res.body.search.items.map((item) =>
    readFragment(searchResultFragment, item),
  );
}

export async function authenticateCustomer(username: string, password: string) {
  const res = await vendureFetch({
    query: authenticate,

    variables: {
      input: {
        native: {
          username,
          password,
        },
      },
    },
  });

  return res.body.authenticate;
}

export async function getActiveCustomer() {
  const res = await vendureFetch({
    query: getActiveCustomerQuery,
  });

  return readFragment(activeCustomerFragment, res.body.activeCustomer);
}

export async function getCustomerOrders(
  options?: VariablesOf<typeof getCustomerOrdersQuery>["options"],
) {
  const res = await vendureFetch({
    query: getCustomerOrdersQuery,

    variables: { options },
  });

  return res.body.activeCustomer?.orders;
}

export async function getOrderByCode(code: string) {
  const res = await vendureFetch({
    query: getOrderByCodeQuery,

    variables: { code },
  });

  return res.body.orderByCode
    ? readFragment(orderFragment, res.body.orderByCode)
    : null;
}

export async function updateCustomer(
  input: VariablesOf<typeof updateCustomerMutation>["input"],
) {
  const res = await vendureFetch({
    query: updateCustomerMutation,
    cache: "no-store",
    variables: { input },
  });

  return readFragment(activeCustomerFragment, res.body.updateCustomer);
}
