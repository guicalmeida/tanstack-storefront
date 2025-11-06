import { createFileRoute } from "@tanstack/react-router";
import { Confirmation } from "@/components/custom/checkout/confirmation";
import { createBasicMeta } from "@/lib/metadata";
import { getOrderByCode } from "@/lib/vendure";

export const Route = createFileRoute("/_checkout/checkout/confirmation/$code")({
  loader: async ({ params }) => {
    const order = await getOrderByCode({ data: params.code });
    return { order };
  },
  head: ({ loaderData }) => {
    const title = "Order Confirmation";
    const description = loaderData?.order?.code
      ? `Your order ${loaderData.order.code} has been confirmed!`
      : "Thank you for your order!";

    return {
      meta: createBasicMeta(title, description, true),
    };
  },
  component: ConfirmationComponent,
});

function ConfirmationComponent() {
  const { order } = Route.useLoaderData();

  return <Confirmation order={order} />;
}
