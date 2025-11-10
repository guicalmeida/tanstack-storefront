import type { ResultOf } from "gql.tada";
import { CheckCircleIcon } from "lucide-react";
import { readFragment } from "@/gql/graphql";
import {
  orderAddressFragment,
  orderCustomerFragment,
} from "@/lib/vendure/fragments/active-order";
import type { orderByCodeQuery } from "@/lib/vendure/mutations/checkout";
import { CartContents } from "./cart-contents";
import { CartTotals } from "./cart-totals";

interface ConfirmationProps {
  order: ResultOf<typeof orderByCodeQuery>["orderByCode"] | null;
}

export function Confirmation({ order }: ConfirmationProps) {
  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-600" />
        </div>

        <h2 className="text-3xl font-light tracking-tight text-gray-900 text-center mb-4">
          Order confirmed!
        </h2>

        <p className="text-lg text-gray-700 text-center mb-2">
          Your order{" "}
          <span className="font-bold text-gray-900">{order.code}</span> has been
          received!
        </p>

        <p className="text-sm text-gray-600 text-center mb-8">
          We'll send you a confirmation email with order details and tracking
          information.
        </p>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Order summary
          </h3>

          <div className="mb-6">
            <CartContents order={order} editable={false} />
          </div>

          <CartTotals order={order} readonly />
        </div>

        {order.shippingAddress &&
          (() => {
            const address = readFragment(
              orderAddressFragment,
              order.shippingAddress,
            );
            return (
              <div className="border-t border-gray-200 pt-8 mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Shipping address
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">{address.fullName}</p>
                  <p>{address.streetLine1}</p>
                  {address.streetLine2 && <p>{address.streetLine2}</p>}
                  <p>
                    {address.city}
                    {address.province && `, ${address.province}`}{" "}
                    {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  {address.phoneNumber && (
                    <p className="mt-2">{address.phoneNumber}</p>
                  )}
                </div>
              </div>
            );
          })()}

        {order.customer &&
          (() => {
            const customer = readFragment(
              orderCustomerFragment,
              order.customer,
            );
            return (
              <div className="border-t border-gray-200 pt-8 mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Contact information
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p>{customer.emailAddress}</p>
                  {customer.phoneNumber && <p>{customer.phoneNumber}</p>}
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
}
