import type { ResultOf } from "gql.tada";
import { createContext, type ReactNode, useContext } from "react";
import type { collectionFragment } from "@/lib/vendure/queries/collection";

const CollectionContext = createContext<
  ResultOf<typeof collectionFragment> | undefined | null
>(undefined);

export function CollectionProvider({
  children,
  collection,
}: {
  children: ReactNode;
  collection: ResultOf<typeof collectionFragment> | undefined | null;
}) {
  return (
    <CollectionContext.Provider value={collection}>
      {children}
    </CollectionContext.Provider>
  );
}

export const useCollection = () => {
  const context = useContext(CollectionContext);

  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }

  return context;
};
