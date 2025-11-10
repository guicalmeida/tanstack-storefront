import { CustomerSettingsForm } from "@/components/custom/account/customer-settings-form";
import { useAuth } from "@/hooks/use-auth";
import { createFileRoute } from "@tanstack/react-router";
import { createBasicMeta } from "@/lib/metadata";

export const Route = createFileRoute("/_account/account/settings")({
  head: () => ({
    meta: createBasicMeta(
      "Account Settings",
      "Manage your account settings. Update your personal information, contact details, and account preferences.",
      true,
    ),
  }),
  component: AccountSettingsComponent,
});

function AccountSettingsComponent() {
  const { activeCustomer } = useAuth();
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Update your personal information and account preferences.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Personal Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Update your personal details below.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <CustomerSettingsForm customer={activeCustomer} />
        </div>
      </div>
    </div>
  );
}
