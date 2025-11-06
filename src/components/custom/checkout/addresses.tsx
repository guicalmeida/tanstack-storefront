import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import {
  type CreateAddressInput,
  type CreateCustomerInput,
  getAvailableCountries,
  setCustomerForOrder,
  setOrderShippingAddress,
} from "@/lib/vendure";

const formSchema = z.object({
  // Customer info
  emailAddress: z.email("Enter a valid email address."),
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  phoneNumber: z.string(),
  title: z.string(),
  // Shipping address
  fullName: z.string().min(2, "Full name is required."),
  streetLine1: z.string().min(3, "Street address is required."),
  streetLine2: z.string(),
  company: z.string(),
  city: z.string().min(2, "City is required."),
  province: z.string(),
  postalCode: z.string().min(3, "Postal code is required."),
  countryCode: z.string().min(1, "Country is required."),
  shippingPhoneNumber: z.string(),
});

export function Addresses() {
  const router = useRouter();
  const { activeCustomer } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<
    Array<{ id: string; code: string; name: string }>
  >([]);

  // Load countries on mount
  useEffect(() => {
    getAvailableCountries().then((data) => setCountries(data));
  }, []);

  const form = useForm({
    defaultValues: {
      // Customer info
      emailAddress: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      title: "",
      // Shipping address
      fullName: "",
      streetLine1: "",
      streetLine2: "",
      company: "",
      city: "",
      province: "",
      postalCode: "",
      countryCode: countries[0]?.code || "",
      shippingPhoneNumber: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        const customerInput: CreateCustomerInput = {
          emailAddress: value.emailAddress,
          firstName: value.firstName,
          lastName: value.lastName,
          phoneNumber: value.phoneNumber || null,
          title: value.title || null,
        };

        const addressInput: CreateAddressInput = {
          fullName: value.fullName,
          streetLine1: value.streetLine1,
          streetLine2: value.streetLine2 || null,
          company: value.company || null,
          city: value.city || null,
          province: value.province || null,
          postalCode: value.postalCode || null,
          countryCode: value.countryCode,
          phoneNumber: value.shippingPhoneNumber || null,
        };

        // Set customer for order only if not already logged in
        if (!activeCustomer) {
          await setCustomerForOrder({ data: customerInput });
        }

        // Set shipping address
        await setOrderShippingAddress({ data: addressInput });

        // Invalidate router to reload active order
        await router.invalidate();

        // Navigate to shipping step
        router.navigate({
          to: "/checkout/$step",
          params: { step: "shipping" },
        });
      } catch {
        // Error handled silently
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Contact information
        </h2>
        <FieldGroup>
          <form.Field
            name="emailAddress"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="email"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <form.Field
              name="firstName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="given-name"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="lastName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="family-name"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </div>
        </FieldGroup>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Shipping information
        </h2>

        <FieldGroup>
          <form.Field
            name="fullName"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="name"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="company"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Company (optional)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="organization"
                />
              </Field>
            )}
          />

          <form.Field
            name="streetLine1"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Street address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="address-line1"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="streetLine2"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Apartment, suite, etc. (optional)
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="address-line2"
                />
              </Field>
            )}
          />

          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-4">
            <form.Field
              name="city"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>City</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="address-level2"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="province"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    State / Province (optional)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="address-level1"
                  />
                </Field>
              )}
            />

            <form.Field
              name="postalCode"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Postal code</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="postal-code"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </div>

          <form.Field
            name="countryCode"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {countries.map(
                        (country: {
                          id: string;
                          code: string;
                          name: string;
                        }) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="shippingPhoneNumber"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Phone number (optional)
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="tel"
                />
                <FieldDescription>
                  For delivery notifications and updates
                </FieldDescription>
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting || isLoading}
            onClick={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="w-full flex items-center justify-center space-x-2"
          >
            <Lock className="h-4 w-4" />
            <span>
              {isSubmitting || isLoading
                ? "Processing..."
                : "Continue to shipping"}
            </span>
          </Button>
        )}
      </form.Subscribe>
    </div>
  );
}
