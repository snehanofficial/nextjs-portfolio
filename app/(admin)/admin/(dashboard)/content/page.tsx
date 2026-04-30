import { deleteSectionAction } from "@/app/(admin)/admin/_actions/content";
import { PageSectionForm } from "@/components/admin/page-section-form";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminContent } from "@/lib/dal/admin";

export default async function AdminContentPage() {
  const { settings, sections } = await getAdminContent();

  return (
    <div className="grid gap-6">
      <Card>
        <h2 className="text-2xl font-semibold text-neutral-950">Site settings</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Control hero copy, social links, SEO defaults, and contact information.
        </p>
        <div className="mt-6">
          <SiteSettingsForm settings={settings} />
        </div>
      </Card>
      <Card>
        <h2 className="text-2xl font-semibold text-neutral-950">Create page section</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Add CMS-style homepage sections stored as structured JSON content.
        </p>
        <div className="mt-6">
          <PageSectionForm />
        </div>
      </Card>
      <div className="grid gap-5">
        {sections.map((section) => (
          <Card key={section.id} className="grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-neutral-950">{section.title}</h3>
                <Badge tone={section.status === "PUBLISHED" ? "success" : "warning"}>
                  {section.status}
                </Badge>
              </div>
              <form action={deleteSectionAction}>
                <input name="id" type="hidden" value={section.id} />
                <Button type="submit" variant="danger">
                  Delete
                </Button>
              </form>
            </div>
            <PageSectionForm
              section={{
                ...section,
                content:
                  typeof section.content === "object" && section.content
                    ? (section.content as { body?: string; ctaLabel?: string; ctaHref?: string })
                    : null,
              }}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
