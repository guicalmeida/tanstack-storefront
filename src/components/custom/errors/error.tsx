import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

interface ErrorComponentProps {
  error: Error;
  reset?: () => void;
}

export default function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  // Log error for debugging
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  const handleRetry = () => {
    if (reset) {
      reset();
    } else {
      // Fallback to router invalidation
      router.invalidate();
    }
  };

  const handleGoHome = () => {
    router.navigate({ to: "/" });
  };

  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
      <h2 className="text-xl font-bold">Oh no!</h2>
      <p className="my-2">
        There was an issue with our storefront. This could be a temporary issue,
        please try your action again.
      </p>
      <div className="flex flex-col gap-2 mt-4">
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
          onClick={handleRetry}
        >
          Try Again
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-full border border-neutral-200 p-4 tracking-wide text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-900"
          onClick={handleGoHome}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
