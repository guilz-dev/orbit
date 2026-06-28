Focus on reviewing **reliability and operational safety**.

Procedure:
1. Reliability 関連の Knowledge と Policy Source path を Read tool で開き、全文を取得する。
2. それぞれの `##` section をすべて列挙する（都合の良い抜き出しをしない）。
3. 列挙した各 section の基準を diff、runtime path、release plan、rollback path に対応づけて、問題を検出する。

## Step-Specific Notes

- 新しい critical path ごとに timeout、retry、idempotency、degradation、recovery 挙動を確認する。
- schema、jobs、events、deploy sequencing が変わる場合は mixed-version、migration、rollback 互換を確認する。
- critical behavior に success / failure signal、saturation、verification checkpoint の observability が欠けていないかを見る。
