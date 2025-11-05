import type { ResultOf } from "gql.tada";
import { createContext, type PropsWithChildren, useContext } from "react";
import type activeChannelFragment from "@/lib/vendure/fragments/active-channel";

const ChannelContext = createContext<
  ResultOf<typeof activeChannelFragment> | undefined
>(undefined);

export function ChannelProvider({
  channel,
  children,
}: PropsWithChildren<{
  channel: ResultOf<typeof activeChannelFragment> | undefined;
}>) {
  return (
    <ChannelContext.Provider value={channel}>
      {children}
    </ChannelContext.Provider>
  );
}

export function useActiveChannel() {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error("useChannel must be used within a ChannelProvider");
  }
  return context;
}
