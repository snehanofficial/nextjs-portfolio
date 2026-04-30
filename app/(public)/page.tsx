import Link from "next/link";
import { ArrowRight, FileDown, Mail } from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getHomePageData } from "@/lib/dal/public";

export default async function HomePage() {
  const { settings, projects, resume, sections, skills } = await getHomePageData();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 sm:px-10">
      <section className="grid gap-6 rounded-[2.5rem] bg-neutral-950 px-8 py-12 text-white shadow-xl">
        <Badge tone="warning">Developer portfolio platform</Badge>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div className="grid gap-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              {settings.heroTitle}
            </h1>
            <p className="max-w-2xl text-base text-neutral-300 sm:text-lg">
              {settings.heroDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/projects">
                <Button>
                  Explore projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#contact">
                <Button variant="secondary">Start a conversation</Button>
              </Link>
            </div>
          </div>
          <Card className="bg-white/10 text-white backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-300">About</p>
            <h2 className="mt-3 text-2xl font-semibold">{settings.aboutTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-neutral-200">{settings.aboutBody}</p>
            {resume?.asset ? (
              <a
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white"
                href={resume.asset.url}
                rel="noreferrer"
                target="_blank"
              >
                <FileDown className="h-4 w-4" />
                Download resume
              </a>
            ) : null}
          </Card>
        </div>
      </section>

      <section className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Featured work</p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-950">Selected projects</h2>
          </div>
          <Link className="text-sm font-medium text-neutral-700" href="/projects">
            View all
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="grid gap-4">
              <Badge tone="success">{project.status}</Badge>
              <div className="grid gap-2">
                <h3 className="text-xl font-semibold text-neutral-950">{project.title}</h3>
                <p className="text-sm leading-7 text-neutral-600">{project.summary}</p>
              </div>
              <Link className="text-sm font-medium text-neutral-900" href={`/projects/${project.slug}`}>
                Read project
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="grid gap-4">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Skills</p>
          <h2 className="text-3xl font-semibold text-neutral-950">Capabilities</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </Card>
        <div className="grid gap-5">
          {sections.map((section) => {
            const content = (section.content ?? {}) as {
              body?: string;
              ctaLabel?: string;
              ctaHref?: string;
            };

            return (
              <Card key={section.id}>
                <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                  {section.sectionKey}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-neutral-950">{section.title}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600">{content.body}</p>
                {content.ctaHref && content.ctaLabel ? (
                  <a className="mt-4 inline-flex text-sm font-medium text-neutral-950" href={content.ctaHref}>
                    {content.ctaLabel}
                  </a>
                ) : null}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 rounded-[2.5rem] border border-neutral-200 bg-white p-8" id="contact">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-neutral-500" />
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">Contact</p>
            <h2 className="text-3xl font-semibold text-neutral-950">Let’s build together</h2>
          </div>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
