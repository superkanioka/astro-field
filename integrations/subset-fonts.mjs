// @ts-check
/**
 * ビルド後に、日本語フォントを「サイトで実際に使っている文字だけ」の 1 書体 1 ファイルに作り直す Astro インテグレーション。
 *
 * @fontsource の日本語フォントは文字範囲ごとに約 120 個のファイルに分かれていて、
 * @font-face の一覧だけで CSS が 200KB 超、初回表示で読むフォントも 400KB 超になる。
 * 分割ファイルは 1 つあたり 3.5KB ほどの固定の重さがあり、分割のまま絞っても軽くならない。
 * そこで、分割されていない元のフォント（Google Fonts の OFL 版）を取得し、使っている文字だけに絞る:
 *   1. dist の HTML / JS に出てくる文字を集める（画面に出る文言はすべてここに含まれる）
 *   2. 元フォントを google/fonts の固定コミットから取得し、git の blob ハッシュで中身を確かめる（キャッシュする）
 *   3. 書体ごとに使っている文字だけの woff2 を作り、CSS の BIZ UD 系 @font-face をそれに置き換える
 *   4. どこからも参照されなくなった @fontsource のフォントファイルを dist から消す
 * 取得に失敗したときは何も変えない（@fontsource の分割フォントのまま公開される）。
 * 開発サーバー（npm run dev）では動かない。
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

// google/fonts の固定コミット（2026-03-03）。blob は GitHub API の sha（git の blob ハッシュ）
const COMMIT = '6ce172f74aa355ea43eb964fa4a91570a4d3064d';
const ASCII = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');

/**
 * @typedef {{ family: string; weight: number; path: string; blob: string; ascii?: boolean }} Face
 * ascii: 等幅は人が打ち込む文字列（アドレス、コード）にしか使わないので、ASCII だけ残す
 */
/** @type {Face[]} */
const FACES = [
  { family: 'BIZ UDPGothic', weight: 400, path: 'ofl/bizudpgothic/BIZUDPGothic-Regular.ttf', blob: '0753da0963c2fa25c5b5990d13f51842cb34e50d' },
  { family: 'BIZ UDPGothic', weight: 700, path: 'ofl/bizudpgothic/BIZUDPGothic-Bold.ttf', blob: '8cfe34552b6106d0a686b376b8047ca562a74847' },
  { family: 'BIZ UDGothic', weight: 400, path: 'ofl/bizudgothic/BIZUDGothic-Regular.ttf', blob: 'dd215603417e88b118d9e69fc1296e50bc764d34', ascii: true },
  { family: 'BIZ UDGothic', weight: 700, path: 'ofl/bizudgothic/BIZUDGothic-Bold.ttf', blob: '6f7a113738fc4dceec0a3487e92f4d582d86d27a', ascii: true },
];

const CACHE = fileURLToPath(new URL('../node_modules/.cache/subset-fonts/', import.meta.url));

/** git の blob ハッシュ（GitHub API の sha と同じ計算） */
const gitBlobSha = (/** @type {Buffer} */ buf) =>
  createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');

/** 元フォントを取得する。キャッシュがあればそれを使い、どちらもハッシュを確かめる */
async function source(/** @type {Face} */ face) {
  const cached = join(CACHE, `${face.blob}.ttf`);
  try {
    const buf = await readFile(cached);
    if (gitBlobSha(buf) === face.blob) return buf;
  } catch {}
  const res = await fetch(`https://raw.githubusercontent.com/google/fonts/${COMMIT}/${face.path}`);
  if (!res.ok) throw new Error(`${face.path}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (gitBlobSha(buf) !== face.blob) throw new Error(`${face.path}: ハッシュが一致しません`);
  await mkdir(CACHE, { recursive: true });
  await writeFile(cached, buf);
  return buf;
}

/** @param {string} dir */
async function walk(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

/** @returns {import('astro').AstroIntegration} */
export default function subsetFonts() {
  return {
    name: 'subset-fonts',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const files = await walk(dist);

        // 1. 使っている文字（HTML と JS の全文。タグや属性の文字も混ざるが、多めに残る分には困らない）
        const used = new Set();
        for (const file of files.filter(f => /\.(html|js)$/.test(f))) {
          for (const ch of await readFile(file, 'utf8')) used.add(ch);
        }
        const text = [...used].join('');

        // フォントの @font-face を持つ CSS（Astro がまとめた 1 ファイル）
        const cssFiles = [];
        for (const file of files.filter(f => f.endsWith('.css'))) {
          const css = await readFile(file, 'utf8');
          if (/@font-face\s*\{[^}]*BIZ UD/.test(css)) cssFiles.push({ file, css });
        }
        if (cssFiles.length === 0) return;

        // 2〜3. 書体ごとに絞った woff2 を作る
        /** @type {string[]} */
        const rules = [];
        let total = 0;
        try {
          // 置き場所と URL の形は、元の @font-face が指していた場所（/astro-field/_astro/）に合わせる
          const sample = /url\(([^)]*\/_astro\/[^)]*biz-ud[^)]*\.woff2)\)/.exec(cssFiles[0].css)?.[1];
          if (!sample) throw new Error('元の @font-face の URL が見つかりません');
          const urlDir = sample.slice(0, sample.lastIndexOf('/') + 1);
          const outDir = join(dist, urlDir.slice(urlDir.indexOf('/_astro/')));

          for (const face of FACES) {
            // noLayoutClosure: 縦書き用などの置き換え先の字形まで連れてこない（横書きしか使わない。サイズが約 1/5 になる）
            const subset = await subsetFont(await source(face), face.ascii ? ASCII : text, {
              targetFormat: 'woff2',
              noLayoutClosure: true,
            });
            const hash = createHash('sha256').update(subset).digest('hex').slice(0, 8);
            const name = `${face.family.replaceAll(' ', '-').toLowerCase()}-${face.weight}.${hash}.woff2`;
            await writeFile(join(outDir, name), subset);
            total += subset.length;
            rules.push(
              `@font-face{font-family:"${face.family}";font-style:normal;font-display:swap;` +
                `font-weight:${face.weight};src:url(${urlDir}${name}) format("woff2")}`,
            );
          }
        } catch (error) {
          logger.warn(`元フォントを用意できなかったので、分割フォントのまま公開します: ${error}`);
          return;
        }

        // CSS の BIZ UD 系 @font-face を全部外し、作ったものを先頭に置く
        for (const { file, css } of cssFiles) {
          const stripped = css.replace(/@font-face\s*\{[^}]*\}/g, block => (/BIZ UD/.test(block) ? '' : block));
          await writeFile(file, rules.join('') + stripped);
        }

        // 4. @fontsource のフォントファイルを消す（もうどこからも参照されない）
        let removed = 0;
        for (const file of files) {
          if (/^biz-ud.*\.(woff2?|ttf)$/.test(basename(file))) {
            await rm(file);
            removed++;
          }
        }

        logger.info(
          `${used.size} 文字に絞った 4 書体 ${Math.round(total / 1024)}KB を作成 / @fontsource のファイル ${removed} 個を削除`,
        );
      },
    },
  };
}
