import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import type { ResultOf, VariablesOf } from "gql.tada";
import { type DocumentNode, print } from "graphql";
import { serverEnv } from "@/env/server";
import { readFragment } from "@/gql/graphql";
import { useAppSession } from "@/lib/session";
import { isVendureError } from "@/lib/type-guards";
import activeChannelFragment from "@/lib/vendure/fragments/active-channel";
import productFragment from "@/lib/vendure/fragments/product";
import { authenticate } from "@/lib/vendure/mutations/customer";
import { updateCustomerMutation } from "@/lib/vendure/mutations/update-customer";
import {
  activeCustomerFragment,
  getActiveCustomerQuery,
} from "@/lib/vendure/queries/active-customer";
import { getCustomerOrdersQuery } from "@/lib/vendure/queries/customer-orders";
import activeOrderFragment from "./fragments/active-order";
import { facetFragment, facetValueFragment } from "./fragments/facet";
import searchResultFragment from "./fragments/search-result";
import {
  addItemToOrder,
  adjustOrderLineMutation,
  removeOrderLineMutation,
} from "./mutations/active-order";
import {
  addPaymentToOrderMutation,
  availableCountriesQuery,
  eligiblePaymentMethodsQuery,
  eligibleShippingMethodsQuery,
  orderByCodeQuery,
  setCustomerForOrderMutation,
  setOrderBillingAddressMutation,
  setOrderShippingAddressMutation,
  setOrderShippingMethodMutation,
  transitionOrderToStateMutation,
} from "./mutations/checkout";
import { getActiveChannelQuery } from "./queries/active-channel";
import { getActiveOrderQuery } from "./queries/active-order";
import {
  collectionFragment,
  getCollectionFacetValuesQuery,
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getFacetsQuery } from "./queries/facets";
import { getMenuQuery } from "./queries/menu";
import { getProductQuery, getProductsQuery } from "./queries/product";

// Types for checkout operations
export type CreateAddressInput = {
  fullName?: string | null;
  company?: string | null;
  streetLine1: string;
  streetLine2?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  countryCode: string;
  phoneNumber?: string | null;
  defaultShippingAddress?: boolean | null;
  defaultBillingAddress?: boolean | null;
};

export type CreateCustomerInput = {
  title?: string | null;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  emailAddress: string;
};

/**
 * Server-only function to get the Vendure endpoint
 * This prevents the environment variable from being accessed on the client
 */
const getEndpoint = createServerOnlyFn(() => {
  return serverEnv.VENDURE_SHOP_API_ENDPOINT;
});

/**
 * Core Vendure GraphQL fetch function
 * Similar to Next.js version but adapted for TanStack Start
 */
export async function vendureFetch<
  T,
  V extends Record<string, unknown> = Record<string, unknown>,
>({
  cache = "force-cache",
  headers,
  query,
  variables,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: DocumentNode | TypedDocumentNode<T, V> | string;
  variables?: V;
}): Promise<{ status: number; body: T; headers: Headers }> {
  try {
    const endpoint = getEndpoint();
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        ...(query && {
          query: typeof query === "string" ? query : print(query),
        }),
        ...(variables && { variables }),
      }),
      cache,
    });

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

/**
 * Server-only function to get auth headers from session
 * Only callable from server functions, not from isomorphic code
 */
export const getAuthHeaders = createServerOnlyFn(async () => {
  const session = await useAppSession();
  const tokenValue = session.data?.vendureToken;

  return tokenValue
    ? {
        Authorization: `Bearer ${tokenValue}`,
      }
    : undefined;
});

/**
 * Server-only function to update auth token in session
 */
const updateAuthToken = createServerOnlyFn(async (headers: Headers) => {
  const session = await useAppSession();
  const tokenValue = headers.get("vendure-auth-token");

  if (tokenValue && tokenValue !== "") {
    await session.update({
      ...session.data,
      vendureToken: tokenValue,
      isAuthenticated: true,
    });
  }
});

// PUBLIC DATA FUNCTIONS (server functions for security)
// All Vendure calls must go through server for security

export const getActiveChannel = createServerFn().handler(
  async (): Promise<ResultOf<typeof activeChannelFragment>> => {
    const res = await vendureFetch({
      query: getActiveChannelQuery,
    });

    return readFragment(activeChannelFragment, res.body.activeChannel);
  },
);

export const getCollection = createServerFn()
  .inputValidator((handle: string) => handle)
  .handler(
    async ({
      data: handle,
    }): Promise<ResultOf<typeof collectionFragment> | null> => {
      const res = await vendureFetch({
        query: getCollectionQuery,
        variables: {
          slug: handle,
        },
      });

      return res.body.collection
        ? readFragment(collectionFragment, res.body.collection)
        : null;
    },
  );

