// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeMermaid from 'rehype-mermaid';

// Playwright ships no Chromium build for Ubuntu 20.04, so local builds drive
// the system Chrome. CI leaves this unset and uses Playwright's own download.
const chromeChannel = process.env.MERMAID_CHROME_CHANNEL;

// https://astro.build/config
export default defineConfig({
  site: 'https://matthewtowles.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    // Shiki highlights fenced blocks before our rehype plugins see them, which
    // would turn a mermaid fence into markup instead of a diagram.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    // Highlighting is driven by CSS variables so code blocks sit on the site
    // palette and follow the theme, rather than carrying their own colors.
    shikiConfig: { theme: 'css-variables' },
    // Satteri, the default processor, does not run rehype plugins, and Mermaid
    // renders as one.
    processor: unified({
      // Smart punctuation turns "--" into dashes. Off, so the source is what ships.
      smartypants: false,
      rehypePlugins: [
        [
          rehypeMermaid,
          {
            strategy: 'inline-svg',
            // Labels as SVG text rather than embedded HTML, so the stylesheet
            // can recolor them per theme.
            mermaidConfig: {
              theme: 'neutral',
              flowchart: { htmlLabels: false, curve: 'basis' },
            },
            ...(chromeChannel ? { launchOptions: { channel: chromeChannel } } : {}),
          },
        ],
      ],
    }),
  },
});
