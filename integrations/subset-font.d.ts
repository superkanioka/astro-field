// subset-font には型定義が無いので、使っている形だけ宣言する
declare module 'subset-font' {
  export default function subsetFont(
    font: Buffer | Uint8Array,
    text: string,
    options?: { targetFormat?: 'sfnt' | 'woff' | 'woff2' | 'truetype'; noLayoutClosure?: boolean },
  ): Promise<Buffer>;
}
