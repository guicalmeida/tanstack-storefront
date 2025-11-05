import { useForm } from "@tanstack/react-form";
import type { ResultOf } from "gql.tada";
import { useId, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { updateCustomerAction } from "@/components/custom/account/actions";
import { LoaderButton } from "@/components/custom/loader-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { activeCustomerFragment } from "@/lib/vendure/queries/active-customer";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

interface CustomerSettingsFormProps {
  customer: ResultOf<typeof activeCustomerFragment> | null;
}

export function CustomerSettingsForm({ customer }: CustomerSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);

      try {
        const result = await updateCustomerAction({ data: value });

        if (result?.type === "success") {
          toast.success("Your information has been updated successfully!");
        } else {
          toast.error(result?.message || "Error updating profile");
        }
      } catch (_error) {
        toast.error("Error updating profile");
      } finally {
        setIsLoading(false);
      }
    },
  });
  const inputId = useId();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6 max-w-md"
    >
      <FieldGroup>
        <form.Field
          name="firstName"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="given-name"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="family-name"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id={inputId}
            name="email"
            type="email"
            value={customer?.emailAddress || ""}
            disabled
            className="bg-gray-50"
            autoComplete="email"
          />
          <p className="text-sm text-gray-500 mt-1">
            Email address cannot be changed. Please contact support if you need
            to update this.
          </p>
        </Field>
      </FieldGroup>

      <LoaderButton loading={isLoading} type="submit">
        Save Changes
      </LoaderButton>
    </form>
  );
}
