import { useRouter } from "@tanstack/react-router";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { cartActions } from "@/components/custom/cart/actions";

export function DeleteItemButton({
  item,
}: {
  item: Pick<{ id: string }, "id">;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const merchandiseId = item.id;

  const handleRemoveItem = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await cartActions.removeItem(merchandiseId, router);
      if (!result.success) {
        setMessage(result.error || "Error removing item from cart");
      }
    } catch (_error) {
      setMessage("Error removing item from cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleRemoveItem}
        disabled={isLoading}
        aria-label="Remove cart item"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-500 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <XIcon className="mx-px h-4 w-4 text-white dark:text-black" />
      </button>
      <output aria-live="polite" className="sr-only">
        {message}
      </output>
    </div>
  );
}
