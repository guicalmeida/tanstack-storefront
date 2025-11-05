import { createFileRoute } from "@tanstack/react-router";
import ErrorComponent from "@/components/custom/errors/error";
import Grid from "@/components/custom/grid";
import ProductGridItems from "@/components/custom/layout/product-grid-items";
import ProductGridSkeleton from "@/components/custom/skeletons/grid";
import { defaultSort, sorting } from "@/lib/constants";
import { searchSchema } from "@/lib/search-schema";
import { getActiveChannel, getProducts } from "@/lib/vendure";
import { createBasicMeta } from "@/lib/metadata";

export const Route = createFileRoute("/_default/_search/search/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { q, sort } }) => ({ q, sort }),
  loader: async ({ deps: { q, sort } }) => {
    const sortItem = sorting.find((item) => item.slug === sort) || defaultSort;
    const { sortKey, direction } = sortItem;
    const [products, activeChannel] = await Promise.all([
      getProducts({
        data: { query: q, direction: direction, sortKey: sortKey },
      }),
      getActiveChannel(),
    ]);

    return {
      products,
      activeChannel,
      searchValue: q,
    };
  },
  head: ({ loaderData }) => {
    const searchValue = loaderData?.searchValue;
    const resultsCount = loaderData?.products?.length || 0;

    const title = searchValue
      ? `Search results for "${searchValue}"`
      : "Search";

    const description = searchValue
      ? `Found ${resultsCount} ${resultsCount === 1 ? "product" : "products"} matching "${searchValue}". Browse our search results and find exactly what you're looking for.`
      : "Search our complete product catalog. Find electronics, accessories, and more with our powerful search engine.";

    return {
      meta: createBasicMeta(title, description),
    };
  },
  pendingComponent: ProductGridSkeleton,
  errorComponent: ErrorComponent,
  component: RouteComponent,
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();

  const { products, activeChannel, searchValue } = loaderData;
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "There are no products that match "
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems
            currencyCode={activeChannel.defaultCurrencyCode}
            products={products}
          />
        </Grid>
      ) : null}
    </>
  );
}
