import { Link } from "@tanstack/react-router";
import type { ResultOf } from "gql.tada";
import { Menu, X } from "lucide-react";
import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWindowResize } from "@/hooks";
import type { collectionFragment } from "@/lib/vendure/queries/collection";
import Search, { SearchSkeleton } from "./search";

export default function MobileMenu({
  menu,
}: {
  menu: ResultOf<typeof collectionFragment>[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  const { width } = useWindowResize();

  useLayoutEffect(() => {
    if (width > 768) {
      setIsOpen(false);
    }
  }, [width]);

  useEffect(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors md:hidden dark:border-neutral-700 dark:text-white"
      >
        <Menu className="h-4 w-4" />
      </button>

      <Sheet open={isOpen} onOpenChange={(open) => !open && closeMobileMenu()}>
        <SheetContent
          side="left"
          showCloseButton={false}
          overlayClassName="fixed inset-0 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          className="fixed inset-y-0 left-0 z-50 h-full w-full flex flex-col bg-white pb-6 dark:bg-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left transition-all ease-in-out duration-300 gap-0 shadow-lg border-r border-neutral-200 dark:border-neutral-700 sm:max-w-sm"
        >
          {/* Hidden title for accessibility */}
          <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

          <div className="p-4 flex flex-col h-full">
            <SheetClose asChild>
              <button
                type="button"
                className="mb-6 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                aria-label="Close mobile menu"
              >
                <X className="h-6 w-6" />
              </button>
            </SheetClose>

            <div className="mb-6 w-full">
              <Suspense fallback={<SearchSkeleton />}>
                <Search />
              </Suspense>
            </div>

            {menu.length ? (
              <ul className="flex w-full flex-col space-y-1">
                {menu.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={"/collections/$collection"}
                      params={{ collection: item.slug }}
                      preload="intent"
                      onClick={closeMobileMenu}
                      className="block py-3 text-lg text-black transition-colors hover:text-neutral-500 dark:text-white border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
