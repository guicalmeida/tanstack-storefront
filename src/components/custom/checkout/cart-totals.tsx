import type { ResultOf } from "gql.tada";
import { readFragment } from "@/gql/graphql";
import { formatCurrency } from "@/lib/utils";
import type activeOrderFragment from "@/lib/vendure/fragments/active-order";
import { orderDiscountFragment } from "@/lib/vendure/fragments/active-order";

interface CartTotalsProps {
  order?: ResultOf<typeof activeOrderFragment> | null;
  readonly?: boolean;
}

export function CartTotals({ order, readonly = false }: CartTotalsProps) {
  if (!order) {
    return null;
  }

  const currencyCode = order.currencyCode || "USD";

  return (
    <dl className="border-t mt-6 border-gray-200 py-6 space-y-6">
      {order.discounts &&
        order.discounts.length > 0 &&
        order.discounts.map((discount) => {
          const discountData = readFragment(orderDiscountFragment, discount);
          return (
            <div
              key={discountData.description}
              className="flex items-center justify-between"
            >
              <div className="text-sm">
                Coupon:{" "}
                <span className="font-medium text-primary-600">
                  {discountData.description}
                </span>
              </div>
              <div className="text-sm font-medium text-primary-600">
                {formatCurrency(discountData.amountWithTax, currencyCode)}
              </div>
            </div>
          );
        })}

      <div className="flex items-center justify-between">
        <dt className="text-sm">Subtotal</dt>
        <dd className="text-sm font-medium text-gray-900">
          {formatCurrency(order.subTotalWithTax, currencyCode)}
        </dd>
      </div>

      <div className="flex items-center justify-between">
        <dt className="text-sm">Shipping cost</dt>
        <dd className="text-sm font-medium text-gray-900">
          {formatCurrency(order.shippingWithTax || 0, currencyCode)}
        </dd>
      </div>

      {order.couponCodes && order.couponCodes.length > 0 && !readonly && (
        <div className="flex items-center flex-wrap gap-2">
          <div className="text-sm font-medium">Applied coupons:</div>
          {order.couponCodes.map((code) => (
            <div
              key={code}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
            >
              <div className="mx-2">{code}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        <dt className="text-base font-medium">Total</dt>
        <dd className="text-base font-medium text-gray-900">
          {formatCurrency(order.totalWithTax, currencyCode)}
        </dd>
      </div>
    </dl>
  );
}
