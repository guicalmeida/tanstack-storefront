
import { createServerFn } from "@tanstack/react-start";
import { updateSession } from "@/lib/session";
import { isVendureError } from "@/lib/type-guards";
import {
  authenticateCustomer,
  getActiveCustomer,
  registerCustomerAccount,
  updateCustomer,
  verifyCustomerAccount,
} from "@/lib/vendure";

export type RegisterState =
  | {
      type: "success";
    }
  | {
      type: "error";
      message: string;
    }
  | null;

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
        const customer = await getActiveCustomer();
        if (customer) {

          await updateSession({
            data: {
              isAuthenticated: true,
              customerId: customer.id,
              email: customer.emailAddress,
              firstName: customer.firstName,
              lastName: customer.lastName,
            },
          });
        }

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

      // Update session with new customer data
      const customer = await getActiveCustomer();
      if (customer) {
        await updateSession({
          data: {
            firstName: customer.firstName,
            lastName: customer.lastName,
          },
        });
      }

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
 * Server function for registering a new account
 */
export const registerAccount = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      emailAddress: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      title?: string;
    }) => {
      if (!data.emailAddress || !data.password) {
        throw new Error("Email and password are required");
      }
      if (!data.firstName || !data.lastName) {
        throw new Error("First name and last name are required");
      }
      return data;
    },
  )
  .handler(async ({ data }): Promise<RegisterState> => {
    try {
      const res = await registerCustomerAccount({
        data: {
          emailAddress: data.emailAddress,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber || null,
          title: data.title || null,
        },
      });

      if (res.__typename === "Success") {
        return {
          type: "success",
        };
      }

      if (
        res.__typename === "MissingPasswordError" ||
        res.__typename === "PasswordValidationError" ||
        res.__typename === "NativeAuthStrategyError"
      ) {
        return {
          type: "error",
          message: res.message,
        };
      }

      return {
        type: "error",
        message: "Error creating account",
      };
    } catch (e: unknown) {
      if (isVendureError(e)) {
        return {
          type: "error",
          message: e.message?.toString() || "Error creating account",
        };
      }

      return {
        type: "error",
        message: "Error creating account",
      };
    }
  });

export type VerifyAccountState =
  | {
      type: "success";
      id: string;
    }
  | {
      type: "error";
      message: string;
    }
  | null;

/**
 * Server function for verifying customer account
 */
export const verifyAccount = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; password?: string }) => {
    if (!data.token) {
      throw new Error("Verification token is required");
    }
    return data;
  })
  .handler(async ({ data }): Promise<VerifyAccountState> => {
    try {
      const res = await verifyCustomerAccount({
        data: {
          token: data.token,
          password: data.password || null,
        },
      });

      if (res.__typename === "CurrentUser") {
        // Get the full customer data to populate session
        const customer = await getActiveCustomer();

        if (customer) {
          // Update session with user data
          await updateSession({
            data: {
              isAuthenticated: true,
              customerId: customer.id,
              email: customer.emailAddress,
              firstName: customer.firstName,
              lastName: customer.lastName,
            },
          });
        }

        return {
          type: "success",
          id: res.id,
        };
      }

      if (
        res.__typename === "VerificationTokenInvalidError" ||
        res.__typename === "VerificationTokenExpiredError" ||
        res.__typename === "MissingPasswordError" ||
        res.__typename === "PasswordValidationError" ||
        res.__typename === "PasswordAlreadySetError" ||
        res.__typename === "NativeAuthStrategyError"
      ) {
        return {
          type: "error",
          message: res.message,
        };
      }

      return {
        type: "error",
        message: "Error verifying account",
      };
    } catch (e: unknown) {
      if (isVendureError(e)) {
        return {
          type: "error",
          message: e.message?.toString() || "Error verifying account",
        };
      }

      return {
        type: "error",
        message: "Error verifying account",
      };
    }
  });
