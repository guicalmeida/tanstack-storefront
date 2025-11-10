import { AddToCart } from "@/components/custom/cart/add-to-cart";
import Price from "@/components/custom/price";
import Prose from "@/components/custom/prose";
import { readFragment, type ResultOf } from "@/gql/graphql";
import type productFragment from "@/lib/vendure/fragments/product";
import { variantFragment } from "@/lib/vendure/fragments/product";
import { VariantSelector } from "./variant-selector";
import type activeChannelFragment from "@/lib/vendure/fragments/active-channel";

export function ProductDescription({
  product,
  activeChannel,
}: {
  product: ResultOf<typeof productFragment>;
  activeChannel: ResultOf<typeof activeChannelFragment>;
}) {
  const fromPrice = product?.variantList.items
    .map((data) => readFragment(variantFragment, data))
    .sort((a, b) => a.priceWithTax - b.priceWithTax)[0]?.priceWithTax;

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product?.name}</h1>
        {fromPrice !== undefined && (
          <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
            <Price
              amount={fromPrice}
              currencyCode={activeChannel.defaultCurrencyCode}
            />
          </div>
        )}
      </div>
      <VariantSelector
        optionGroups={product?.optionGroups ?? []}
        variants={product?.variantList.items ?? []}
      />
      {product?.description ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/60"
          html={product.description}
        />
      ) : null}
      {product && <AddToCart product={product} />}
    </>
  );
}
