import type { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { addToCart, adjustCartItem, removeFromCart } from "@/lib/vendure";

type RouterInstance = ReturnType<typeof useRouter>;

type CartActionResult = {
  success: boolean;
  error?: string;
};

/**
 * Server function to add an item to the cart
 */
export const addItem = createServerFn({ method: "POST" })
  .inputValidator((data: { selectedVariantId?: string }) => data)
  .handler(async ({ data }): Promise<CartActionResult> => {
    const { selectedVariantId } = data;

    if (!selectedVariantId) {
      return {
        success: false,
        error: "Missing variant ID",
      };
    }

    try {
      const result = await addToCart({
        data: { productVariantId: selectedVariantId, quantity: 1 },
      });

      // Handle GraphQL union type response
      // Check if it's an Order (success case) - has 'id' and 'lines' properties
      if ("id" in result && "lines" in result) {
        return { success: true };
      }

      // Handle error types by checking for errorCode property
      if ("errorCode" in result && "message" in result) {
        const errorResult = result as {
          errorCode: string;
          message: string;
          quantityAvailable?: number;
        };

        // InsufficientStockError has quantityAvailable
        if ("quantityAvailable" in result) {
          const available = result.quantityAvailable as number;
          return {
            success: false,
            error:
              available > 0
                ? `Only ${available} item${available !== 1 ? "s" : ""} available in stock`
                : "This item is out of stock",
          };
        }

        // Return the error message from other error types
        return {
          success: false,
          error: errorResult.message || "Error adding item to cart",
        };
      }

      return {
        success: false,
        error: "Error adding item to cart",
      };
    } catch (_e) {
      return {
        success: false,
        error: "Error adding item to cart",
      };
    }
  });

/**
 * Server function to remove an item from the cart
 */
export const removeItem = createServerFn({ method: "POST" })
  .inputValidator((data: { merchandiseId: string }) => data)
  .handler(async ({ data }): Promise<CartActionResult> => {
    const { merchandiseId } = data;

    try {
      await removeFromCart({ data: merchandiseId });
      return { success: true };
    } catch (_e) {
      return {
        success: false,
        error: "Error removing item from cart",
      };
    }
  });

/**
 * Server function to update item quantity in the cart
 */
export const updateItemQuantity = createServerFn({ method: "POST" })
  .inputValidator((data: { merchandiseId: string; quantity: number }) => data)
  .handler(async ({ data }): Promise<CartActionResult> => {
    const { merchandiseId, quantity } = data;

    try {
      await adjustCartItem({ data: { orderLineId: merchandiseId, quantity } });
      return { success: true };
    } catch (e) {
      console.error(e);
      return {
        success: false,
        error: "Error updating item quantity",
      };
    }
  });

/**
 * Client-side helper functions for cart actions with router invalidation
 * These handle calling the server functions and invalidating router cache
 */
export const cartActions = {
  /**
   * Add item to cart and invalidate router cache
   */
  addItem: async (selectedVariantId: string, router: RouterInstance) => {
    const result = await addItem({ data: { selectedVariantId } });
    if (result.success) {
      // Invalidate the root route to refresh cart data
      await router.invalidate();
    }
    return result;
  },

  /**
   * Remove item from cart and invalidate router cache
   */
  removeItem: async (merchandiseId: string, router: RouterInstance) => {
    const result = await removeItem({ data: { merchandiseId } });
    if (result.success) {
      // Invalidate the root route to refresh cart data
      await router.invalidate();
    }
    return result;
  },

  /**
   * Update item quantity and invalidate router cache
   */
  updateItemQuantity: async (
    merchandiseId: string,
    quantity: number,
    router: RouterInstance,
  ) => {
    const result = await updateItemQuantity({
      data: { merchandiseId, quantity },
    });
    if (result.success) {
      // Invalidate the root route to refresh cart data
      await router.invalidate();
    }
    return result;
  },

  /**
   * Navigate to checkout using client-side navigation
   * This provides better UX than server-side redirects for user interactions
   */
  redirectToCheckout: (router: RouterInstance) => {
    // TODO: resolve first step of checkout
    router.navigate({ to: "/checkout" });
  },
};
