# イベント駆動データ知識

イベント駆動システムは event を fact として扱い、非同期配信、重複処理、read model lag を前提に設計する必要がある。

## コア概念

| 概念 | ガイダンス |
|------|------------|
| Fact event | consumer に何をさせたいかではなく、何が起きたかを emit する |
| Idempotency | consumer は replay と duplicate delivery に耐える必要がある |
| Ordering | aggregate 単位で順序保証があるか、ないかを明示する |
| Projection lag | read model は eventually consistent になりうる。UX と workflow で吸収する |

## 信頼性パターン

| パターン | ガイダンス |
|----------|------------|
| Outbox | data change と event publication intent を一緒に永続化する |
| Dead-letter / retry | transient failure と permanent failure を分け、poison message を見える化する |
| Versioning | field は互換的に追加し、consumer を段階進化させる |
| Rebuild | 可能なら source event から projection を replay 再構築できるようにする |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| 1 つの consumer の挙動に依存した event 設計 | 強い coupling |
| idempotency key / dedupe なしの consumer side effect | 重複実行や破損 |
| service 間の同期一貫性を前提にする | race condition と user confusion |
| projection 崩壊時の recovery path がない | 手作業修復の危機になる |
