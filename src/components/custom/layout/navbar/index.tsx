import { Link } from "@tanstack/react-router";
import type { ResultOf } from "gql.tada";
import { Suspense } from "react";
import OpenSignIn from "@/components/custom/account/open-sign-in";
import { UserDropdown } from "@/components/custom/account/user-dropdown";
import CartModal from "@/components/custom/cart/modal";
import LogoSquare from "@/components/custom/logo-square";
import { readFragment } from "@/gql/graphql";
import { useAuth } from "@/hooks/use-auth";
import { clientEnv } from "@/env/client";
import { collectionFragment } from "@/lib/vendure/queries/collection";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

interface NavbarProps {
  menu: ResultOf<typeof collectionFragment>[];
}

export function Navbar({ menu }: NavbarProps) {
  const { activeCustomer } = useAuth();

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      {/* Mobile menu button */}
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>

      {/* Desktop layout */}
      <div className="flex w-full items-center">
        {/* Left section: Logo and navigation menu */}
        <div className="flex w-full md:w-1/3">
          <Link
            to="/"
            className="pr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {clientEnv.VITE_SITE_NAME}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((data) => {
                const item = readFragment(collectionFragment, data);
                return (
                  <li key={item.slug}>
                    <Link
                      to={"/collections/$collection"}
                      params={{ collection: item.slug }}
                      className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        {/* Center section: Search (desktop only) */}
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>

        {/* Right section: User actions and cart */}
        <div className="flex justify-end gap-2 md:w-1/3">
          {activeCustomer ? (
            <UserDropdown customer={activeCustomer} />
          ) : (
            <OpenSignIn />
          )}
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
