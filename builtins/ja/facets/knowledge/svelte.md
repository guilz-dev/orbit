# Svelte知識

Svelte / SvelteKit のパターン。`frontend` 知識と併用する。

## リアクティビティ

| 基準 | 判定 |
|------|------|
| 再代入なしの配列/オブジェクト変更（リアクティビティなし、legacy mode） | REJECT |
| 頻繁に再実行される reactive 文内の重い処理 | 依存を絞る |
| reactive/`$derived` の代わりに別 state に派生値を格納 | REJECT |
| 派生と副作用が reactive 宣言に混在 | 派生と effect を分離 |

- リアクティビティは代入（または Svelte 5 の runes）で起動する。legacy mode では mutate ではなく再代入（`arr = [...arr, x]`）する。
- 派生値は reactive/`$derived` に保ち、effect（`$effect`）は純粋な派生と分離する。

## コンポーネントとストア

| 基準 | 判定 |
|------|------|
| 子で props を直接変更 | REJECT（イベント dispatch / bind） |
| ローカルコンポーネント状態に global writable store | ローカル状態を優先 |
| コンポーネント間で重複したロジック | store/モジュールへ抽出 |
| 自動管理されない store 購読（手動 subscribe リーク） | `$store` 自動購読を使う |

- `$store` 自動購読を使い、手動 subscribe/unsubscribe を避ける。
- 共有状態は所有関係の明確な store に置き、ローカル状態はローカルに保つ。

## SvelteKit とアンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| `load` 関数の代わりにコンポーネント内 fetch | SSR/streaming の利点を失う |
| サーバー専用秘密情報のクライアントコード漏洩 | セキュリティ（`$env/static/private` を使う） |
| すべてを担う大きな reactive ブロック | 追いにくい |
| `+error`/`+layout` 境界の無視 | 貧弱な error/loading UX |
