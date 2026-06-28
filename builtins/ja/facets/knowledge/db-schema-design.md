# DB スキーマ設計知識

スキーマ設計は、現在の field だけでなく、不変条件、access pattern、進化戦略を反映すべきである。

## モデリングの基本

| 観点 | ガイダンス |
|------|------------|
| Identity | 安定した primary key と明示的な uniqueness constraint を選ぶ |
| Relationships | cardinality と optionality を明示的に表現する |
| Constraints | DB が強制できる invariant は schema 側へ押し込む |
| Nullability | `NULL` を “とりあえず unknown” ではなく意図を持って使う |

## 進化と運用

| トピック | ガイダンス |
|----------|------------|
| Migrations | additive で backward-compatible な段階変更を優先する |
| Large tables | online migration、backfill、verification を計画する |
| Deletion | soft-delete、hard-delete、retention、cascade を意図的に決める |
| Auditability | history / event table が必要な変更を決める |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| business-critical uniqueness を application code だけで守る | race condition によるデータ破損 |
| `value1`, `value2` のような generic column 過多 | 意味が追えなくなる |
| validation 経路のない enum 風 string | drift と不整合状態を生む |
| 最新 app version だけを前提に schema change を設計する | version skew 下で rollout が壊れる |
