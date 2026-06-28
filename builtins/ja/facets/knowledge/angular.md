# Angular知識

モダン Angular（standalone components、signals）のパターン。`frontend` 知識と併用する。

## コンポーネントと変更検知

| 基準 | 判定 |
|------|------|
| テンプレート内の重い計算 / CD サイクルごとに呼ばれる getter | REJECT |
| `OnPush` が適する大きなツリーでデフォルト変更検知 | `OnPush` を優先 |
| 購読の解除漏れ（`takeUntilDestroyed`/`async` pipe なし） | REJECT（リーク） |
| `async` pipe / signals の代わりに手動 subscribe + 手動 DOM 更新 | 警告 |

- standalone components と `OnPush` 変更検知を優先する。
- `async` pipe または signals を使う。可能なら手動 subscribe/unsubscribe を避ける。subscribe する場合は `takeUntilDestroyed` で teardown する。

## 状態と RxJS

| 基準 | 判定 |
|------|------|
| ネストした subscribe（subscribe 内 subscribe） | REJECT（`switchMap`/`mergeMap` を使う） |
| サービスではなくコンポーネント内のビジネスロジック | サービスへ抽出 |
| store/signal 境界なしの共有 mutable 状態 | 警告 |
| Angular の型付けを無効化する `any` | REJECT |

- オペレータでストリームを合成する。`subscribe` をネストしない。
- ロジックは injectable サービスに置き、コンポーネントは描画と委譲に徹する。

## アンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| God component | テスト困難、遅い CD |
| テンプレート内ロジック | 毎サイクル再評価 |
| 開いたままの subscribe によるメモリリーク | パフォーマンス劣化 |
| 具象サービスへの密結合（DI トークン/interface なし） | テスト困難 |
