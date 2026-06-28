# プロダクトディスカバリー知識

product discovery は、実装を拡大する前に problem understanding を検証し、間違ったものを作るリスクを下げる。

## 問題設定

| 観点 | ガイダンス |
|------|------------|
| User segment | 誰のための変更か、誰のためではないかを特定する |
| Problem | ユーザーの痛みを観測可能な言葉で書く |
| Outcome | ユーザーと事業の両方で “良くなった状態” を定義する |
| Constraints | policy、technical、operational boundary を早めに押さえる |

## 証拠と検証

| 手法 | 用途 |
|------|------|
| Interviews / support signal | 繰り返し起きる痛みと文脈を知る |
| Prototype / spike | full build 前に安く仮説を試す |
| Metrics / funnel data | 問題が意味を持つか、誰に効くかを確かめる |
| Counter-evidence | この案が効かない理由も探す |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| problem statement なしで solution から始める | feature drift |
| target user が明示されていない | 成功条件と優先順位が曖昧になる |
| 単発の anecdote を証拠とみなす | overfitting |
| 反証を見ない | confirmation bias |
