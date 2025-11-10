import { useRouter } from "@tanstack/react-router";
import clsx from "clsx";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { cartActions } from "@/components/custom/cart/actions";

function SubmitButton({
  type,
  isLoading,
  onClick,
}: {
  type: "plus" | "minus";
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "ease flex h-full min-w-9 max-w-9 flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed",
        {
          "ml-auto": type === "minus",
        },
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
}: {
  item: { id: string; quantity: number };
  type: "plus" | "minus";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const newQuantity = type === "plus" ? item.quantity + 1 : item.quantity - 1;

  const handleUpdateQuantity = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await cartActions.updateItemQuantity(
        item.id,
        newQuantity,
        router,
      );
      if (!result.success) {
        setMessage(result.error || "Error updating item quantity");
      }
    } catch (_error) {
      setMessage("Error updating item quantity");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <SubmitButton
        type={type}
        isLoading={isLoading}
        onClick={handleUpdateQuantity}
      />
      <output aria-live="polite" className="sr-only">
        {message}
      </output>
    </div>
  );
}
