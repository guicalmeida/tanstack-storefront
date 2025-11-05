import clsx from "clsx";
import type { FragmentOf } from "gql.tada";
import { readFragment } from "@/gql/graphql";
import {
  productOptionGroupFragment,
  variantFragment,
} from "@/lib/vendure/fragments/product";
import { useProduct } from "./product-context";

interface VariantSelectorProps {
  optionGroups: Array<FragmentOf<typeof productOptionGroupFragment>>;
  variants: Array<FragmentOf<typeof variantFragment>>;
}

export function VariantSelector({
  optionGroups,
  variants,
}: VariantSelectorProps) {
  const { state, updateOption } = useProduct();

  const processedOptionGroups = optionGroups.map((groupFrag) =>
    readFragment(productOptionGroupFragment, groupFrag),
  );

  const processedVariants = variants.map((variantFrag) =>
    readFragment(variantFragment, variantFrag),
  );

  // Don't render if no options or only one option
  const hasNoOptionsOrJustOneOption =
    !processedOptionGroups.length ||
    (processedOptionGroups.length === 1 &&
      processedOptionGroups[0]?.options.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  // Create combinations for availability checking
  const combinations = processedVariants.map((variant) => ({
    id: variant.id,
    availableForSale: true, // TODO: Check actual stock level
    options: variant.options.reduce(
      (acc, option) => {
        acc[option.group.code] = option.code;
        return acc;
      },
      {} as Record<string, string>,
    ),
  }));

  return (
    <div className="space-y-8">
      {processedOptionGroups.map((optionGroup) => (
        <div key={optionGroup.id}>
          <dl className="mb-8">
            <dt className="mb-4 text-sm tracking-wide uppercase">
              {optionGroup.name}
            </dt>
            <dd className="flex flex-wrap gap-3">
              {optionGroup.options.map((option) => {
                // Check if this option would be available with current selections
                const potentialSelection = {
                  ...state,
                  [optionGroup.code]: option.code,
                };
                // Remove image from selection check
                delete potentialSelection.image;

                const isAvailableForSale = combinations.some((combination) =>
                  Object.entries(potentialSelection).every(
                    ([key, value]) => combination.options[key] === value,
                  ),
                );

                const isSelected = state[optionGroup.code] === option.code;

                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => updateOption(optionGroup.code, option.code)}
                    disabled={!isAvailableForSale}
                    aria-pressed={isSelected}
                    title={`${optionGroup.name}: ${option.name}${
                      !isAvailableForSale ? " (Out of Stock)" : ""
                    }`}
                    className={clsx(
                      "flex min-w-12 items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900",
                      {
                        // Selected state
                        "cursor-default ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-950":
                          isSelected,
                        // Available but not selected
                        "ring-1 ring-transparent hover:ring-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950":
                          !isSelected && isAvailableForSale,
                        // Unavailable state
                        "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700":
                          !isAvailableForSale,
                      },
                    )}
                  >
                    {option.name}
                  </button>
                );
              })}
            </dd>
          </dl>
        </div>
      ))}
    </div>
  );
}
