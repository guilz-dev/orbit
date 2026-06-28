Focus on reviewing **security in depth**.

Procedure:
1. Security / Privacy 関連の Knowledge と Policy Source path を Read tool で開き、全文を取得する。
2. それぞれの `##` section をすべて列挙する（都合の良い抜き出しをしない）。
3. 列挙した各 section の基準を diff、trust boundary、data flow、build / dependency path に対応づけて、問題を検出する。

## Step-Specific Notes

- exploit path を具体化する。誰が何の input を制御し、どの asset が露出し、何の新 capability が可能になるかを明示する。
- authentication と authorization を分けて見る。“logged in” だけでは access 証明にならない。
- secrets handling、dependency / provenance change、admin / export path、privacy-sensitive data flow を明示的に確認する。
