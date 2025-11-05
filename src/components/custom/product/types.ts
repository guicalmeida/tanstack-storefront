import type { ResultOf } from "gql.tada";
import type { getProductQuery } from "@/lib/vendure/queries/product";

export type VendureProductType = ResultOf<typeof getProductQuery>["product"];
