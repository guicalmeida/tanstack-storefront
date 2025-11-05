import { CheckoutSteps } from "@/components/custom/checkout/step";
// import { getActiveOrder } from "@/lib/vendure";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_checkout/checkout")({
  // loader: async () => {
  // const activeOrder = await getActiveOrder();
  //   return { activeOrder };
  // },
  component: CheckoutNestedLayoutComponent,
});

function CheckoutNestedLayoutComponent() {
  // const {activeOrder} = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-5xl">
      <CheckoutSteps />
      <div className="rounded-md border border-neutral-200 bg-white px-6 py-4">
        <Outlet />
      </div>
    </div>
  );
}
