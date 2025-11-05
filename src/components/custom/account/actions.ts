import { createServerFn } from "@tanstack/react-start";
import { isVendureError } from "@/lib/type-guards";
import {
  authenticateCustomer,
  getActiveCustomer,
  updateCustomer,
} from "@/lib/vendure";

export type SignInState =
  | {
      type: "success";
      id: string;
    }
  | {
      type: "error";
      message: string;
    }
  | null;

export type UpdateCustomerState =
  | {
      type: "success";
    }
  | {
      type: "error";
      message: string;
    }
  | null;

/**
 * Server function for sign in
 * Uses proper session management instead of manual cookie handling
 */
export const signIn = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => {
    if (!data.username || !data.password) {
      throw new Error("Username and password are required");
    }
    return data;
  })
  .handler(async ({ data }): Promise<SignInState> => {
    try {
      const res = await authenticateCustomer({ data });

      if (res.__typename === "CurrentUser") {
        return {
          type: "success",
          id: res.id,
        };
      }

      if (
        res.__typename === "InvalidCredentialsError" ||
        res.__typename === "NotVerifiedError"
      ) {
        return {
          type: "error",
          message: res.message,
        };
      }

      return {
        type: "error",
        message: "Error signing in",
      };
    } catch (_e) {
      return {
        type: "error",
        message: "Error signing in",
      };
    }
  });

/**
 * Server function for updating customer profile
 */
export const updateCustomerAction = createServerFn({ method: "POST" })
  .inputValidator((data: { firstName: string; lastName: string }) => {
    if (!data.firstName || !data.lastName) {
      throw new Error("First name and last name are required");
    }
    return data;
  })
  .handler(async ({ data }): Promise<UpdateCustomerState> => {
    try {
      await updateCustomer({ data });

      return {
        type: "success",
      };
    } catch (e: unknown) {
      if (isVendureError(e)) {
        return {
          type: "error",
          message: e.message?.toString() || "Error updating profile",
        };
      }

      return {
        type: "error",
        message: "Error updating profile",
      };
    }
  });

/**
 * Server function to get current user for client components
 */
export const getCurrentUserAction = createServerFn().handler(async () => {
  try {
    return await getActiveCustomer();
  } catch (_error) {
    // If there's an error getting the user, they're likely not authenticated
    return null;
  }
});
