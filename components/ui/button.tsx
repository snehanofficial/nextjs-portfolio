import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-neutral-950 text-white hover:bg-neutral-800 focus-visible:ring-neutral-950",
        variant === "secondary" &&
          "bg-neutral-200 text-neutral-950 hover:bg-neutral-300 focus-visible:ring-neutral-400",
        variant === "ghost" &&
          "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-300",
        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-600",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
