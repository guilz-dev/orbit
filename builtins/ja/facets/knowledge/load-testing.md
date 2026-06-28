# 負荷テスト知識

負荷テストは、想定・過負荷時の concurrency、throughput、data volume に対して system がどう振る舞うかを評価する。

## ワークロードモデル

| 観点 | ガイダンス |
|------|------------|
| User mix | read/write/background の比率を現実的にモデル化する |
| Traffic shape | steady state、burst、ramp、recovery を含める |
| Data scale | 実運用に近い payload size と cardinality で試す |
| SLO linkage | latency、error rate、saturation 目標に結びつける |

## 見るべきもの

| Signal | 意味 |
|--------|------|
| Latency percentile | average だけでは tail pain を隠す |
| Error rate | overload や dependency collapse を示す |
| Saturation | CPU、memory、threads、DB connections、queue depth |
| Recovery | 負荷解除後に normal へ戻れるか |

## 実験の作法

- bottleneck 診断では主変数を一度に 1 つずつ変える。
- 結果が意味を持つよう、本番に十分近い環境で行う。
- test profile、environment、limits、observed bottleneck を記録する。

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| 小さな data と理想 cache 状態だけで負荷試験する | 本番 bottleneck を見逃す |
| average latency しか報告しない | tail failure が隠れる |
| rate limit や cleanup plan なしで dependency を叩く | test 自体が環境を壊す |
| 実行前の acceptance threshold がない | 結果が行動に結びつかない |
