
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { verifyAccount } from "@/components/custom/account/actions";

interface VerifyFormProps {
  token: string;
}

export function VerifyForm({ token }: VerifyFormProps) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {
      setIsVerifying(true);

      try {
        const result = await verifyAccount({
          data: {
            token,
          },
        });

        if (result?.type === "success") {
          toast.success(
            "Account verified successfully! You are now signed in.",
          );
          // Invalidate router to refresh user context from session
          await router.invalidate();
          router.navigate({ to: "/account" });
        } else {
          toast.error(result?.message || "Error verifying account");
          setIsVerifying(false);
        }
      } catch (_error) {
        toast.error("Error verifying account");
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, router]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">
          Verifying your account...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p className="text-sm text-muted-foreground">
        Verification failed. Please check the link in your email or contact
        support.
      </p>
    </div>
  );
}
