import { Image } from "@unpic/react";
import clsx from "clsx";
import Label from "@/components/custom/label";
import { SkeletonItem } from "@/components/custom/skeletons/base";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  skeleton = false,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  skeleton?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof Image>) {
  if (skeleton) {
    return <SkeletonItem className="aspect-square h-full w-full rounded-lg" />;
  }

  return (
    <div
      className={clsx(
        "group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black",
        {
          relative: label,
          "border-2 border-blue-600": active,
          "border-neutral-200 dark:border-neutral-800": !active,
        },
      )}
    >
      {props.src ? (
        <Image
          className={clsx("relative h-full w-full object-cover", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
