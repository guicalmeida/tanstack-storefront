import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ResultOf } from "gql.tada";
import { Suspense } from "react";
import ErrorComponent from "@/components/custom/errors/error";
import { GridTileImage } from "@/components/custom/grid/tile";
import Footer from "@/components/custom/layout/footer";
import { Gallery } from "@/components/custom/product/gallery";
import { ProductProvider } from "@/components/custom/product/product-context";
import { ProductDescription } from "@/components/custom/product/product-description";
import { readFragment } from "@/gql/graphql";
import {
  createEcommerceMeta,
  createStructuredData,
  getBaseUrl,
} from "@/lib/metadata";
import { getActiveChannel, getMenu, getProduct } from "@/lib/vendure";
import assetFragment from "@/lib/vendure/fragments/image";
import type productFragment from "@/lib/vendure/fragments/product";

export const Route = createFileRoute("/_default/product/$productId")({
  loader: async ({ params }) => {
    const [product, activeChannel, menu] = await Promise.all([
      getProduct({ data: params.productId }),
      getActiveChannel(),
      getMenu(),
    ]);

    if (!product) {
      throw notFound();
    }

    return {
      product,
      activeChannel,
      menu,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.product) return {};

    const product = loaderData.product;
    const featuredAsset = readFragment(assetFragment, product.featuredAsset);
    const description =
      product.description ||
      `${product.name} - Premium quality product available for purchase.`;

    // Additional product-specific meta tags
    const additionalMeta = [
      {
        name: "robots",
        content: product.enabled ? "index, follow" : "noindex, nofollow",
      },
      {
        property: "og:type",
        content: "product",
      },
      {
        property: "product:availability",
        content: product.enabled ? "in stock" : "out of stock",
      },
    ];

    return {
      meta: createEcommerceMeta(
        product.name,
        description,
        featuredAsset?.source,
        additionalMeta,
      ),
    };
  },
  scripts: ({ loaderData }) => {
    if (!loaderData?.product || !loaderData?.activeChannel) return [];

    const product = loaderData.product;
    const activeChannel = loaderData.activeChannel;
    const baseUrl = getBaseUrl();

    const productJsonLd = createStructuredData.product(
      product,
      activeChannel,
      baseUrl,
    );

    return [
      {
        type: "application/ld+json",
        children: JSON.stringify(productJsonLd),
      },
    ];
  },
  errorComponent: ErrorComponent,
  component: ProductPage,
});

function ProductPage() {
  const { product, menu, activeChannel } = Route.useLoaderData();

  return (
    <ProductProvider>
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.assets
                  .slice(0, 5)
                  .map((data) => readFragment(assetFragment, data))
                  .map((asset) => ({
                    src: asset.source,
                    altText: product.name,
                  }))}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription
                activeChannel={activeChannel}
                product={product}
              />
            </Suspense>
          </div>
        </div>
        <RelatedProducts id={product.id} />
      </div>
      <Footer menu={menu} />
    </ProductProvider>
  );
}

function RelatedProducts({ id: _id }: { id: string }) {
  const relatedProducts: Array<ResultOf<typeof productFragment>> = [];

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => {
          const featuredAsset = readFragment(
            assetFragment,
            product.featuredAsset,
          );
          return (
            <li
              key={product.slug}
              className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            >
              <Link
                className="relative h-full w-full"
                to="/product/$productId"
                params={{ productId: product.slug }}
                preload="intent"
              >
                <GridTileImage
                  alt={product.name}
                  label={{
                    title: product.name,
                    amount: "0",
                    currencyCode: "USD",
                  }}
                  src={featuredAsset?.preview ?? ""}
                  width={300}
                  height={300}
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
