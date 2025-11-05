import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";

export function SignOutButton() {
  return (
    <DropdownMenuItem asChild>
      <Link to="/logout" className="cursor-pointer">
        Sign out
      </Link>
    </DropdownMenuItem>
  );
}
