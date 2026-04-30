import { LoginForm } from "@/components/forms/login-form";
import { Card } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-6 py-10">
      <Card className="w-full">
        <div className="mb-6 grid gap-2">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Admin</p>
          <h1 className="text-3xl font-semibold text-neutral-950">Sign in</h1>
          <p className="text-sm text-neutral-600">
            Use the seeded admin credentials to manage portfolio content.
          </p>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
}
