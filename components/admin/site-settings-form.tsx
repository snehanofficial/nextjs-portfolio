"use client";

import { useActionState } from "react";

import { updateSiteSettingsAction } from "@/app/(admin)/admin/_actions/content";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emptyActionState } from "@/lib/validation/common";

type SettingsRecord = {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string | null;
  heroTitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutBody: string;
  contactEmail: string;
  contactLocation: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  xUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
};

export function SiteSettingsForm({ settings }: { settings: SettingsRecord }) {
  const [state, action] = useActionState(updateSiteSettingsAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4 rounded-[1.75rem] border border-neutral-200 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue={settings.siteTitle} label="Site title" name="siteTitle" />
        <Input defaultValue={settings.siteUrl ?? ""} label="Site URL" name="siteUrl" />
      </div>
      <Textarea defaultValue={settings.siteDescription} label="Site description" name="siteDescription" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue={settings.heroTitle} label="Hero title" name="heroTitle" />
        <Input defaultValue={settings.aboutTitle} label="About title" name="aboutTitle" />
      </div>
      <Textarea defaultValue={settings.heroDescription} label="Hero description" name="heroDescription" />
      <Textarea defaultValue={settings.aboutBody} label="About body" name="aboutBody" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue={settings.contactEmail} label="Contact email" name="contactEmail" type="email" />
        <Input defaultValue={settings.contactLocation ?? ""} label="Location" name="contactLocation" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input defaultValue={settings.githubUrl ?? ""} label="GitHub URL" name="githubUrl" />
        <Input defaultValue={settings.linkedinUrl ?? ""} label="LinkedIn URL" name="linkedinUrl" />
        <Input defaultValue={settings.xUrl ?? ""} label="X URL" name="xUrl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue={settings.seoTitle ?? ""} label="SEO title" name="seoTitle" />
        <Input defaultValue={settings.seoKeywords.join(", ")} label="SEO keywords" name="seoKeywords" />
      </div>
      <Textarea defaultValue={settings.seoDescription ?? ""} label="SEO description" name="seoDescription" />
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Saving settings...">Save settings</SubmitButton>
    </form>
  );
}
