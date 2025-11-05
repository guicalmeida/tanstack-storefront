import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AccountNavigation } from "@/components/custom/account/navigation";
import { Navbar } from "@/components/custom/layout/navbar";
import { getMenu } from "@/lib/vendure";

export const Route = createFileRoute("/_account")({
  beforeLoad: async ({ context }) => {
    if (!context.session?.isAuthenticated) {
      throw redirect({
        to: "/sign-in",
      });
    }
  },
  loader: async () => {
    const menu = await getMenu();

    return {
      menu,
    };
  },
  component: AccountLayoutComponent,
});

function AccountLayoutComponent() {
  const { menu } = Route.useLoaderData();
  return (
    <div>
      <Navbar menu={menu} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <aside className="px-2 py-6 sm:px-6 lg:col-span-3 lg:px-0 lg:py-0">
            <AccountNavigation />
          </aside>
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
