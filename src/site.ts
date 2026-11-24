/** サイトの表示名。ヘッダーとページのタイトルに使う（URL の /astro-field/ とは別） */
export const SITE_NAME = 'worldwidesuperkanioka';

/** 説明文を指定しないページで使う、サイト全体の説明 */
export const SITE_DESCRIPTION = 'スーパーカミオカンデのリアルタイムモニターと、身内向けのマイクラサーバーの案内。';

/** ページのタイトル: 「ページ名 — サイト名」。ページ名が無ければサイト名だけ */
export const pageTitle = (page?: string) => (page ? `${page} — ${SITE_NAME}` : SITE_NAME);
