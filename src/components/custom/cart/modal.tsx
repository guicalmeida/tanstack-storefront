import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CartItem } from "@/components/custom/cart/cart-item";
import Price from "@/components/custom/price";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { getCheckoutSteps } from "@/lib/vendure/checkout";
import { useCart } from "./cart-context";
import CloseCart from "./close-cart";
import OpenCart from "./open-cart";

export default function CartModal() {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(
    cart && "totalQuantity" in cart ? cart.totalQuantity : 0,
  );
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    const totalQuantity =
      cart && "totalQuantity" in cart ? cart.totalQuantity : 0;

    // Open cart when quantity increases
    if (totalQuantity > (quantityRef.current ?? 0)) {
      setIsOpen(true);
    }

    quantityRef.current = totalQuantity;
  }, [cart]);

  return (
    <>
      <button type="button" aria-label="Open cart" onClick={openCart}>
        <OpenCart
          quantity={
            cart && "totalQuantity" in cart ? cart.totalQuantity : undefined
          }
        />
      </button>

      <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
        <SheetContent
          side="right"
          showCloseButton={false}
          overlayClassName="fixed inset-0 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all ease-in-out duration-300 data-[state=open]:backdrop-blur-[.5px] data-[state=closed]:backdrop-blur-none"
          className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-0 text-black backdrop-blur-xl dark:border-neutral-700 dark:bg-black/80 dark:text-white md:w-[390px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right transition-all ease-in-out duration-300 gap-0 shadow-none z-50 sm:max-w-none"
        >
          <div className="flex items-center justify-between p-6 pb-0">
            <SheetTitle className="text-lg font-semibold">My Cart</SheetTitle>
            <SheetDescription className="sr-only">
              Review and manage items in your shopping cart
            </SheetDescription>
            <SheetClose asChild>
              <button type="button" aria-label="Close cart">
                <CloseCart />
              </button>
            </SheetClose>
          </div>

          {!cart || !("id" in cart) || cart.lines.length === 0 ? (
            <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden px-6">
              <ShoppingCart className="h-16 w-16" />
              <p className="mt-6 text-center text-2xl font-bold">
                Your cart is empty.
              </p>
            </div>
          ) : cart && "id" in cart ? (
            <div className="flex h-full flex-col justify-between overflow-hidden p-6 pt-1">
              <ul className="grow overflow-auto py-4">
                {cart.lines.map((item) => {
                  return (
                    <CartItem
                      cart={cart}
                      key={item.id}
                      item={item}
                      closeCart={closeCart}
                    />
                  );
                })}
              </ul>
              <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                  <p>Taxes</p>
                  <Price
                    className="text-right text-base text-black dark:text-white"
                    amount={cart.totalWithTax - cart.total}
                    currencyCode={cart.currencyCode}
                  />
                </div>
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                  <p>Shipping</p>
                  <p className="text-right">Calculated at checkout</p>
                </div>
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                  <p>Total</p>
                  <Price
                    className="text-right text-base text-black dark:text-white"
                    amount={cart.totalWithTax}
                    currencyCode={cart.currencyCode}
                  />
                </div>
              </div>
              <CheckoutButton />
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function CheckoutButton() {
  const checkoutSteps = getCheckoutSteps();

  return (
    <Link
      to="/checkout/$step"
      params={{ step: checkoutSteps.at(0)?.identifier ?? "addresses" }}
      className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
    >
      Proceed to Checkout
    </Link>
  );
}
