import { createFileRoute, notFound } from "@tanstack/react-router";
import ErrorComponent from "@/components/custom/errors/error";
import Grid from "@/components/custom/grid";
import ProductGridItems from "@/components/custom/layout/product-grid-items";
import { CollectionProvider } from "@/components/custom/layout/search/collection-context";
import Facets from "@/components/custom/layout/search/facets";
import ProductGridSkeleton from "@/components/custom/skeletons/grid";
import { defaultSort, sorting } from "@/lib/constants";
import { createEcommerceMeta } from "@/lib/metadata";
import { searchSchema } from "@/lib/search-schema";
import {
  getActiveChannel,
  getCollection,
  getCollectionProducts,
  getFacets,
} from "@/lib/vendure";

export const Route = createFileRoute(
  "/_default/_search/collections/$collection",
)({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ params: { collection }, deps: { search } }) => {
    const { sort } = search;
    const sortItem = sorting.find((item) => item.slug === sort) || defaultSort;
    const { sortKey, direction } = sortItem;

    // Get collection first to check if it exists
    const collectionData = await getCollection({ data: collection });
    if (!collectionData) {
      throw notFound();
    }

    // Get facets for filtering
    const facets = await getFacets();

    // Build facet filters from search params
    const facetFilters = facets
      .map((facet) => {
        const valueIdsAsString = search[facet.code];
        return {
          or: valueIdsAsString?.split(",") ?? [],
        };
      })
      .filter((facetFilter) => facetFilter.or.length > 0);

    // Fetch products and active channel in parallel
    const [products, activeChannel] = await Promise.all([
      getCollectionProducts({
        data: {
          collection,
          sortKey,
          direction,
          facetValueFilters: facetFilters,
        },
      }),
      getActiveChannel(),
    ]);

    return {
      collection: collectionData,
      products,
      activeChannel,
      facets,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.collection) return {};

    const collection = loaderData.collection;
    const description =
      collection.description ||
      `Browse products in the ${collection.name} collection`;

    return {
      meta: createEcommerceMeta(collection.name, description),
    };
  },
  pendingComponent: ProductGridSkeleton,
  errorComponent: ErrorComponent,
  component: RouteComponent,
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  const { collection: collectionParam } = Route.useParams();

  if (!loaderData) {
    return <div>Loading...</div>;
  }

  const { collection, products, activeChannel, facets } = loaderData;

  return (
    <CollectionProvider collection={collection}>
      <section>
        <Facets facets={facets} collection={collectionParam} />
        {products.length === 0 ? (
          <p className="py-3 text-lg">{`No products found in this collection`}</p>
        ) : (
          <Grid className="mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems
              currencyCode={activeChannel.defaultCurrencyCode}
              products={products}
            />
          </Grid>
        )}
      </section>
    </CollectionProvider>
  );
}
