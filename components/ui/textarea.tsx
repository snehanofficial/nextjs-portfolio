import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({
  className,
  error,
  label,
  id,
  ...props
}: TextareaProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-neutral-700">
      {label ? <span>{label}</span> : null}
      <textarea
        id={id}
        className={cn(
          "min-h-28 rounded-3xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400",
          error && "border-red-400",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
