---
title: "Astroの便利なTips"
description: "Astroを使う上で知っておくと便利なことをまとめました。"
pubDate: 2026-04-20
tags: ["astro", "tips"]
---

# Astroの便利なTips

## Content Collections

`src/content/` にMarkdownを置くだけで型安全にコンテンツ管理できます。

## 画像の最適化

`src/assets/` に置いた画像はAstroが自動で最適化してくれます。

## アイランドアーキテクチャ

`client:load` ディレクティブでインタラクティブなコンポーネントだけをハイドレートできます。

```astro
<MyCounter client:load />
```
