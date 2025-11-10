import { createFileRoute } from "@tanstack/react-router";
import { Carousel } from "@/components/custom/carousel";
import ErrorComponent from "@/components/custom/errors/error";
import { ThreeItemGrid } from "@/components/custom/grid/three-items";
import Footer from "@/components/custom/layout/footer";
import { getBaseUrl } from "@/lib/metadata";
import {
  getActiveChannel,
  getCollectionProducts,
  getMenu,
} from "@/lib/vendure";

export const Route = createFileRoute("/_default/")({
  loader: async () => {
    const [activeChannel, homepageItems, carouselProducts, menu] =
      await Promise.all([
        getActiveChannel(),
        getCollectionProducts({
          data: {
            collection: "electronics",
          },
        }),
        getCollectionProducts({
          data: {
            collection: "homepage-carousel",
          },
        }),
        getMenu(),
      ]);

    return {
      activeChannel,
      homepageItems,
      carouselProducts,
      menu,
    };
  },
  // Homepage inherits all metadata from root layout
  scripts: () => {
    const baseUrl = getBaseUrl();

    // Simple breadcrumb for homepage
    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
      ],
    };

    return [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbJsonLd),
      },
    ];
  },
  errorComponent: ErrorComponent,
  component: App,
});

function App() {
  const { activeChannel, homepageItems, carouselProducts, menu } =
    Route.useLoaderData();

  return (
    <>
      <ThreeItemGrid
        homepageItems={homepageItems}
        activeChannel={activeChannel}
      />
      <Carousel products={carouselProducts} activeChannel={activeChannel} />
      <Footer menu={menu} />
    </>
  );
}
