# インデックス・クエリチューニング知識

インデックス設計やチューニングは、やみくもに index を増やすことではなく、実際の access pattern から始める。

## インデックス設計

| 観点 | ガイダンス |
|------|------------|
| Query pattern | 実際の `WHERE`、join、sort、pagination 経路に合わせて index を張る |
| Selectivity | 高 selectivity の leading column が効きやすい |
| Composite order | query prefix と sort order を意図して並べる |
| Write cost | index は read を速くする一方、write と storage のコストを上げる |

## クエリレビュー

| トピック | ガイダンス |
|----------|------------|
| Explain plan | scan、filter、join strategy、sort、row estimate を確認する |
| Pagination | 大規模 dataset では安定した keyset pagination を優先する |
| Projection | 特に hot path では必要な columns だけを選ぶ |
| N+1 | ORM が生む query storm や hidden lazy load を警戒する |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| workload reasoning なしに後付けで index を増やす | index bloat と低い実効改善 |
| 巨大 table で offset pagination を使う | 遅い scan と不安定な性能 |
| 不要な型不一致や計算列に対する filter | index bypass |
| 1 回の local sample だけで tuning を決める | 本番 scale とずれた結論になる |
