import { useRouter } from "@tanstack/react-router";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.navigate({ to: "/" });
  };

  const handleGoBack = () => {
    router.history.back();
  };

  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
      <h2 className="text-xl font-bold">Page Not Found</h2>
      <p className="my-2">
        Sorry, the page you are looking for doesn't exist. It might have been
        moved, deleted, or you entered the wrong URL.
      </p>
      <div className="flex flex-col gap-2 mt-4">
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
          onClick={handleGoBack}
        >
          Go Back
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
