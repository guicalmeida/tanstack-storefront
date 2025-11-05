import { Link } from "@tanstack/react-router";
import type { ResultOf } from "gql.tada";
import { readFragment } from "@/gql/graphql";
import { getSearchResultPrice } from "@/lib/utils";
import type activeChannelFragment from "@/lib/vendure/fragments/active-channel";
import searchResultFragment from "@/lib/vendure/fragments/search-result";
import { GridTileImage } from "./grid/tile";

interface CarouselProps {
  products: ResultOf<typeof searchResultFragment>[];
  activeChannel: ResultOf<typeof activeChannelFragment>;
}

export function Carousel({ products, activeChannel }: CarouselProps) {
  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full overflow-x-auto pt-1 pb-6">
      <ul className="animate-carousel flex gap-4">
        {carouselProducts
          .map((data) => readFragment(searchResultFragment, data))
          .map((product, i) => (
            <li
              key={`${product.slug}${i}`}
              className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
            >
              <Link
                to="/product/$productId"
                params={{ productId: product.slug }}
                className="relative h-full w-full"
              >
                <GridTileImage
                  alt={product.productName}
                  label={{
                    title: product.productName,
                    amount: getSearchResultPrice(product),
                    currencyCode: activeChannel?.defaultCurrencyCode || "USD",
                  }}
                  src={product.productAsset?.preview ?? ""}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  layout="fullWidth"
                />
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
