import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_account/account/")({
  preload: false,
  loader: () => {
    throw redirect({
      to: "/account/orders",
    });
  },
});
