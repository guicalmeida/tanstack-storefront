import { Link } from "@tanstack/react-router";
import type { ResultOf } from "gql.tada";
import Grid from "@/components/custom/grid";
import { GridTileImage } from "@/components/custom/grid/tile";
import { getSearchResultPrice } from "@/lib/utils";
import type searchResultFragment from "@/lib/vendure/fragments/search-result";

export default function ProductGridItems({
  products,
  currencyCode,
}: {
  products: ResultOf<typeof searchResultFragment>[];
  currencyCode: string;
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.slug} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            to="/product/$productId"
            params={{ productId: product.slug }}
          >
            <GridTileImage
              alt={product.productName}
              label={{
                title: product.productName,
                amount: getSearchResultPrice(product),
                currencyCode,
              }}
              src={product.productAsset?.preview || ""}
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              layout="fullWidth"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
