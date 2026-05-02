# Astro Field

Astro 6 で構築したシンプルなダークテーマのブログです。Markdown で記事を書き、静的サイトとして配信します。

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
├── public/                 # 静的アセット (favicon など)
├── src/
│   ├── components/
│   │   └── Header.astro    # 全ページ共通のサイトヘッダー
│   ├── content/
│   │   └── blog/           # ブログ記事 (Markdown)
│   ├── layouts/
│   │   ├── Layout.astro    # ベースレイアウト・デザイントークン
│   │   └── BlogPost.astro  # 記事用レイアウト
│   ├── pages/
│   │   ├── index.astro     # トップページ
│   │   └── blog/           # 記事一覧と動的ルート
│   └── content.config.ts   # Content Collections の定義
├── astro.config.mjs        # Shiki テーマなど Astro 設定
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

## デザインシステム

色・角丸・フォントは [src/layouts/Layout.astro](src/layouts/Layout.astro) のグローバル CSS 変数で一元管理しています。

| 変数 | 用途 |
| :--- | :--- |
| `--bg`, `--surface`, `--surface-hover` | 背景色 |
| `--border` | 区切り線 |
| `--text`, `--muted` | テキスト色 |
| `--accent-from`, `--accent-to` | アクセント (グラデーション) |
| `--radius` | 角丸 (12px) |
| `--font` | フォントスタック |

角丸を変えたい場合は `--radius` の値を変更すれば全コンポーネントに反映されます。

## 参考

- [Astro ドキュメント](https://docs.astro.build)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
