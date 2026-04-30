"use client";

import { useActionState } from "react";

import { replaceResumeAction } from "@/app/(admin)/admin/_actions/resume";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { emptyActionState } from "@/lib/validation/common";

export function ResumeForm({
  currentVersion,
}: {
  currentVersion?: string;
}) {
  const [state, action] = useActionState(replaceResumeAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4 rounded-[1.75rem] border border-neutral-200 p-5">
      <Input defaultValue={currentVersion ?? ""} label="Version label" name="version" />
      <Input label="Resume PDF" name="resumeFile" type="file" />
      <Input label="Resume alt text" name="altText" placeholder="Senior full-stack engineer resume" />
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Uploading resume...">Replace resume</SubmitButton>
    </form>
  );
}
