import type { ResultOf } from "gql.tada";
import type React from "react";
import { Addresses } from "@/components/custom/checkout/addresses";
import { Payment } from "@/components/custom/checkout/payment";
import { Shipping } from "@/components/custom/checkout/shipping";
import type activeOrderFragment from "@/lib/vendure/fragments/active-order";

export type CheckoutStep = {
  title?: string;
  identifier: string;
  validate: (order: ResultOf<typeof activeOrderFragment>) => boolean;
  commit?: (
    order: ResultOf<typeof activeOrderFragment>,
  ) => Promise<void> | void;
  component?: React.ReactNode;
};

export const checkoutSteps: Array<CheckoutStep> = [
  {
    title: "Addresses",
    identifier: "addresses",
    validate: (order) => {
      return !!order.billingAddress && !!order.shippingAddress;
    },
    component: <Addresses />,
  },
  {
    title: "Shipping",
    identifier: "shipping",
    validate: (order) => {
      return !!order.shippingLines && order.shippingLines.length > 0;
    },
    component: <Shipping />,
  },
  {
    title: "Payment",
    identifier: "payment",
    validate: (order) => {
      return !!order.payments && order.payments.length > 0;
    },
    component: <Payment />,
  },
  {
    title: "Summary",
    identifier: "summary",
    validate: (order) => {
      return !!(
        order.billingAddress &&
        order.shippingAddress &&
        order.shippingLines?.length &&
        order.customer
      );
    },
  },
];

export function getCheckoutSteps(
  currentStep: string | undefined = undefined,
): Array<CheckoutStep & { active: boolean; done: boolean }> {
  return checkoutSteps.map((step) => {
    return {
      ...step,
      active: step.identifier === currentStep,
      done:
        checkoutSteps.findIndex((s) => s.identifier === currentStep) >
        checkoutSteps.findIndex((s) => s.identifier === step.identifier),
    };
  });
}
