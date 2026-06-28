# セキュリティポリシー

セキュリティ変更に対する REJECT / APPROVE 基準。reviewer は**ここに書かれたものだけ**を強制する。

## Applicability

認証、認可、secrets、network / file / process 境界、dependency supply chain、sensitive data handling に触れる変更に適用する。

## Judgment Criteria

| Criteria | Verdict |
|----------|---------|
| 新しく露出した sensitive action / resource path に authorization check がない | REJECT |
| user-controlled input が SQL、shell、file path、template、HTML 実行 sink に unsafe に届く | REJECT |
| secrets、tokens、signing keys、sensitive headers が hardcode、commit、log される | REJECT |
| trust / provenance review なしに新 dependency、build hook、base image が導入される | REJECT |
| error message、exports、過剰に広い admin path から sensitive data が露出する | REJECT |
| 明示 rationale と compensating control なしに security default が弱くなる | REJECT |
| security-sensitive path の変更に regression test または verification evidence がない | REJECT |
| spec を超える defense-in-depth 追加 | OK |

## Review Procedure

1. 関連する Knowledge source を全文開く。
2. それらの Knowledge とこの Policy の `##` section をすべて列挙する。
3. 各 section を diff、data flow、trust boundary に対応づける。
4. REJECT 条件が 1 つもなければ APPROVE する。
