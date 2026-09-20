import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
    repo: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    storeLinks: z.array(storeLink).default([]),
    suite: reference('suites').optional(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

const suites = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/suites' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    status: z.enum(['live', 'active', 'paused', 'archived']),
    components: z.array(reference('projects')),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

export const collections = { projects, suites };
