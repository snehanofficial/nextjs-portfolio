"use client";

import { useActionState } from "react";

import { updateLeadStatusAction } from "@/app/(admin)/admin/_actions/leads";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { emptyActionState } from "@/lib/validation/common";

export function LeadStatusForm({
  id,
  status,
  notes,
}: {
  id: string;
  status: "NEW" | "REVIEWED" | "ARCHIVED";
  notes: string | null;
}) {
  const [state, action] = useActionState(updateLeadStatusAction, emptyActionState);

  return (
    <form action={action} className="grid gap-3">
      <input name="id" type="hidden" value={id} />
      <label className="grid gap-2 text-sm font-medium text-neutral-700">
        <span>Status</span>
        <select
          className="h-11 rounded-2xl border border-neutral-200 bg-white px-4 text-sm"
          defaultValue={status}
          name="status"
        >
          <option value="NEW">New</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </label>
      <Textarea defaultValue={notes ?? ""} label="Notes" name="notes" />
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Updating...">Update lead</SubmitButton>
    </form>
  );
}
