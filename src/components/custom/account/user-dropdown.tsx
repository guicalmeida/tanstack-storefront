import { Link } from "@tanstack/react-router";
import type { ResultOf } from "gql.tada";
import { UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { activeCustomerFragment } from "@/lib/vendure/queries/active-customer";
import { SignOutButton } from "./sign-out-button";

export function UserDropdown({
  customer,
}: {
  customer: ResultOf<typeof activeCustomerFragment>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative flex h-11 w-auto cursor-pointer items-center justify-center rounded-md border border-neutral-200 px-3 md:px-4 text-sm font-medium text-black transition-colors dark:border-neutral-700 dark:text-white">
          <UserIcon className="h-4 transition-all ease-in-out md:mr-1" />
          <span className="hidden md:inline ml-1">
            {customer.firstName} {customer.lastName}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Hello, {customer.firstName}!</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/account">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/orders">Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
