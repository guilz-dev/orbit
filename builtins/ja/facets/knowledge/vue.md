# Vue知識

Vue 3 + Composition API のパターン。共有 UI 課題は `frontend` 知識と併用する。

## リアクティビティ

| 基準 | 判定 |
|------|------|
| `reactive()` オブジェクトを分割代入する（リアクティビティが失われる） | REJECT |
| script 内で `ref` の値を `.value` なしで使う | REJECT |
| 交差する不変条件を持つ深くネストした `reactive` 状態 | 正規化を検討 |
| 派生値を `computed` ではなく別の `ref` に格納する | REJECT |

```ts
// ❌ リアクティビティが失われる
const { count } = reactive({ count: 0 })

// ✅ reactive オブジェクトを保持するか、ref を使う
const state = reactive({ count: 0 })
const count = ref(0)
```

- 派生状態は `computed` を使う。別の `ref` に再計算結果を入れない。
- `watch` は値の変化に伴う副作用用であり、値の導出には使わない。
- プリミティブは `ref`、まとまったオブジェクト状態は `reactive` を優先する。

## コンポーネント設計

| 基準 | 判定 |
|------|------|
| 子コンポーネント内で props を直接変更する | REJECT（`emit` + `v-model` を使う） |
| テンプレート内にビジネスロジックを置く | composable へ抽出 |
| リアクティビティ/ライフサイクルを使わないのに composable を `useX` と命名 | 警告 |
| 近い 2 コンポーネント間の状態共有に `provide`/`inject` を使う | props を優先 |

- 一方向データフロー: props 下り、イベント上り。双方向は `v-model` / `defineModel`。
- 再利用可能な stateful ロジックは composable（`useX`）へ。純粋ヘルパーは関数のまま。
- 新規コンポーネントは `<script setup>` を使う。

## パフォーマンスとアンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| 安定した `:key` なしの `v-for` | 誤った DOM 再利用 |
| 同一要素に `v-if` + `v-for` | 優先順位が曖昧。分離する |
| 仮想化なしの大きなリスト | 描画コスト |
| watcher の連鎖（watch が watch を起動） | 追いにくい。`computed` を優先 |
| すべてをグローバル reactive シングルトンにする | 境界の明確な Pinia store を使う |
