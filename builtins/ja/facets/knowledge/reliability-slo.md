# 信頼性・SLO 知識

信頼性の議論は、「十分安定している」を測定可能なサービス目標へ落とし込むことから始まる。latency、availability、background processing、error recovery に影響する変更で使う。

## SLI / SLO / Error Budget

| 概念 | ガイダンス |
|------|------------|
| SLI | success rate、latency percentile、freshness、backlog age などユーザー意味のある指標を選ぶ |
| SLO | 数値目標と観測 window を明確に定義する |
| Error budget | 速度と安定性作業のバランスを取るための、許容される不安定さとして扱う |

- 指標は、チームが行動につなげられて初めて役に立つ。
- 内部部品だけでなく、実ユーザーフローに結びつく指標を優先する。

## 設計への含意

| 信頼性観点 | 設計ガイダンス |
|------------|----------------|
| Timeout | network / storage 依存には明示的な timeout を置く |
| Retry | idempotent、または安全に dedupe できる操作だけ retry する |
| Degradation | 可能なら全面停止より safe fallback を定義する |
| Backpressure | queue、shedding、concurrency limit で共有資源を守る |
| Observability | success / failure / saturation が見える logs, metrics, traces を足す |

## 変更管理

| 観点 | ガイダンス |
|------|------------|
| Release risk | 小さく可逆な release と monitoring checkpoint を好む |
| Migration | mixed-version rollout 中も schema / data 互換を保つ |
| On-call 負荷 | 見えない手作業を operator に押し付ける設計を避ける |
| Dependencies | 新しい coupling を入れる前に upstream/downstream の failure mode を理解する |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| 明示的な timeout / retry 方針なしに「多分落ちない」と考える | 隠れた failure amplification |
| 非 idempotent な書き込みを盲目的に retry する | 重複副作用とデータ破損 |
| 復旧完了条件がない | サービスは “up” でもユーザーフローは壊れたままになる |
| CPU / memory だけ監視して user-path signal がない | 機能停止を見逃す |
