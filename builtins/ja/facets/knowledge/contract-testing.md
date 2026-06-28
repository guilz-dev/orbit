# 契約テスト知識

契約テストは、producer と consumer が interface の構造・意味・互換進化に合意していることを検証する。

## 契約のスコープ

| Interface | 検証対象 |
|-----------|----------|
| HTTP / RPC | fields、status codes、required/optional semantics、error shape |
| Events / messages | event name、payload schema、delivery assumption、version handling |
| File / config format | required keys、defaults、parsing constraint、backward compatibility |

## 進化ルール

| 変更種別 | ガイダンス |
|----------|------------|
| Additive field | consumer が unknown field を無視できるなら通常は安全 |
| Removed / renamed field | すべての consumer を同時更新しない限り breaking |
| 同じ shape の意味変更 | downstream が旧意味を前提にしていれば breaking |
| Error contract change | caller が分岐条件に使うなら breaking とみなす |

## 良い実践

- producer output と consumer assumption の両方を検証する。
- canonical example や schema を code の近くに置く。
- mixed-version 共存があるなら rollout 前に互換性を検証する。

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| producer と consumer が自分自身にだけ合格するテスト | 共通のバグを見逃す |
| snapshot だけで semantic assertion がない | 形は同じでも意味が壊れる |
| 明示的な compatibility policy がない | routine refactor に breaking change が紛れ込む |
| contract example が実 payload から乖離する | false confidence になる |
