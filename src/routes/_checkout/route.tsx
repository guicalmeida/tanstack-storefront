import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useCart } from "@/components/custom/cart/cart-context";
import { CartContents } from "@/components/custom/checkout/cart-contents";
import { CartTotals } from "@/components/custom/checkout/cart-totals";
import LogoSquare from "@/components/custom/logo-square";
import { clientEnv } from "@/env/client";

export const Route = createFileRoute("/_checkout")({
  component: CheckoutLayoutComponent,
});

function CheckoutLayoutComponent() {
  const { VITE_SITE_NAME } = clientEnv;
  const { cart: activeOrder } = useCart();
  return (
    <div>
      <header className="relative flex items-center justify-between p-4 lg:px-6">
        <Link
          to="/"
          className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
        >
          <LogoSquare />
          <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
            {VITE_SITE_NAME}
          </div>
        </Link>
        <div>Support Actions</div>
      </header>
      <div className="mt-20 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <Outlet />
        <aside className="bg-gray-50 p-6 rounded-lg border border-gray-200 lg:sticky lg:top-24 self-start">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          {activeOrder ? (
            <>
              <CartContents order={activeOrder} editable={false} />
              <CartTotals order={activeOrder} readonly />
            </>
          ) : (
            <p className="text-gray-500 text-sm">Your cart is empty</p>
          )}
        </aside>
      </div>
    </div>
  );
}
