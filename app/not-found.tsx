import Link from "next/link";

import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center px-6 py-10">
      <Card className="w-full text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-950">Page not found</h1>
        <p className="mt-3 text-sm text-neutral-600">
          The page you requested doesn’t exist or is not currently published.
        </p>
        <Link className="mt-6 inline-flex text-sm font-medium text-neutral-950" href="/">
          Return home
        </Link>
      </Card>
    </div>
  );
}
