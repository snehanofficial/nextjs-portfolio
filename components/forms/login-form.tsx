"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/validation/admin";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const parsed = loginSchema.safeParse({
          email: formData.get("email"),
          password: formData.get("password"),
        });

        if (!parsed.success) {
          const fieldErrors = parsed.error.flatten().fieldErrors;
          setErrors({
            email: fieldErrors.email?.[0],
            password: fieldErrors.password?.[0],
          });
          return;
        }

        setErrors({});

        startTransition(async () => {
          const result = await signIn("credentials", {
            email: parsed.data.email,
            password: parsed.data.password,
            redirect: false,
            callbackUrl: "/admin",
          });

          if (!result || result.error) {
            setMessage("Sign in failed. Check your credentials and try again.");
            return;
          }

          router.push("/admin");
          router.refresh();
        });
      }}
    >
      <Input
        error={errors.email}
        label="Email"
        name="email"
        placeholder="admin@example.com"
        type="email"
      />
      <Input
        error={errors.password}
        label="Password"
        name="password"
        placeholder="••••••••"
        type="password"
      />
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
      <Button disabled={isPending} type="submit">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
