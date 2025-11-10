
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { RegisterForm } from "@/components/custom/account/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createBasicMeta } from "@/lib/metadata";

export const Route = createFileRoute("/_default/register")({
  head: () => ({
    meta: createBasicMeta(
      "Register",
      "Create a new account to access your orders, saved items, and account settings.",
      true, // private page
    ),
  }),
  beforeLoad: ({ context }) => {
    // Redirect to account if user is already logged in
    if (context.user) {
      throw redirect({ to: "/account" });
    }
  },
  component: RegisterComponent,
});

function RegisterComponent() {
  return (
    <section className="mt-24 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Register for a new account to start shopping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-center text-sm text-neutral-500">
            Already have an account?{" "}
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
