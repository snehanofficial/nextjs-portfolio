import type { ActionResult } from "@/lib/validation/common";

export function FormMessage({ state }: { state: ActionResult }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={
        state.status === "success"
          ? "text-sm text-emerald-700"
          : "text-sm text-red-600"
      }
    >
      {state.message}
    </p>
  );
}
