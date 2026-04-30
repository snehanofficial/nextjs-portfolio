"use client";

import { useActionState } from "react";

import { upsertProjectAction } from "@/app/(admin)/admin/_actions/projects";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emptyActionState } from "@/lib/validation/common";

type ProjectRecord = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  repositoryUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED";
};

export function ProjectForm({
  project,
}: {
  project?: ProjectRecord;
}) {
  const [state, action] = useActionState(upsertProjectAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4 rounded-[1.75rem] border border-neutral-200 p-5">
      <input name="id" type="hidden" value={project?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          defaultValue={project?.title}
          error={state.fieldErrors?.title?.[0]}
          label="Title"
          name="title"
          placeholder="Project title"
        />
        <Input
          defaultValue={project?.slug}
          error={state.fieldErrors?.slug?.[0]}
          label="Slug"
          name="slug"
          placeholder="project-slug"
        />
      </div>
      <Textarea
        defaultValue={project?.summary}
        error={state.fieldErrors?.summary?.[0]}
        label="Summary"
        name="summary"
        placeholder="A short pitch for the project."
      />
      <Textarea
        defaultValue={project?.description}
        error={state.fieldErrors?.description?.[0]}
        label="Description"
        name="description"
        placeholder="Write the longer project description."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          defaultValue={project?.repositoryUrl ?? ""}
          error={state.fieldErrors?.repositoryUrl?.[0]}
          label="Repository URL"
          name="repositoryUrl"
          placeholder="https://github.com/..."
        />
        <Input
          defaultValue={project?.liveUrl ?? ""}
          error={state.fieldErrors?.liveUrl?.[0]}
          label="Live URL"
          name="liveUrl"
          placeholder="https://example.com"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input defaultValue={project?.sortOrder ?? 0} label="Sort order" name="sortOrder" type="number" />
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          <span>Status</span>
          <select
            className="h-11 rounded-2xl border border-neutral-200 bg-white px-4 text-sm"
            defaultValue={project?.status ?? "DRAFT"}
            name="status"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>
        <Input label="Cover image" name="coverImage" type="file" />
      </div>
      <Input
        error={state.fieldErrors?.altText?.[0]}
        label="Cover image alt text"
        name="altText"
        placeholder="Screenshot or visual description"
      />
      <label className="flex items-center gap-3 text-sm text-neutral-700">
        <input defaultChecked={project?.featured} name="featured" type="checkbox" />
        Feature on homepage
      </label>
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Saving project...">
        {project ? "Update project" : "Create project"}
      </SubmitButton>
    </form>
  );
}
