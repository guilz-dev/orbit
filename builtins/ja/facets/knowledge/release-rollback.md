# リリース・ロールバック知識

安全な出荷は運用だけでなく設計の一部である。リスクのある release には、実行前に rollback または roll-forward の筋書きが必要。

## リリース安全性

| 観点 | ガイダンス |
|------|------------|
| Blast radius | risky change は flag、dark read、partial rollout、canary で段階導入する |
| Reversibility | データ手術なしで無効化・巻き戻しできる変更を好む |
| Version skew | rollout 中は old/new instance が共存すると想定する |
| Verification | logs、metrics、dashboards、smoke path、abort threshold を checkpoint 化する |

## Rollback と Roll-forward

| 状況 | 優先 |
|------|------|
| code-only regression で不可逆副作用がない | 通常は rollback が最速 |
| 不可逆な schema / data step が既に適用済み | mitigation 付きの roll-forward の方が安全なことが多い |
| 新コードで security exposure がある | すぐ disable / rollback する |
| migration の途中 | いったん pause して互換性を評価し、rollback か compensating fix を選ぶ |

## データとスキーマ互換

| トピック | ガイダンス |
|----------|------------|
| DB schema | 一気に壊す変更ではなく expand / migrate / contract を使う |
| Event / message | 新 producer が旧 consumer を壊さないよう、まず additive change にする |
| Queue / job | deploy 境界をまたぐ in-flight work の挙動を定義する |
| Config | safe default と known-good config snapshot を保持する |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| 実手順なしに「必要なら後で rollback する」と考える | インシデント時の初動が遅れる |
| 新コード経路の検証前に破壊的 migration を入れる | 悪い状態から戻れなくなる |
| release の go/no-go owner がいない | 判断が遅く曖昧になる |
| 成功条件 / abort threshold が明文化されていない | 悪化しても出荷を続けてしまう |
