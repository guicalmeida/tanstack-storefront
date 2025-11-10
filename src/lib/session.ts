import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { isProduction, serverEnv } from "@/env/server";
import { getActiveCustomer } from "@/lib/vendure";

/**
 * Session data structure for authentication
 */
export type SessionData = {
  vendureToken?: string;
  customerId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isAuthenticated: boolean;
};

/**
 * App session configuration using TanStack Start's useSession
 * This should ONLY be called server-side and will crash if called from client
 */
export const useAppSession = createServerOnlyFn(() => {
  return useSession<SessionData>({
    name: "vendure-auth",
    password: serverEnv.SESSION_SECRET, // Must be at least 32 characters
    cookie: {
      secure: isProduction,
      sameSite: "lax",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  });
});

/**
 * Server function to fetch user data from session
 * This follows the TanStack Start pattern for accessing user data server-side
 * Returns user info if authenticated, null otherwise
 */
export const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  // We need to auth on the server so we have access to secure cookies
  const session = await useAppSession();

  if (!session.data.isAuthenticated || !session.data.customerId) {
    return null;
  }

  return {
    id: session.data.customerId,
    email: session.data.email,
    firstName: session.data.firstName,
    lastName: session.data.lastName,
  };
});

/**
 * Validates the session against the backend and returns user data.
 * If validation fails, it clears the session and returns null.
 * This should be used to protect routes that require authentication.
 */
export const validateAndFetchUser = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();

    if (!session.data.isAuthenticated || !session.data.customerId) {
      return null;
    }

    try {
      // Verify session with Vendure by fetching active customer
      const activeCustomer = await getActiveCustomer();

      if (!activeCustomer) {
        // If no active customer, Vendure session is invalid, so clear local session
        await session.clear();
        return null;
      }

      // Session is valid, return user data from local session
      return {
        id: session.data.customerId,
        email: session.data.email,
        firstName: session.data.firstName,
        lastName: session.data.lastName,
      };
    } catch (error) {
      // If an error occurs (e.g., network error, auth error), assume session is invalid
      console.error("Session validation failed:", error);
      await session.clear();
      return null;
    }
  },
);

/**
 * Server function to fetch current session data
 * This follows the GitHub pattern for accessing session server-side
 * Filters out sensitive data like vendureToken for client safety
 */
export const fetchSession = createServerFn({ method: "GET" }).handler(
  async () => {
    // We need to auth on the server so we have access to secure cookies
    const session = await useAppSession();

    // Return only client-safe data
    return {
      customerId: session.data.customerId,
      email: session.data.email,
      firstName: session.data.firstName,
      lastName: session.data.lastName,
      isAuthenticated: session.data.isAuthenticated,
    };
  },
);

/**
 * Server function to update session data
 */
export const updateSession = createServerFn({ method: "POST" })
  .inputValidator((data: Partial<SessionData>) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();

    await session.update(data);

    return session.data;
  });

/**
 * Server function to clear session (sign out)
 */
export const clearSession = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await useAppSession();

    await session.clear();

    return { success: true };
  },
);

/**
 * Server function to check if user is authenticated
 */
export const isAuthenticated = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();

    return session.data?.isAuthenticated || false;
  },
);