export const getCollectionProducts = createServerFn()
  .inputValidator(
    (params: {
      collection: string;
      sortKey?: string;
      direction?: "ASC" | "DESC";
      facetValueFilters?: VariablesOf<
        typeof getCollectionProductsQuery
      >["facetValueFilters"];
    }) => params,
  )
  .handler(
    async ({
      data: { collection, sortKey, direction, facetValueFilters },
    }): Promise<ResultOf<typeof searchResultFragment>[]> => {
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
    },
  );

export const getCollectionFacetValues = createServerFn()
  .inputValidator(
    (params: {
      collection: string;
      sortKey?: string;
      direction?: "ASC" | "DESC";
    }) => params,
  )
  .handler(
    async ({
      data: { collection, sortKey, direction },
    }): Promise<ResultOf<typeof facetValueFragment>[]> => {
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
    },
  );

export const getCollections = createServerFn()
  .inputValidator(
    (params: { topLevelOnly?: boolean; parentId?: string } = {}) => params,
  )
  .handler(
    async ({
      data: { topLevelOnly = false, parentId } = {},
    }): Promise<ResultOf<typeof collectionFragment>[]> => {
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
    },
  );

export const getFacets = createServerFn().handler(
  async (): Promise<ResultOf<typeof facetFragment>[]> => {
    const res = await vendureFetch({
      query: getFacetsQuery,
    });

    return res.body.facets.items.map((item) =>
      readFragment(facetFragment, item),
    );
  },
);

export const getMenu = createServerFn().handler(
  async (): Promise<ResultOf<typeof collectionFragment>[]> => {
    const res = await vendureFetch({
      query: getMenuQuery,
    });

    return res.body.collections.items.map((item) =>
      readFragment(collectionFragment, item),
    );
  },
);

export const getProduct = createServerFn()
  .inputValidator((handle: string) => handle)
  .handler(async ({ data: handle }) => {
    const res = await vendureFetch({
      query: getProductQuery,
      variables: {
        slug: handle,
      },
    });

    return readFragment(productFragment, res.body.product);
  });

export const getProducts = createServerFn()
  .inputValidator(
    (params: { query?: string; direction?: string; sortKey?: string }) =>
      params,
  )
  .handler(async ({ data: { query, direction, sortKey } }) => {
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
  });

// AUTHENTICATED DATA FUNCTIONS (SERVER FUNCTIONS)
// These require authentication and can only be called from client as RPC

export const addToCart = createServerFn()
  .inputValidator(
    (params: { productVariantId: string; quantity: number }) => params,
  )
  .handler(async ({ data: { productVariantId, quantity } }) => {
    const res = await vendureFetch({
      query: addItemToOrder,
      variables: {
        productVariantId,
        quantity,
      },
      cache: "no-store",
      headers: await getAuthHeaders(),
    });

    await updateAuthToken(res.headers);

    return res.body.addItemToOrder;
  });

export const adjustCartItem = createServerFn()
  .inputValidator((params: { orderLineId: string; quantity: number }) => params)
  .handler(async ({ data: { orderLineId, quantity } }) => {
    const res = await vendureFetch({
      query: adjustOrderLineMutation,
      variables: {
        orderLineId,
        quantity,
      },
      cache: "no-store",
      headers: await getAuthHeaders(),
    });

    return res.body.adjustOrderLine;
  });

export const removeFromCart = createServerFn()
  .inputValidator((orderLineId: string) => orderLineId)
  .handler(async ({ data: orderLineId }) => {
    const res = await vendureFetch({
      query: removeOrderLineMutation,
      variables: {
        orderLineId,
      },
      cache: "no-store",
      headers: await getAuthHeaders(),
    });

    return res.body.removeOrderLine;
  });

export const getActiveOrder = createServerFn().handler(
  async (): Promise<ResultOf<typeof activeOrderFragment> | null> => {
    const res = await vendureFetch({
      query: getActiveOrderQuery,
      cache: "no-store",
      headers: await getAuthHeaders(),
    });

    return res.body.activeOrder
      ? readFragment(activeOrderFragment, res.body.activeOrder)
      : null;
  },
);

export const authenticateCustomer = createServerFn({ method: "POST" })
  .inputValidator((params: { username: string; password: string }) => params)
  .handler(async ({ data: { username, password } }) => {
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
      cache: "no-store",
    });

    await updateAuthToken(res.headers);

    return res.body.authenticate;
  });

