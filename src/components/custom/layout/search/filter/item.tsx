import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { clientEnv } from "@/env/client";
import type { SortFilterItem } from "@/lib/constants";
import type { ListItem, PathFilterItem } from ".";

function PathFilterItemComponent({ item }: { item: PathFilterItem }) {
  const { VITE_PARENT_ID } = clientEnv;
  return (
    <li className="mt-2 flex text-black dark:text-white" key={item.slug}>
      <Link
        to="/collections/$collection"
        params={{ collection: item.slug }}
        activeOptions={{ exact: false }}
        className={clsx("w-full text-sm underline-offset-4", {
          "pl-4": item.parentId !== VITE_PARENT_ID,
        })}
        activeProps={{
          className: "underline font-medium dark:text-neutral-100",
        }}
        inactiveProps={{
          className: "hover:underline dark:hover:text-neutral-100",
        }}
      >
        <span>{item.name}</span>
      </Link>
    </li>
  );
}

function SortFilterItemComponent({ item }: { item: SortFilterItem }) {
  return (
    <li
      className="mt-2 flex text-sm text-black dark:text-white"
      key={item.slug}
    >
      <Link
        to="."
        search={(prev) => ({
          ...prev,
          ...(item?.slug?.length ? { sort: item.slug } : { sort: undefined }),
        })}
        className="w-full underline-offset-4"
        activeProps={{
          className: "underline font-medium",
          "aria-current": "page",
        }}
        inactiveProps={{
          className: "hover:underline hover:underline-offset-4",
        }}
      >
        {({ isActive }) => (
          <span className={isActive ? "" : ""}>{item.name}</span>
        )}
      </Link>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return "sortKey" in item ? (
    <SortFilterItemComponent item={item} />
  ) : (
    <PathFilterItemComponent item={item} />
  );
}
