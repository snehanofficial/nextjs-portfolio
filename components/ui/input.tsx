import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ className, error, label, id, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-neutral-700">
      {label ? <span>{label}</span> : null}
      <input
        id={id}
        className={cn(
          "h-11 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400",
          error && "border-red-400",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