export const getActiveCustomer = createServerFn().handler(async () => {
  const res = await vendureFetch({
    query: getActiveCustomerQuery,
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  return res.body.activeCustomer
    ? readFragment(activeCustomerFragment, res.body.activeCustomer)
    : null;
});

export const getCustomerOrders = createServerFn()
  .inputValidator(
    (options?: VariablesOf<typeof getCustomerOrdersQuery>["options"]) =>
      options,
  )
  .handler(async ({ data: options }) => {
    const res = await vendureFetch({
      query: getCustomerOrdersQuery,
      variables: { options },
      cache: "no-store",
      headers: await getAuthHeaders(),
    });

    return res.body.activeCustomer?.orders;
  });

export const updateCustomer = createServerFn({ method: "POST" })
  .inputValidator(
    (params: VariablesOf<typeof updateCustomerMutation>["input"]) => params,
  )
  .handler(async ({ data }) => {
    const res = await vendureFetch({
      query: updateCustomerMutation,
      cache: "no-store",
      variables: { input: data },
      headers: await getAuthHeaders(),
    });

    return readFragment(activeCustomerFragment, res.body.updateCustomer);
  });

// CHECKOUT OPERATIONS (SERVER FUNCTIONS)
// These handle the checkout flow: addresses, shipping, payment, etc.

export const setOrderShippingAddress = createServerFn({ method: "POST" })
  .inputValidator((data: CreateAddressInput) => data)
  .handler(async ({ data }) => {
    const res = await vendureFetch({
      query: setOrderShippingAddressMutation,
      variables: { input: data },
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (res.body.setOrderShippingAddress.__typename === "Order") {
      return readFragment(
        activeOrderFragment,
        res.body.setOrderShippingAddress,
      );
    }

    throw new Error("Failed to set shipping address");
  });

export const setOrderBillingAddress = createServerFn({ method: "POST" })
  .inputValidator((data: CreateAddressInput) => data)
  .handler(async ({ data }) => {
    const res = await vendureFetch({
      query: setOrderBillingAddressMutation,
      variables: { input: data },
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (res.body.setOrderBillingAddress.__typename === "Order") {
      return res.body.setOrderBillingAddress;
    }

    throw new Error("Failed to set billing address");
  });

export const setCustomerForOrder = createServerFn({ method: "POST" })
  .inputValidator((data: CreateCustomerInput) => data)
  .handler(async ({ data }) => {
    const res = await vendureFetch({
      query: setCustomerForOrderMutation,
      variables: { input: data },
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (res.body.setCustomerForOrder.__typename === "Order") {
      return res.body.setCustomerForOrder;
    }

    throw new Error("Failed to set customer");
  });

export const setOrderShippingMethod = createServerFn({ method: "POST" })
  .inputValidator((data: { shippingMethodId: string[] }) => data)
  .handler(async ({ data }) => {
    const res = await vendureFetch({
      query: setOrderShippingMethodMutation,
      variables: { shippingMethodId: data.shippingMethodId },
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (res.body.setOrderShippingMethod.__typename === "Order") {
      return res.body.setOrderShippingMethod;
    }

    throw new Error("Failed to set shipping method");
  });

export const getEligibleShippingMethods = createServerFn().handler(async () => {
  const res = await vendureFetch({
    query: eligibleShippingMethodsQuery,
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  return res.body.eligibleShippingMethods;
});

export const getEligiblePaymentMethods = createServerFn().handler(async () => {
  const res = await vendureFetch({
    query: eligiblePaymentMethodsQuery,
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  return res.body.eligiblePaymentMethods;
});

export const getAvailableCountries = createServerFn().handler(async () => {
  const res = await vendureFetch({
    query: availableCountriesQuery,
    cache: "force-cache",
  });

  return res.body.availableCountries;
});

export const addPaymentToOrder = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { method: string; metadata?: Record<string, unknown> }) => data,
  )
  .handler(async ({ data }) => {
    const res = await vendureFetch({
      query: addPaymentToOrderMutation,
      variables: {
        input: {
          method: data.method,
          metadata: data.metadata || {},
        },
      },
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (res.body.addPaymentToOrder.__typename === "Order") {
      return res.body.addPaymentToOrder;
    }

    throw new Error("Failed to add payment");
  });

export const transitionOrderToState = createServerFn({ method: "POST" })
  .inputValidator((data: { state?: string }) => data)
  .handler(async ({ data }) => {
    const state = data.state || "ArrangingPayment";
    const res = await vendureFetch({
      query: transitionOrderToStateMutation,
      variables: { state },
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (res.body.transitionOrderToState?.__typename === "Order") {
      return res.body.transitionOrderToState;
    }

    throw new Error("Failed to transition order state");
  });

export const getOrderByCode = createServerFn()
  .inputValidator((code: string) => code)
  .handler(async ({ data: code }) => {
    const res = await vendureFetch({
      query: orderByCodeQuery,
      variables: { code },
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    return res.body.orderByCode;
  });

export async function getPage(_slug: string) {
  // TODO: Implement with custom entity
  return undefined;
}
