# worldwidesuperkanioka

Astro 6 で作った個人サイトです。スーパーカミオカンデのリアルタイムモニターと、身内向けのマイクラサーバーの案内を置いています。GitHub Pages（https://superkanioka.github.io/astro-field/）で配信しています。

サイトの表示名は [src/site.ts](src/site.ts) の `SITE_NAME` で変えられます（URL の `/astro-field/` はリポジトリ名なので別）。

## 必要環境

- Node.js `>=22.12`

## セットアップ

```sh
npm install
```

## コマンド

| コマンド | 説明 |
| :--- | :--- |
| `npm run dev` | 開発サーバを `localhost:4321` で起動 |
| `npm run build` | 本番用に `./dist/` へビルド |
| `npm run preview` | ビルド結果をローカルでプレビュー |
| `npm run astro ...` | Astro CLI を実行 (例: `astro add`, `astro check`) |

## ディレクトリ構成

```text
/
├── public/                     # 静的アセット (favicon など)
├── src/
│   ├── components/
│   │   ├── Header.astro        # 全ページ共通のヘッダー（サイト名とナビ）
│   │   └── SuperKCylinder.astro # イベントディスプレイを円筒に組み立てる表示
│   ├── content/blog/           # ブログ記事 (Markdown、ナビからは外している)
│   ├── layouts/
│   │   ├── Layout.astro        # ベースレイアウト・色と書体の CSS 変数
│   │   └── BlogPost.astro      # 記事用レイアウト
│   ├── pages/
│   │   ├── index.astro         # トップページ（中身は空）
│   │   ├── superk.astro        # スーパーカミオカンデ リアルタイムモニター
│   │   ├── minecraft.astro     # マイクラサーバーの案内（検索エンジン除外）
│   │   └── blog/               # 記事一覧と動的ルート
│   ├── utils/url.ts            # サイト内リンクに /astro-field を付ける
│   ├── site.ts                 # サイトの表示名
│   └── content.config.ts       # Content Collections の定義
├── .github/workflows/deploy.yml # master への push で GitHub Pages にデプロイ
├── DESIGN.md                   # 見た目のルール
├── astro.config.mjs            # site / base（GitHub Pages 用）など
└── package.json
```

## 記事の書き方

`src/content/blog/` に Markdown ファイルを追加します。フロントマターは次の通りです。

```md
---
title: "記事タイトル"
description: "記事の概要"
pubDate: 2026-05-02
tags: ["astro", "blog"]
---

本文を h2 から書き始めます。タイトルは Layout 側で表示されるので
本文に h1 は書きません。
```

`title` / `description` / `pubDate` は必須、`tags` は任意です。スキーマは [src/content.config.ts](src/content.config.ts) で Zod により検証されます。

## デザイン

見た目のルール（色・書体・レイアウト・やらないこと）は [DESIGN.md](DESIGN.md) にまとめています。
値の実体は [src/layouts/Layout.astro](src/layouts/Layout.astro) のグローバル CSS 変数です。

| 変数 | 用途 |
| :--- | :--- |
| `--paper`, `--ink`, `--ore`, `--rule` | 地、本文、補足、弱い線 |
| `--amber`, `--amber-text` | 唯一の強調色（面・印用と文字用） |
| `--window` | 観測窓（モニター）の黒 |
| `--font`, `--font-fixed` | BIZ UDPゴシック / BIZ UDゴシック（同梱） |
| `--measure`, `--wide` | 文章の行長 / 広く見せるものの最大幅 |

## 参考

- [Astro ドキュメント](https://docs.astro.build)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
