# 結合テスト知識

結合テストは、unit test だけでは証明できない module / service 境界をまたぐ実挙動を検証する。

## 結合テストを使う場面

| 状況 | ガイダンス |
|------|------------|
| 複数 module をまたぐ data flow | leaf function だけでなく遷移全体を検証する |
| 永続化や messaging の境界 | repository / serializer / transport の実形を含める |
| 外部 adapter の契約 | edge では安定した test double を使ってよいが、統合経路は現実的に保つ |
| wiring、config、sequencing 由来の bug | 実際の協調経路で再現する |

## テスト設計

| 観点 | ガイダンス |
|------|------------|
| Scope | failure を診断できる程度に境界を絞る |
| Fixtures | 巨大共有 fixture より scenario-driven setup を選ぶ |
| Determinism | 時間、乱数、network variability を制御する |
| Assertions | business outcome と observable side effect を検証する |

## よくある失敗

| アンチパターン | 問題 |
|----------------|------|
| テスト対象の境界を mock で消してしまう | もはや integration test ではない |
| 多数の関心事を 1 本の巨大 “system test” に詰める | failure 診断が遅く難しい |
| mutable な共有 fixture を使い回す | 順序依存の flaky になる |
| error path や rollback 挙動を無視する | happy path だけの安心感になる |
