// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages (https://superkanioka.github.io/astro-field/) で配信する
  site: 'https://superkanioka.github.io',
  base: '/astro-field',
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
    },
  },
});
