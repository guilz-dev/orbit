# 信頼性ポリシー

runtime reliability と operational safety に対する REJECT / APPROVE 基準。reviewer は**ここに書かれたものだけ**を強制する。

## Applicability

user-facing availability / latency、background processing、deployment safety、failure 下の data consistency、operational recovery に影響する変更に適用する。

## Judgment Criteria

| Criteria | Verdict |
|----------|---------|
| 新しい critical dependency / path に explicit timeout または failure behavior がない | REJECT |
| non-idempotent work に dedupe / compensation なしで retry を追加する | REJECT |
| risky release / migration に rollback、roll-forward、compatibility story がない | REJECT |
| shared resource を過負荷にしうる変更に backpressure、limit、queueing strategy がない | REJECT |
| critical path 変更に monitoring / alerting / verification signal がない | REJECT |
| failure 時に data corruption や partial state を起こしうるのに recovery procedure がない | REJECT |
| reliability-sensitive behavior change に regression test または verification evidence がない | REJECT |
| requirement を超える observability や safer degradation の追加 | OK |

## Review Procedure

1. 関連する Knowledge source を全文開く。
2. それらの Knowledge とこの Policy の `##` section をすべて列挙する。
3. 各 section を diff、runtime path、release / rollback story に対応づける。
4. REJECT 条件が 1 つもなければ APPROVE する。
