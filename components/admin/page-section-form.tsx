"use client";

import { useActionState } from "react";

import { upsertSectionAction } from "@/app/(admin)/admin/_actions/content";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emptyActionState } from "@/lib/validation/common";

type SectionRecord = {
  id: string;
  sectionKey: string;
  title: string;
  content: { body?: string; ctaLabel?: string; ctaHref?: string } | null;
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED";
};

export function PageSectionForm({ section }: { section?: SectionRecord }) {
  const [state, action] = useActionState(upsertSectionAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4 rounded-[1.75rem] border border-neutral-200 p-5">
      <input name="id" type="hidden" value={section?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue={section?.sectionKey} label="Section key" name="sectionKey" />
        <Input defaultValue={section?.title} label="Title" name="title" />
      </div>
      <Textarea
        defaultValue={section?.content?.body ?? ""}
        label="Body"
        name="body"
        placeholder="Section content"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input defaultValue={section?.content?.ctaLabel ?? ""} label="CTA label" name="ctaLabel" />
        <Input defaultValue={section?.content?.ctaHref ?? ""} label="CTA URL" name="ctaHref" />
        <Input defaultValue={section?.sortOrder ?? 0} label="Sort order" name="sortOrder" type="number" />
      </div>
      <label className="grid gap-2 text-sm font-medium text-neutral-700">
        <span>Status</span>
        <select
          className="h-11 rounded-2xl border border-neutral-200 bg-white px-4 text-sm"
          defaultValue={section?.status ?? "DRAFT"}
          name="status"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </label>
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Saving section...">
        {section ? "Update section" : "Create section"}
      </SubmitButton>
    </form>
  );
}
