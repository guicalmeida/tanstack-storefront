import { Link, useMatchRoute } from "@tanstack/react-router";
import { Circle, CircleCheck, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCheckoutSteps } from "@/lib/vendure/checkout";

export function CheckoutSteps() {
  const matchRoute = useMatchRoute();
  const stepMatch = matchRoute({ to: "/checkout/$step" });
  const confirmationMatch = matchRoute({ to: "/checkout/confirmation/$code" });

  // If on confirmation page, show all steps as done
  // Otherwise, use the current step from params
  const currentStep = confirmationMatch
    ? "confirmation"
    : stepMatch
      ? stepMatch.step
      : undefined;
  const checkoutSteps = getCheckoutSteps(currentStep);

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-blue-300"></div>
      <div className="flex items-center justify-between">
        {checkoutSteps.map((step) => {
          const isConfirmation = !!confirmationMatch;
          const isDone = isConfirmation || step.done;

          return (
            <Link
              key={`step-${step.identifier}`}
              to="/checkout/$step"
              params={{ step: step.identifier }}
              disabled={isConfirmation}
              className={cn({
                "z-10 flex items-center bg-neutral-50 p-4 first:ps-0 last:pe-0": true,
                "text-neutral-500": !step.active && !isConfirmation,
                "text-blue-600": isDone,
                "cursor-not-allowed": isConfirmation,
              })}
            >
              {isDone && <CircleCheck />}
              {step.active && !isConfirmation && <CircleDot />}
              {!step.active && !isDone && <Circle />}
              <span className="ml-1">{step.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
