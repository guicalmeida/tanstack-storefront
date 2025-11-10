import { Link } from "@tanstack/react-router";
import type { ResultOf } from "gql.tada";
import { getSearchResultPrice } from "@/lib/utils";
import type activeChannelFragment from "@/lib/vendure/fragments/active-channel";
import type searchResultFragment from "@/lib/vendure/fragments/search-result";
import { GridTileImage } from "./tile";

interface ThreeItemGridItemProps {
  item: ResultOf<typeof searchResultFragment>;
  size: "full" | "half";
  priority?: boolean;
  activeChannel: ResultOf<typeof activeChannelFragment>;
}

function ThreeItemGridItem({
  item,
  size,
  priority,
  activeChannel,
}: ThreeItemGridItemProps) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        to="/product/$productId"
        params={{ productId: item.slug }}
      >
        <GridTileImage
          src={item.productAsset?.preview ?? ""}
          layout="fullWidth"
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item.productName}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.productName as string,
            amount: getSearchResultPrice(item),
            currencyCode: activeChannel.defaultCurrencyCode,
          }}
        />
      </Link>
    </div>
  );
}

interface ThreeItemGridProps {
  homepageItems: ResultOf<typeof searchResultFragment>[];
  activeChannel: ResultOf<typeof activeChannelFragment>;
}

export function ThreeItemGrid({
  homepageItems,
  activeChannel,
}: ThreeItemGridProps) {
  // No data state
  if (
    !activeChannel ||
    !homepageItems[0] ||
    !homepageItems[1] ||
    !homepageItems[2]
  ) {
    return null;
  }

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem
        size="full"
        item={firstProduct}
        priority={true}
        activeChannel={activeChannel}
      />
      <ThreeItemGridItem
        size="half"
        item={secondProduct}
        priority={true}
        activeChannel={activeChannel}
      />
      <ThreeItemGridItem
        size="half"
        item={thirdProduct}
        priority={true}
        activeChannel={activeChannel}
      />
    </section>
  );
}
