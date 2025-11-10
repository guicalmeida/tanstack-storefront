import { useRouter } from "@tanstack/react-router";
import clsx from "clsx";
import type { ResultOf } from "gql.tada";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cartActions } from "@/components/custom/cart/actions";
import { useSelectedVariant } from "@/components/custom/product/product-context";
import { readFragment } from "@/gql/graphql";
import type productFragment from "@/lib/vendure/fragments/product";
import { variantFragment } from "@/lib/vendure/fragments/product";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  isLoading,
  isOutOfStock,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  isLoading: boolean;
  isOutOfStock: boolean;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale || isOutOfStock) {
    return (
      <button
        type="submit"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        type="submit"
        aria-label="Please select all required options"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      type="submit"
      aria-label="Add to cart"
      disabled={isLoading}
      className={clsx(buttonClasses, {
        "hover:opacity-90": !isLoading,
        "opacity-60 cursor-not-allowed": isLoading,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      {isLoading ? "Adding..." : "Add To Cart"}
    </button>
  );
}

export function AddToCart({
  product,
}: {
  product: ResultOf<typeof productFragment>;
}) {
  const { variantList, enabled: availableForSale } = product;
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const variants =
    variantList?.items.map((data) => readFragment(variantFragment, data)) || [];

  const selectedVariant = useSelectedVariant(variants);

  // For products with only one variant and no options, use that variant
  const defaultVariantId =
    variants.length === 1 && variants[0]?.options.length === 0
      ? variants[0]?.id
      : undefined;

  const selectedVariantId = selectedVariant?.id || defaultVariantId;

  // Check if selected variant is out of stock
  const isOutOfStock = selectedVariant
    ? selectedVariant.stockLevel === "OUT_OF_STOCK"
    : variants.length === 1 && variants[0]
      ? variants[0].stockLevel === "OUT_OF_STOCK"
      : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVariantId) {
      setMessage("Please select all required options");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await cartActions.addItem(selectedVariantId, router);
      if (!result.success) {
        const errorMessage = result.error || "Error adding item to cart";
        setMessage(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.success("Item added to cart");
      }
    } catch (_error) {
      const errorMessage = "Error adding item to cart";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        isLoading={isLoading}
        isOutOfStock={isOutOfStock}
      />
      <output aria-live="polite" className="sr-only">
        {message}
      </output>
    </form>
  );
}
