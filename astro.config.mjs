// @ts-check
import { defineConfig } from 'astro/config';
import subsetFonts from './integrations/subset-fonts.mjs';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages (https://superkanioka.github.io/astro-field/) で配信する
  site: 'https://superkanioka.github.io',
  base: '/astro-field',
  // ビルド後に日本語フォントを使っている文字だけに絞る（integrations/subset-fonts.mjs）
  integrations: [subsetFonts()],
});
