import { graphql } from "@/gql/graphql";
import activeChannelFragment from "../fragments/active-channel";

export const getActiveChannelQuery = graphql(
  `
  query getActiveChannel {
    activeChannel {
      ...active_channel
    }
  }
`,
  [activeChannelFragment],
);
