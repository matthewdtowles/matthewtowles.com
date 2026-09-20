import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const repo = z.object({
  name: z.string(),
  url: z.string().url(),
  role: z.string(),
  language: z.string().optional(),
});

const storeLink = z.object({
  platform: z.enum(['app-store', 'play-store', 'npm', 'homebrew', 'mcp-registry']),
  url: z.string().url(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    status: z.enum(['live', 'active', 'paused', 'archived']),
    role: z.string(),
    stack: z.array(z.string()),
    repos: z.array(repo).default([]),
    liveUrl: z.string().url().optional(),
    storeLinks: z.array(storeLink).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

export const collections = { projects };
