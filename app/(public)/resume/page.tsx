import { FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getActiveResume } from "@/lib/dal/public";

export default async function ResumePage() {
  const resume = await getActiveResume();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10 sm:px-10">
      <Card className="grid gap-6">
        <div className="grid gap-3">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Resume</p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
            Download the current resume
          </h1>
        </div>
        {resume?.asset ? (
          <a href={resume.asset.url} rel="noreferrer" target="_blank">
            <Button>
              <FileDown className="mr-2 h-4 w-4" />
              Download {resume.version}
            </Button>
          </a>
        ) : (
          <p className="text-sm text-neutral-600">
            No active resume has been uploaded yet.
          </p>
        )}
      </Card>
    </div>
  );
}
