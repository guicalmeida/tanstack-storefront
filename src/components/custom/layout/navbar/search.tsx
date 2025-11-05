import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import type { FormEvent } from "react";

export default function Search() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("q") as string;

    navigate({
      to: "/search",
      search: { q: query },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
    >
      <input
        type="text"
        name="q"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={search?.q || ""}
        className="w-full rounded-lg border bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 mr-3 flex h-full items-center justify-center bg-transparent border-none cursor-pointer"
      >
        <SearchIcon className="h-4 w-4" />
      </button>
    </form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Search for products..."
        className="w-full rounded-lg border bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        disabled
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center justify-center">
        <SearchIcon className="h-4 w-4" />
      </div>
    </form>
  );
}
