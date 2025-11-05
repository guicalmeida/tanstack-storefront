import type { ResultOf } from "gql.tada";
import { createContext, useContext, useMemo } from "react";
import type activeOrderFragment from "@/lib/vendure/fragments/active-order";

// import type productFragment from "@/lib/vendure/fragments/product";
// import type { variantFragment } from "@/lib/vendure/fragments/product";

// type UpdateType = "plus" | "minus" | "delete";

// type CartAction =
//   | {
//       type: "UPDATE_ITEM";
//       payload: { merchandiseId: string; updateType: UpdateType };
//     }
//   | {
//       type: "ADD_ITEM";
//       payload: {
//         variant: ResultOf<typeof variantFragment>;
//         product: ResultOf<typeof productFragment>;
//       };
//     };

type CartContextType = {
  cart?: ResultOf<typeof activeOrderFragment> | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  initialCart,
}: {
  children: React.ReactNode;
  initialCart: ResultOf<typeof activeOrderFragment> | null;
}) {
  const value = useMemo(
    () => ({
      cart: initialCart,
    }),
    [initialCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
