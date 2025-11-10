import { Link } from "@tanstack/react-router";

const navigation = [
  { name: "Orders", href: "/account/orders" },
  { name: "Settings", href: "/account/settings" },
];

export function AccountNavigation() {
  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
          activeProps={{ className: "bg-gray-100 text-gray-900" }}
          inactiveProps={{
            className: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          }}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
