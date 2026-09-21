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
  type: z.enum([
    'website',
    'app-store',
    'play-store',
    'npm',
    'homebrew',
    'container-registry',
    'mcp-registry',
    'docs',
  ]),
});

// Copy-pasteable install instructions, rendered inline so a CLI project does
// not send visitors to GitHub just to find out how to install it. Steps are
// optional because some platforms are a download rather than a command.
const installStep = z.object({
  label: z.string().optional(),
  command: z.string(),
});

const install = z.object({
  platform: z.string(),
  steps: z.array(installStep).default([]),
  note: z.string().optional(),
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
    install: z.array(install).default([]),
    repos: z.array(repo).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

export const collections = { projects };
