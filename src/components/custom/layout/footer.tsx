import { Link } from "@tanstack/react-router";
import type { ResultOf } from "gql.tada";
import FooterMenu from "@/components/custom/layout/footer-menu";
import LogoSquare from "@/components/custom/logo-square";
import { clientEnv } from "@/env/client";
import type { collectionFragment } from "@/lib/vendure/queries/collection";
import { Route as HomeRoute } from "@/routes/_default/index";

const COMPANY_NAME = clientEnv.VITE_COMPANY_NAME;
const SITE_NAME = clientEnv.VITE_SITE_NAME;

interface FooterProps {
  menu: ResultOf<typeof collectionFragment>[];
}

export default function Footer({ menu }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm min-[1320px]:px-0 md:flex-row md:gap-12 md:px-4 dark:border-neutral-700">
        <div>
          <Link
            className="flex items-center gap-2 text-black md:pt-1 dark:text-white"
            to={HomeRoute.to}
          >
            <LogoSquare size="sm" />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <FooterMenu menu={menu} />
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 min-[1320px]:px-0 md:flex-row md:gap-0 md:px-4">
          <p suppressHydrationWarning>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".") ? "." : ""}{" "}
            All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-px border-l border-neutral-400 md:inline-block" />
          <p>
            <a href="https://github.com/guicalmeida/tanstack-storefront">
              View the source
            </a>
          </p>
          <div className="md:ml-auto">
            <p className="text-xs">
              Built by{" "}
              <a
                href="https://github.com/guicalmeida"
                className="text-black hover:underline dark:text-white"
              >
                Guilherme de Almeida
              </a>
            </p>
            <p className="text-xs mt-1">
              Original storefront by{" "}
              <a
                href="https://vendure.io"
                className="text-black hover:underline dark:text-white"
              >
                Vendure
              </a>{" "}
              &{" "}
              <a
                href="https://vercel.com"
                className="text-black hover:underline dark:text-white"
              >
                Vercel
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
