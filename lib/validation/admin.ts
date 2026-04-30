import { z } from "zod";

import {
  leadStatusSchema,
  optionalUrlSchema,
  publishStatusSchema,
  slugSchema,
} from "@/lib/validation/common";

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Project title is required."),
  slug: slugSchema,
  summary: z.string().trim().min(10, "Add a short summary."),
  description: z.string().trim().min(20, "Add a longer description."),
  repositoryUrl: optionalUrlSchema.optional(),
  liveUrl: optionalUrlSchema.optional(),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatusSchema,
  altText: z.string().trim().max(120).optional(),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Skill name is required."),
  slug: slugSchema,
  category: z.string().trim().min(2, "Category is required."),
  proficiency: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatusSchema,
  altText: z.string().trim().max(120).optional(),
});

export const siteSettingsSchema = z.object({
  siteTitle: z.string().trim().min(2),
  siteDescription: z.string().trim().min(10),
  siteUrl: optionalUrlSchema.optional(),
  heroTitle: z.string().trim().min(2),
  heroDescription: z.string().trim().min(10),
  aboutTitle: z.string().trim().min(2),
  aboutBody: z.string().trim().min(20),
  contactEmail: z.email("Enter a valid contact email."),
  contactLocation: z.string().trim().optional(),
  githubUrl: optionalUrlSchema.optional(),
  linkedinUrl: optionalUrlSchema.optional(),
  xUrl: optionalUrlSchema.optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  seoKeywords: z.string().trim().optional(),
});

export const pageSectionSchema = z.object({
  id: z.string().optional(),
  sectionKey: slugSchema,
  title: z.string().trim().min(2),
  body: z.string().trim().min(2),
  ctaLabel: z.string().trim().optional(),
  ctaHref: optionalUrlSchema.optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: publishStatusSchema,
});

export const resumeSchema = z.object({
  version: z.string().trim().min(1, "Version label is required."),
  altText: z.string().trim().max(120).optional(),
});

export const leadStatusUpdateSchema = z.object({
  id: z.string().min(1),
  status: leadStatusSchema,
  notes: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});
