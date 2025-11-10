import { Loader } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type LoaderButtonProps = {
  loading?: boolean;
};

export function LoaderButton({
  loading,
  children,
  ...props
}: LoaderButtonProps & ComponentProps<typeof Button>) {
  return (
    <Button {...props} disabled={loading}>
      {loading ? <Loader className="animate-spin" /> : children}
    </Button>
  );
}
