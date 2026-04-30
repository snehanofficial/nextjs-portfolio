"use client";

import { useActionState } from "react";

import { upsertSkillAction } from "@/app/(admin)/admin/_actions/skills";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { emptyActionState } from "@/lib/validation/common";

type SkillRecord = {
  id: string;
  name: string;
  slug: string;
  category: string;
  proficiency: string | null;
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED";
};

export function SkillForm({ skill }: { skill?: SkillRecord }) {
  const [state, action] = useActionState(upsertSkillAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4 rounded-[1.75rem] border border-neutral-200 p-5">
      <input name="id" type="hidden" value={skill?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue={skill?.name} error={state.fieldErrors?.name?.[0]} label="Name" name="name" />
        <Input defaultValue={skill?.slug} error={state.fieldErrors?.slug?.[0]} label="Slug" name="slug" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          defaultValue={skill?.category}
          error={state.fieldErrors?.category?.[0]}
          label="Category"
          name="category"
        />
        <Input defaultValue={skill?.proficiency ?? ""} label="Proficiency" name="proficiency" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input defaultValue={skill?.sortOrder ?? 0} label="Sort order" name="sortOrder" type="number" />
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          <span>Status</span>
          <select
            className="h-11 rounded-2xl border border-neutral-200 bg-white px-4 text-sm"
            defaultValue={skill?.status ?? "DRAFT"}
            name="status"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>
        <Input label="Logo" name="logoFile" type="file" />
      </div>
      <Input label="Logo alt text" name="altText" />
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Saving skill...">
        {skill ? "Update skill" : "Create skill"}
      </SubmitButton>
    </form>
  );
}
