import { Link, useParams } from "@tanstack/react-router";
import { getCheckoutSteps } from "@/lib/vendure/checkout";
import { cn } from "@/lib/utils";
import { Circle, CircleCheck, CircleDot } from "lucide-react";

export function CheckoutSteps() {
  const { step } = useParams({ from: "/_checkout/checkout/$step" });
  const checkoutSteps = getCheckoutSteps(step);

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-blue-300"></div>
      <div className="flex items-center justify-between">
        {checkoutSteps.map((step) => {
          return (
            <Link
              key={`step-${step.identifier}`}
              to="/checkout/$step"
              params={{ step: step.identifier }}
              className={cn({
                "z-10 flex items-center bg-neutral-50 p-4 first:ps-0 last:pe-0": true,
                "text-neutral-500": !step.active,
                "text-blue-600": step.done,
              })}
            >
              {step.done && <CircleCheck />}
              {step.active && <CircleDot />}
              {!step.active && !step.done && <Circle />}
              <span className="ml-1">{step.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
