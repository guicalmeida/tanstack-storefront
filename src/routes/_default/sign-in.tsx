import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { SignInForm } from "@/components/custom/account/sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createBasicMeta } from "@/lib/metadata";

const signInSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_default/sign-in")({
  validateSearch: signInSearchSchema,
  head: () => ({
    meta: createBasicMeta(
      "Sign In",
      "Sign in to your account to access your orders, saved items, and account settings.",
      true, // private page
    ),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.user) {
      throw redirect({ to: search.redirect || "/account" });
    }
  },
  component: SignInComponent,
});

function SignInComponent() {
  return (
    <section className="mt-24 flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-center text-sm text-neutral-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
