import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { CreditCardIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  addPaymentToOrder,
  getEligiblePaymentMethods,
  transitionOrderToState,
} from "@/lib/vendure";

interface PaymentMethod {
  id: string;
  code: string;
  name: string;
  description: string;
  isEligible: boolean;
  eligibilityMessage?: string | null;
}

const formSchema = z.object({
  paymentMethodCode: z.string().min(1, "Please select a payment method"),
});

export function Payment() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load payment methods on mount
    getEligiblePaymentMethods()
      .then((methods) => {
        setPaymentMethods(methods);
      })
      .catch(() => {
        setError("Failed to load payment methods");
      });
  }, []);

  const form = useForm({
    defaultValues: {
      paymentMethodCode: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsProcessing(true);
      setError(null);

      try {
        // Transition order to ArrangingPayment state
        await transitionOrderToState({ data: { state: "ArrangingPayment" } });

        // Add payment to order
        const result = await addPaymentToOrder({
          data: {
            method: value.paymentMethodCode,
            metadata: {},
          },
        });

        // Navigate to confirmation page
        if (result.code) {
          router.navigate({
            to: "/checkout/confirmation/$code",
            params: { code: result.code },
          });
        }
      } catch {
        setError("Failed to process payment");
        setIsProcessing(false);
      }
    },
  });

  // Auto-select first eligible method
  useEffect(() => {
    if (paymentMethods.length > 0 && !form.state.values.paymentMethodCode) {
      const firstEligible = paymentMethods.find((m) => m.isEligible);
      if (firstEligible) {
        form.setFieldValue("paymentMethodCode", firstEligible.code);
      }
    }
  }, [paymentMethods, form]);

  if (paymentMethods.length === 0 && !error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading payment methods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-medium text-gray-900">Payment method</h2>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form.Field
        name="paymentMethodCode"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <FieldSet>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.code}>
                    {method.isEligible ? (
                      <label
                        className={`flex items-start p-6 border rounded-lg cursor-pointer transition-all ${
                          field.state.value === method.code
                            ? "border-primary-600 bg-primary-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value={method.code}
                          checked={field.state.value === method.code}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <FieldLabel className="font-medium text-gray-900 cursor-pointer">
                              {method.name}
                            </FieldLabel>
                            <CreditCardIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          {method.description && (
                            <FieldDescription className="mt-1">
                              {method.description}
                            </FieldDescription>
                          )}

                          {method.code === "standard-payment" && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                              <p className="text-xs text-yellow-800">
                                <strong>Demo Payment:</strong> This is a
                                demonstration payment method for testing
                                purposes only. No actual payment will be
                                processed.
                              </p>
                            </div>
                          )}
                        </div>
                      </label>
                    ) : (
                      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 opacity-60">
                        <div className="flex items-center justify-between">
                          <FieldLabel className="font-medium text-gray-700">
                            {method.name}
                          </FieldLabel>
                          <span className="text-xs text-gray-500">
                            Not available
                          </span>
                        </div>
                        {method.eligibilityMessage && (
                          <FieldDescription className="mt-1 text-gray-600">
                            {method.eligibilityMessage}
                          </FieldDescription>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
          );
        }}
      />

      <div className="border-t border-gray-200 pt-6">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              onClick={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              disabled={!canSubmit || isSubmitting || isProcessing}
              className="w-full"
              size="lg"
            >
              {isSubmitting || isProcessing ? (
                <span className="flex items-center justify-center">
                  Processing payment...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <CreditCardIcon className="mr-2 h-5 w-5" />
                  Complete payment
                </span>
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </div>
  );
}
