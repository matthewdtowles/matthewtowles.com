import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const repo = z.object({
  name: z.string(),
  url: z.string().url(),
  role: z.string(),
  language: z.string().optional(),
});

// Where a visitor can actually use or install the thing. Ordered as authored,
// so the most useful destination for a given project can be listed first.
const link = z.object({
  label: z.string(),
  url: z.string().url(),
  type: z.enum(['website', 'app-store', 'play-store', 'npm', 'homebrew', 'mcp-registry', 'docs']),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    status: z.enum(['live', 'active', 'paused', 'archived']),
    role: z.string(),
    stack: z.array(z.string()),
    links: z.array(link).default([]),
    repos: z.array(repo).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

export const collections = { projects };
