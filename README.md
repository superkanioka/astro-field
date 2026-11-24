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
| `npm run check` | 型チェック（`astro check`）。GitHub Actions でも公開前に実行 |
| `npm run astro ...` | Astro CLI を実行 (例: `astro add`, `astro check`) |

## ディレクトリ構成

```text
/
├── public/                     # favicon、OGP 画像（og.png）、フォントのライセンス
├── src/
│   ├── components/
│   │   ├── Header.astro        # 全ページ共通のヘッダー（サイト名とナビ）
│   │   └── SuperKCylinder.astro # イベントディスプレイを円筒に組み立てる表示
│   ├── layouts/
│   │   └── Layout.astro        # ベースレイアウト・色と書体の CSS 変数
│   ├── pages/
│   │   ├── index.astro         # トップページ（中身は空）
│   │   ├── superk.astro        # スーパーカミオカンデ リアルタイムモニター
│   │   ├── 404.astro           # ページが見つからないとき（GitHub Pages が 404.html として使う）
│   │   └── minecraft.astro     # マイクラサーバーの案内（検索エンジン除外）
│   ├── utils/url.ts            # サイト内リンクに /astro-field を付ける
│   └── site.ts                 # サイトの表示名
├── integrations/subset-fonts.mjs # ビルド後にフォントを使っている文字だけに絞る
├── .github/workflows/deploy.yml # 型チェック → ビルド → 公開（プルリクエストでは公開しない）
├── .github/dependabot.yml      # 依存パッケージと Actions の更新を月 1 回プルリクエストで知らせる
├── DESIGN.md                   # 見た目のルール
├── astro.config.mjs            # site / base（GitHub Pages 用）など
└── package.json
```

## フォントの軽量化

日本語フォント（BIZ UDPゴシック / BIZ UDゴシック）は、ビルドの最後に [integrations/subset-fonts.mjs](integrations/subset-fonts.mjs) が
「サイトで使っている文字だけ」のファイルに作り直します。元のフォントは google/fonts の固定コミットから取得し、
ハッシュを確かめてから `node_modules/.cache/subset-fonts/` にキャッシュします。取得できなかったときは警告を出し、
@fontsource の分割フォントのまま公開します。
フォントのライセンス（SIL OFL 1.1）は [public/licenses/BIZ-UD-Gothic-OFL.txt](public/licenses/BIZ-UD-Gothic-OFL.txt) として一緒に配信しています。

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
