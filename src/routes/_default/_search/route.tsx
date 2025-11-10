import { createFileRoute, Outlet } from "@tanstack/react-router";
import ErrorComponent from "@/components/custom/errors/error";
import Footer from "@/components/custom/layout/footer";
import Collections from "@/components/custom/layout/search/collections";
import FilterList from "@/components/custom/layout/search/filter";
import { SearchLayoutSkeleton } from "@/components/custom/skeletons/search";
import { sorting } from "@/lib/constants";
import { sortCollectionsByHierarchy } from "@/lib/utils";
import { getCollections, getMenu } from "@/lib/vendure";

export const Route = createFileRoute("/_default/_search")({
  loader: async () => {
    const [collections, menu] = await Promise.all([
      getCollections(),
      getMenu(),
    ]);

    const sortedCollections = sortCollectionsByHierarchy(collections);

    return { collections: sortedCollections, menu };
  },
  pendingComponent: SearchLayoutSkeleton,
  errorComponent: ErrorComponent,
  component: SearchLayout,
});

function SearchLayout() {
  const { collections, menu } = Route.useLoaderData();

  return (
    <>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
        <div className="order-first w-full flex-none md:max-w-[125px]">
          <Collections collections={collections} />
        </div>
        <div className="order-last min-h-screen w-full md:order-0">
          <Outlet />
        </div>
        <div className="order-0 flex-none md:order-last md:w-[125px]">
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div>
      <Footer menu={menu} />
    </>
  );
}
