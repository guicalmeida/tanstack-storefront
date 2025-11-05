import { useRouteContext } from "@tanstack/react-router";

/**
 * Hook to access authentication session data and current user in client components
 * This follows the TanStack Start pattern of getting session data through route context
 */
export function useAuth() {
  const { session, activeCustomer } = useRouteContext({
    from: "__root__",
  });
  return {
    session,
    isAuthenticated: session?.isAuthenticated || false,
    customerId: session?.customerId,
    activeCustomer,
  };
}
