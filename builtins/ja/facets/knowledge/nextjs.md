# Next.js知識

Next.js App Router + React Server Components のパターン。`react` / `frontend` 知識と併用する。

## Server Component と Client Component

| 基準 | 判定 |
|------|------|
| 高い境界に `"use client"` を置き、ツリー全体をクライアントへ引き下げる | REJECT |
| Server Component で取得できるデータを Client Component で取得する | REJECT |
| 秘密情報 / サーバー専用キーを Client Component に import する | REJECT |
| `"use client"` なしのファイルで `useState`/`useEffect`/イベントハンドラを使う | REJECT（動作しない） |

- デフォルトは Server Component。インタラクション/状態が必要な葉だけに `"use client"` を追加する。
- Server Component でデータ取得（`async` component + `fetch`/DB 呼び出し）。プレーンなデータを下へ渡す。
- 秘密情報はサーバー側に留める。`"use client"` 境界より下で参照しない。

## レンダリングとデータ

| 関心事 | 指針 |
|---------|----------|
| 静的コンテンツ | デフォルト静的。`fetch` オプションでキャッシュ |
| 動的/リクエストごと | `cache: 'no-store'` または `dynamic = 'force-dynamic'` |
| 再検証 | 時間ベースの鮮度には `next.revalidate`（ISR） |
| ミューテーション | Server Actions または Route Handlers。影響パス/タグを revalidate |

| 基準 | 判定 |
|------|------|
| `revalidatePath`/`revalidateTag` なしのミューテーション（古い UI） | REJECT |
| 並列化できる逐次 await（`Promise.all` 可能） | 警告 |
| リクエスト時に取得可能なデータを `useEffect` でクライアント取得 | REJECT |

## ルーティングとアンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| すべてを 1 つの Client Component 配下に置く | RSC の利点を失う |
| 非同期ルートに `loading.tsx` / `error.tsx` がない | Suspense/エラー UX がない |
| Layout でページごとのデータを取得する | Layout は永続する。ページで取得する |
| Server Component を Client Component へ `import` で子として渡す | 代わりに `children` prop で渡す |
