import LogoSquare from "@/components/custom/logo-square";
import { clientEnv } from "@/env/client";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_checkout")({
  component: CheckoutLayoutComponent,
});

function CheckoutLayoutComponent() {
  const { VITE_SITE_NAME } = clientEnv;
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
      <div className="mt-20 grid grid-cols-[1fr_400px]">
        <Outlet />
        <div>cart</div>
      </div>
    </div>
  );
}
