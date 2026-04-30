import Link from "next/link";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <Link className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900" href="/">
            Snehan
          </Link>
          <nav className="flex items-center gap-5 text-sm text-neutral-600">
            <Link href="/projects">Projects</Link>
            <Link href="/resume">Resume</Link>
            <Link href="/#contact">Contact</Link>
            <Link href="/admin/login">Admin</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-black/5 px-6 py-8 text-center text-sm text-neutral-500 sm:px-10">
        Built with Next.js, TypeScript, Prisma, and a server-first admin workflow.
      </footer>
    </div>
  );
}
