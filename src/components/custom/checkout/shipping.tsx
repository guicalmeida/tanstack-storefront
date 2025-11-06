import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
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
  getEligibleShippingMethods,
  setOrderShippingMethod,
} from "@/lib/vendure";

interface ShippingMethod {
  id: string;
  name: string;
  code: string;
  description: string;
  price: number;
  priceWithTax: number;
}

const formSchema = z.object({
  shippingMethodId: z.string().min(1, "Please select a shipping method"),
});

export function Shipping() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load shipping methods on mount
    const loadShippingMethods = async () => {
      try {
        const methods = await getEligibleShippingMethods();
        setShippingMethods(methods);
      } catch {
        setError("Failed to load shipping methods");
      }
    };

    loadShippingMethods();
  }, []);

  const form = useForm({
    defaultValues: {
      shippingMethodId: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      setError(null);

      try {
        await setOrderShippingMethod({
          data: { shippingMethodId: [value.shippingMethodId] },
        });

        // Invalidate router to reload active order with shipping method
        await router.invalidate();

        // Navigate to payment step
        router.navigate({
          to: "/checkout/$step",
          params: { step: "payment" },
        });
      } catch {
        setError("Failed to set shipping method");
        setIsLoading(false);
      }
    },
  });

  // Auto-select first method if only one available
  useEffect(() => {
    if (shippingMethods.length === 1 && !form.state.values.shippingMethodId) {
      form.setFieldValue("shippingMethodId", shippingMethods[0].id);
    }
  }, [shippingMethods, form]);

  if (shippingMethods.length === 0 && !error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading shipping methods...</p>
      </div>
    );
  }

  if (error && shippingMethods.length === 0) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">{error}</p>
        <Button
          variant="outline"
          onClick={() =>
            router.navigate({
              to: "/checkout/$step",
              params: { step: "addresses" },
            })
          }
          className="mt-4"
        >
          Go back
        </Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price / 100);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Shipping method
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Select your preferred shipping method
        </p>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form.Field
          name="shippingMethodId"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                <div className="space-y-4">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start p-6 border rounded-lg cursor-pointer transition-all ${
                        field.state.value === method.id
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={method.id}
                        checked={field.state.value === method.id}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <FieldLabel className="font-medium text-gray-900 cursor-pointer">
                              {method.name}
                            </FieldLabel>
                            {method.description && (
                              <FieldDescription className="mt-1">
                                {method.description}
                              </FieldDescription>
                            )}
                          </div>
                          <span className="ml-4 font-semibold text-gray-900">
                            {formatPrice(method.priceWithTax)}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        />
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            router.navigate({
              to: "/checkout/$step",
              params: { step: "addresses" },
            })
          }
          disabled={isLoading}
        >
          Back
        </Button>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              onClick={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              disabled={!canSubmit || isSubmitting || isLoading}
              size="lg"
            >
              {isSubmitting || isLoading
                ? "Processing..."
                : "Continue to payment"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </div>
  );
}
