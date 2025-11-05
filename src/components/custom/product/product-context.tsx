import { useNavigate, useSearch } from "@tanstack/react-router";
import type React from "react";
import { createContext, useCallback, useContext, useMemo } from "react";

export type ProductState = Record<string, string>;

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearch({ strict: false });
  const navigate = useNavigate();

  const state = useMemo(() => {
    const current: ProductState = {};
    Object.entries(searchParams || {}).forEach(([key, value]) => {
      if (typeof value === "string") {
        current[key] = value;
      } else if (value != null) {
        current[key] = String(value);
      }
    });
    return current;
  }, [searchParams]);

  const updateOption = useCallback(
    (name: string, value: string) => {
      navigate({
        to: ".",
        search: (prev) => ({
          ...prev,
          [name]: value,
        }),
        replace: true,
      });
    },
    [navigate],
  );

  const value = useMemo<ProductContextType>(
    () => ({
      state,
      updateOption,
    }),
    [state, updateOption],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}

export function useSelectedVariant<
  T extends {
    id: string;
    options: Array<{ group: { code: string }; code: string }>;
  },
>(variants: T[]): T | undefined {
  const { state } = useProduct();

  const candidates = variants.filter((variant) =>
    variant.options.every((option) => state[option.group.code] === option.code),
  );

  if (candidates.length === 1) {
    return candidates[0];
  }

  return undefined;
}

export function useUpdateURL() {
  const navigate = useNavigate();

  return (patch: ProductState) => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        ...patch,
      }),
      replace: true,
    });
  };
}
