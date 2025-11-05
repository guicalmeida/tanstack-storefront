import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/components/custom/account/sign-in-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createBasicMeta } from "@/lib/metadata";

export const Route = createFileRoute("/_default/sign-in")({
  head: () => ({
    meta: createBasicMeta(
      "Sign In",
      "Sign in to your account to access your orders, saved items, and account settings.",
      true, // private page
    ),
  }),
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
          <Alert variant="default" className="mb-2">
            <AlertTitle>Test Credentials</AlertTitle>
            <AlertDescription>
              <div>
                <strong>E-Mail: </strong> test@vendure.io
                <br />
                <strong>Password: </strong> test
              </div>
            </AlertDescription>
          </Alert>
          <SignInForm />
        </CardContent>
        <CardFooter>
          {/*<Link
            className="text-center text-neutral-500 underline"
            to="/forgot-password"
          >
            Forgot your password?
          </Link>*/}
        </CardFooter>
      </Card>
    </section>
  );
}
