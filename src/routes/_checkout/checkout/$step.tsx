import { checkoutSteps } from "@/lib/vendure/checkout";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createBasicMeta } from "@/lib/metadata";

export const Route = createFileRoute("/_checkout/checkout/$step")({
  beforeLoad: ({ params }) => {
    const thisStep = checkoutSteps.find((cs) => cs.identifier === params.step);

    if (!thisStep) {
      throw redirect({ to: "/" });
    }
  },
  loader: ({ params }) => {
    return { stepIdentifier: params.step };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.stepIdentifier) return {};

    const stepIdentifier = loaderData.stepIdentifier;
    const thisStep = checkoutSteps.find(
      (cs) => cs.identifier === stepIdentifier,
    );

    const stepName = thisStep?.title || "Checkout";
    const title = `${stepName} - Checkout`;
    const description = `Complete your purchase. ${stepName} step of our secure checkout process.`;

    return {
      meta: createBasicMeta(title, description, true),
    };
  },
  component: CheckoutStepComponent,
});

function CheckoutStepComponent() {
  const { stepIdentifier } = Route.useLoaderData();
  const thisStep = checkoutSteps.find((cs) => cs.identifier === stepIdentifier);

  return thisStep?.component;
}
