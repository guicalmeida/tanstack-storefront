import { useMatchRoute, useSearch } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ListItem } from ".";
import { FilterItem } from "./item";

export default function FilterItemDropdown({
  list,
}: {
  list: readonly ListItem[];
}) {
  const matchRoute = useMatchRoute();
  const { sort } = useSearch({ strict: false });
  const active = useMemo(() => {
    for (const listItem of list) {
      if (
        "slug" in listItem &&
        (sort === listItem.slug ||
          !!matchRoute({
            to: "/collections/$collection",
            params: { collection: listItem.slug },
          }))
      ) {
        return listItem.name;
      }
    }
    return "";
  }, [list, sort, matchRoute]);
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpenSelect(!openSelect);
        }}
        aria-haspopup="menu"
        aria-expanded={openSelect}
        data-state={openSelect ? "open" : "closed"}
        className="flex w-full items-center justify-between rounded border border-black/30 px-4 py-2 text-sm dark:border-white/30"
      >
        <span>{active}</span>
        <ChevronDown className="h-4" aria-hidden="true" />
      </button>
      {openSelect && (
        <div
          role="menu"
          onClick={() => {
            setOpenSelect(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") {
              setOpenSelect(false);
            }
          }}
          className="absolute z-40 w-full rounded-b-md bg-white p-4 shadow-md dark:bg-black"
        >
          {list.map((item: ListItem, i) => (
            <FilterItem
              key={`filter-${i}-${item.slug || item.name}`}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}
