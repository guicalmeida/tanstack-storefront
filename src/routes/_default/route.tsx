import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/custom/layout/navbar";
import { getMenu } from "@/lib/vendure";

export const Route = createFileRoute("/_default")({
  loader: async () => {
    const menu = await getMenu();

    return {
      menu,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { menu } = Route.useLoaderData();

  return (
    <div>
      <Navbar menu={menu} />
      <Outlet />
    </div>
  );
}
