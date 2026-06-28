Focus on reviewing **data design and data-flow correctness**.

Procedure:
1. Data 関連の Knowledge Source path を Read tool で開き、全文を取得する。
2. それぞれの `##` section をすべて列挙する（都合の良い抜き出しをしない）。
3. 列挙した各 section の基準を diff 内の schema、queries、events、migrations、test coverage に対応づけて、問題を検出する。

## Step-Specific Notes

- schema invariant、nullability、uniqueness、deletion semantics、migration compatibility を確認する。
- index と query の選択は intuition ではなく実 access pattern に照らして見る。
- event-driven 変更では idempotency、ordering assumption、replay / rebuild path、projection lag handling を確認する。
