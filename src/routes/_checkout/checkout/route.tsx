import { CheckoutSteps } from "@/components/custom/checkout/step";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_checkout/checkout")({
  component: CheckoutNestedLayoutComponent,
});

function CheckoutNestedLayoutComponent() {
      return (
    <div className="max-w-5xl">
      <CheckoutSteps />
      <div className="rounded-md border border-neutral-200 bg-white px-6 py-4">
        <Outlet />
      </div>
    </div>
  );
}
