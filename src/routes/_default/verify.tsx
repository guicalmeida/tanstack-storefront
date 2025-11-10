import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { VerifyForm } from "@/components/custom/account/verify-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createBasicMeta } from "@/lib/metadata";

const verifySearchSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const Route = createFileRoute("/_default/verify")({
  validateSearch: verifySearchSchema,
  head: () => ({
    meta: createBasicMeta(
      "Verify Account",
      "Verify your email address to activate your account.",
      true, // private page
    ),
  }),
  beforeLoad: ({ search }) => {
    // Redirect to home if no token provided
    if (!search.token) {
      throw redirect({ to: "/" });
    }
  },
  component: VerifyComponent,
});

function VerifyComponent() {
  const { token } = Route.useSearch();

  return (
    <section className="mt-24 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Account</CardTitle>
          <CardDescription>
            Complete your account verification to start shopping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyForm token={token} />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-center text-sm text-neutral-500">
            Already verified?{" "}
            <Link
              to="/sign-in"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
