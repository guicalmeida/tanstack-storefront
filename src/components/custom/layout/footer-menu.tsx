import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import type { ResultOf } from "gql.tada";
import type { collectionFragment } from "@/lib/vendure/queries/collection";

export function FooterMenuItem({
  item,
}: {
  item: ResultOf<typeof collectionFragment>;
}) {
  return (
    <li>
      <Link
        to={"/collections/$collection"}
        params={{ collection: item.slug }}
        className={clsx(
          "block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300",
        )}
        activeProps={{
          className: "text-black dark:text-neutral-300",
        }}
        activeOptions={{
          exact: true,
          includeHash: false,
          includeSearch: true,
        }}
      >
        {item.name}
      </Link>
    </li>
  );
}

export default function FooterMenu({
  menu,
}: {
  menu: ResultOf<typeof collectionFragment>[];
}) {
  if (!menu?.length) return null;

  return (
    <nav>
      <ul>
        {menu.map((item) => {
          return <FooterMenuItem key={item.id} item={item} />;
        })}
      </ul>
    </nav>
  );
}
