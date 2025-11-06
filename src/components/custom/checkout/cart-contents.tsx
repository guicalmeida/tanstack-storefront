import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import type { ResultOf } from "gql.tada";
import { useState } from "react";
import Price from "@/components/custom/price";
import { readFragment } from "@/gql/graphql";
import { adjustCartItem, removeFromCart } from "@/lib/vendure";
import type activeOrderFragment from "@/lib/vendure/fragments/active-order";
import assetFragment from "@/lib/vendure/fragments/image";
import productFragment from "@/lib/vendure/fragments/product";

interface CartContentsProps {
  order?: ResultOf<typeof activeOrderFragment> | null;
  editable?: boolean;
  onUpdate?: () => void;
}

export function CartContents({
  order,
  editable = false,
  onUpdate,
}: CartContentsProps) {
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);
  const lines = order?.lines || [];
  const currencyCode = order?.currencyCode || "USD";

  const handleQuantityChange = async (lineId: string, quantity: number) => {
    if (!editable) return;

    setUpdatingLineId(lineId);
    try {
      await adjustCartItem({ data: { orderLineId: lineId, quantity } });
      onUpdate?.();
    } catch (error) {
      // Error handled silently
    } finally {
      setUpdatingLineId(null);
    }
  };

  const handleRemove = async (lineId: string) => {
    if (!editable) return;

    setUpdatingLineId(lineId);
    try {
      await removeFromCart({ data: lineId });
      onUpdate?.();
    } catch (error) {
      // Error handled silently
    } finally {
      setUpdatingLineId(null);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">Your cart is empty</div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-my-6 divide-y divide-gray-200">
        {lines.map((line) => {
          const { linePriceWithTax } = line;
          const isUpdating = updatingLineId === line.id;
          const product = readFragment(
            productFragment,
            line.productVariant.product,
          );
          const featuredAsset = product.featuredAsset
            ? readFragment(assetFragment, product.featuredAsset)
            : null;

          return (
            <li key={line.id} className="py-6 flex">
              <div className="shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                {featuredAsset && (
                  <Image
                    layout="fixed"
                    width={100}
                    height={100}
                    className="w-full h-full object-center object-cover"
                    src={`${featuredAsset.preview}?preset=thumb`}
                    alt={`Image of: ${line.productVariant.name}`}
                  />
                )}
              </div>

              <div className="ml-4 flex-1 flex flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>
                      <Link
                        to="/product/$productId"
                        params={{ productId: product.slug }}
                      >
                        {line.productVariant.name}
                      </Link>
                    </h3>
                    <Price
                      amount={linePriceWithTax}
                      currencyCode={currencyCode}
                      className="ml-4"
                    />
                  </div>
                </div>
                <div className="flex-1 flex items-center text-sm">
                  {editable ? (
                    <form>
                      <label htmlFor={`quantity-${line.id}`} className="mr-2">
                        Quantity
                      </label>
                      <select
                        disabled={!editable || isUpdating}
                        id={`quantity-${line.id}`}
                        name={`quantity-${line.id}`}
                        value={line.quantity}
                        onChange={(e) => {
                          handleQuantityChange(line.id, Number(e.target.value));
                        }}
                        className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:opacity-50"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num.toString()}
                          </option>
                        ))}
                      </select>
                    </form>
                  ) : (
                    <div className="text-gray-800">
                      <span className="mr-1">Quantity</span>
                      <span className="font-medium">{line.quantity}</span>
                    </div>
                  )}
                  <div className="flex-1"></div>
                  <div className="flex">
                    {editable && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        className="font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50"
                        onClick={() => handleRemove(line.id)}
                      >
                        {isUpdating ? "Removing..." : "Remove"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
