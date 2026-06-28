# RFC / 設計ドキュメント知識

RFC や design doc は、実装前に goals、architecture、trade-offs、rollout、open questions を関係者で揃えるための文書である。

## 良い RFC が含むもの

| セクション | ガイダンス |
|------------|------------|
| Problem and goals | なぜこの work が必要で、成功をどう見るか |
| Non-goals | 明示的な scope 外 |
| Proposed design | 主な architecture、flows、contracts、data shape |
| Alternatives | 本気で検討した代替案と、なぜ負けたか |
| Rollout / migration | flags、compatibility、rollback、operational checkpoint |
| Open questions | まだ証拠や判断が必要な点 |

## レビュー品質

| 観点 | ガイダンス |
|------|------------|
| Audience | author 自身ではなく、判断を下す reviewer 向けに書く |
| Traceability | 必要に応じて requirements、過去 ADR、incidents、benchmarks へリンクする |
| Decision readiness | 承認すべき選択肢を目立たせる |
| Maintenance | 提案文だけでなく outcome / final decision を残す |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| 明示的な decision point のない長文書 | reviewer が収束できない |
| 理想 architecture だけで rollout path がない | 実装リスクが高い |
| rejected alternatives がない | trade-off が隠れる |
| 承認後すぐ stale になる | チームが docs を信用しなくなる |
