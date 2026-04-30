import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";

import { SignOutButton } from "@/components/admin/sign-out-button";
import { requireAdmin } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/resume", label: "Resume" },
  { href: "/admin/leads", label: "Leads" },
];

export default function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<AdminShellFallback />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-10">
        <header className="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Dashboard</p>
            <h1 className="text-2xl font-semibold text-neutral-950">
              Welcome back, {session.user.name ?? session.user.email}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <SignOutButton />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function AdminShellFallback() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-10">
        <header className="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Dashboard</p>
            <h1 className="text-2xl font-semibold text-neutral-950">
              Loading admin workspace
            </h1>
          </div>
        </header>
        <div className="h-40 rounded-[2rem] bg-white/70" />
      </div>
    </div>
  );
}
