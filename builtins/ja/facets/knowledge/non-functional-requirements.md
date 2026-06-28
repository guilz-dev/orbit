# 非機能要件知識

非機能要件（NFR）は、主要機能が変わらなくても設計を支配する quality attribute と運用制約を定義する。

## 典型的な NFR 分類

| 分類 | 例 |
|------|----|
| Performance | latency、throughput、startup、memory budget |
| Reliability | availability、durability、recovery time、backlog freshness |
| Security / Privacy | access control、data handling、auditability、retention |
| Operability | monitoring、alerting、runbooks、rollback、supportability |
| Accessibility / Usability | keyboard path、contrast、localization、comprehension |

## 良い NFR の実践

| 観点 | ガイダンス |
|------|------------|
| Measurability | 可能なら numbers、thresholds、binary obligation で書く |
| Scope | 影響 flow、platform、component に結びつける |
| Traceability | test、dashboard、review gate とリンクする |
| Trade-offs | durability 強化と latency 増加のような衝突を記録する |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| NFR が人の頭の中にしかない | 設計が間違った最適化をする |
| target のない “fast” “secure” “scalable” | レビュー不能 |
| NFR の運用 owner がいない | launch 後に抜け漏れが出る |
| 実装後にだけ NFR を足す | redesign コストが高い |
