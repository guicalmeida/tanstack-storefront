import { redirect, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { clearSession } from "@/lib/session";

const logoutFn = createServerFn().handler(async () => {
  await clearSession();

  throw redirect({
    to: "/",
  });
});

export const Route = createFileRoute("/logout")({
  preload: false,
  loader: () => logoutFn(),
});
