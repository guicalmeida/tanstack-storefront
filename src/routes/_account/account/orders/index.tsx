import { createFileRoute, Link } from "@tanstack/react-router";
import { getCustomerOrders } from "@/lib/vendure";
import { formatCurrency, formatDate, getOrderStatusColor } from "@/lib/utils";
import { createBasicMeta } from "@/lib/metadata";
import { readFragment } from "@/gql/graphql";
import orderFragment from "@/lib/vendure/fragments/order";

export const Route = createFileRoute("/_account/account/orders/")({
  loader: async () => {
    const ordersResult = await getCustomerOrders({
      data: {
        sort: { createdAt: "DESC" },
        filter: { active: { eq: false } },
      },
    });

    return {
      orders: ordersResult?.items || [],
    };
  },
  head: ({ loaderData }) => {
    const ordersCount = loaderData?.orders?.length || 0;
    const description =
      ordersCount > 0
        ? `View your ${ordersCount} ${ordersCount === 1 ? "order" : "orders"}. Track shipments, view order details, and manage returns.`
        : "Your order history. Start shopping to see your orders here.";

    return {
      meta: createBasicMeta("Order History", description, true),
    };
  },
  component: AccountOrdersComponent,
});

function AccountOrdersComponent() {
  const { orders } = Route.useLoaderData();

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Order History</h1>
        <p className="mb-8 text-gray-500">You haven't placed any orders yet.</p>
        <Link
          to="/"
          className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        <p className="mt-2 text-sm text-gray-500">
          Check the status of recent orders, manage returns, and discover
          similar products.
        </p>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {orders.map((orderData) => {
            const order = readFragment(orderFragment, orderData);
            return (
              <li key={order.id}>
                <Link
                  to="/account/orders/$code"
                  params={{ code: order.code }}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              Order #{order.code}
                            </p>
                            <span
                              className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getOrderStatusColor(order.state)}`}
                            >
                              {order.state}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <p>Placed on {formatDate(order.createdAt)}</p>
                            <p className="ml-4">
                              {order.totalQuantity}{" "}
                              {order.totalQuantity === 1 ? "item" : "items"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(
                            order.totalWithTax,
                            order.currencyCode,
                          )}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          View details →
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
