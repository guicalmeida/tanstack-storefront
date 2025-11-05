import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtools } from "@tanstack/react-form-devtools";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { getCurrentUserAction } from "@/components/custom/account/actions";
import { CartProvider } from "@/components/custom/cart/cart-context";
import { ChannelProvider } from "@/components/custom/cart/channel-context";
import ErrorComponent from "@/components/custom/errors/error";
import { Toaster } from "@/components/ui/sonner";
import { clientEnv } from "@/env/client";
import { fetchSession } from "@/lib/session";
import { ensureStartsWith } from "@/lib/utils";
import { getActiveChannel, getActiveOrder } from "@/lib/vendure";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => {
    const {
      VITE_SITE_NAME,
      VITE_COMPANY_NAME,
      VITE_TWITTER_CREATOR,
      VITE_TWITTER_SITE,
    } = clientEnv;

    // Base URL construction
    const baseUrl = import.meta.env.VITE_VERCEL_URL
      ? `https://${import.meta.env.VITE_VERCEL_URL}`
      : "http://localhost:3000";

    // Twitter handle formatting
    const twitterCreator = VITE_TWITTER_CREATOR
      ? ensureStartsWith(VITE_TWITTER_CREATOR, "@")
      : undefined;
    const twitterSite = VITE_TWITTER_SITE
      ? ensureStartsWith(VITE_TWITTER_SITE, "@")
      : undefined;

    // Site description
    const siteDescription = `Discover quality products at ${VITE_SITE_NAME}. Your trusted online marketplace for the best deals and premium shopping experience.`;

    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: VITE_SITE_NAME,
        },
        {
          name: "description",
          content: siteDescription,
        },
        {
          name: "keywords",
          content: `ecommerce, online shopping, ${VITE_SITE_NAME}, marketplace, quality products`,
        },
        {
          name: "robots",
          content: "index, follow",
        },
        {
          name: "author",
          content: VITE_COMPANY_NAME || VITE_SITE_NAME,
        },
        {
          name: "generator",
          content: "TanStack Start",
        },
        // Open Graph tags
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:title",
          content: VITE_SITE_NAME,
        },
        {
          property: "og:description",
          content: siteDescription,
        },
        {
          property: "og:url",
          content: baseUrl,
        },
        {
          property: "og:site_name",
          content: VITE_SITE_NAME,
        },
        {
          property: "og:locale",
          content: "en_US",
        },
        // Twitter Card tags
        ...(twitterCreator && twitterSite
          ? [
              {
                name: "twitter:card",
                content: "summary_large_image",
              },
              {
                name: "twitter:site",
                content: twitterSite,
              },
              {
                name: "twitter:creator",
                content: twitterCreator,
              },
              {
                name: "twitter:title",
                content: VITE_SITE_NAME,
              },
              {
                name: "twitter:description",
                content: siteDescription,
              },
            ]
          : []),
        // Additional SEO meta tags
        {
          name: "theme-color",
          content: "#000000",
        },
        {
          name: "msapplication-TileColor",
          content: "#000000",
        },
        {
          name: "format-detection",
          content: "telephone=no",
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "canonical",
          href: baseUrl,
        },
        {
          rel: "icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "manifest",
          href: "/site.webmanifest",
        },
      ],
    };
  },
  errorComponent: ErrorComponent,
  beforeLoad: async () => {
    const session = await fetchSession();
    const activeCustomer = session?.isAuthenticated
      ? await getCurrentUserAction()
      : null;
    return { session, activeCustomer };
  },
  loader: async () => {
    const [activeOrder, activeChannel] = await Promise.all([
      getActiveOrder(),
      getActiveChannel(),
    ]);
    return { activeOrder, activeChannel };
  },
  scripts: () => {
    const { VITE_SITE_NAME, VITE_COMPANY_NAME } = clientEnv;

    const baseUrl = import.meta.env.VITE_VERCEL_URL
      ? `https://${import.meta.env.VITE_VERCEL_URL}`
      : "http://localhost:3000";

    // Organization structured data
    const organizationJsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: VITE_COMPANY_NAME || VITE_SITE_NAME,
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      sameAs: [
        ...(clientEnv.VITE_TWITTER_SITE ? [clientEnv.VITE_TWITTER_SITE] : []),
      ],
    };

    // Website structured data
    const websiteJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: VITE_SITE_NAME,
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    };

    return [
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationJsonLd),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteJsonLd),
      },
    ];
  },
  component: RootLayout,
  shellComponent: RootDocument,
});

function RootLayout() {
  const { activeOrder, activeChannel } = Route.useLoaderData();

  return (
    <ChannelProvider channel={activeChannel}>
      <CartProvider initialCart={activeOrder}>
        <main>
          <Outlet />
          <Toaster />
        </main>
      </CartProvider>
    </ChannelProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: "TanStack Form",
              render: <FormDevtools />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
