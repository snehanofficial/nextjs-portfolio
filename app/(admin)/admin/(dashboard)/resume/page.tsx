import { ResumeForm } from "@/components/admin/resume-form";
import { Card } from "@/components/ui/card";
import { getAdminResume } from "@/lib/dal/admin";

export default async function AdminResumePage() {
  const resume = await getAdminResume();

  return (
    <Card className="grid gap-4">
      <div className="grid gap-2">
        <h2 className="text-2xl font-semibold text-neutral-950">Resume management</h2>
        <p className="text-sm text-neutral-600">
          Replace the active PDF while keeping asset references centralized.
        </p>
      </div>
      {resume?.asset ? (
        <p className="text-sm text-neutral-700">
          Current version: <span className="font-medium">{resume.version}</span>
        </p>
      ) : (
        <p className="text-sm text-neutral-700">No resume uploaded yet.</p>
      )}
      <ResumeForm currentVersion={resume?.version} />
    </Card>
  );
}
