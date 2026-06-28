# ADR 知識

Architecture Decision Record（ADR）は、将来の変更が「何を、なぜ、その制約下で選んだか」を追えるように durable な技術判断を残す。

## ADR を書く場面

| 状況 | ガイダンス |
|------|------------|
| architecture、dependency direction、operating model を変える判断 | ADR を書く |
| 取り消しコストが高い判断 | ADR を書く |
| 競合案を比較して 1 つに決めた | 候補と勝因を残す |
| 純粋に局所的な implementation detail | 通常は ADR ではない |

## 良い ADR の構造

| セクション | 目的 |
|------------|------|
| Context | どんな問題や圧力が判断を必要にしたか |
| Decision | 何を選んだか |
| Alternatives | 何を検討し、なぜ退けたか |
| Consequences | trade-off、follow-up work、operational impact |
| Status | Proposed / accepted / superseded |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| ADR が what だけで why がない | 将来チームが妥当性を評価できない |
| 決定要約のない巨大 design doc を ADR 代わりにする | 参照しづらい |
| status / superseded path がない | 古い判断が誤って authoritative に残る |
| trade-off を忘れた後に ADR を書く | history が fiction になる |
