# プライバシーポリシー

privacy-sensitive な変更に対する REJECT / APPROVE 基準。reviewer は**ここに書かれたものだけ**を強制する。

## Applicability

personal data や sensitive user data の収集、保存、export、logging、analysis、access 拡大を行う変更に適用する。

## Judgment Criteria

| Criteria | Verdict |
|----------|---------|
| clear な product / operational purpose のない personal / sensitive data 収集が追加される | REJECT |
| sensitive data が logs、fixtures、docs、screenshots、test output に露出する | REJECT |
| data export、search、admin access が stated need より広くなる | REJECT |
| 新たに保存する sensitive data の retention / deletion 挙動が未定義 | REJECT |
| minimization や responsibility boundary なしに third-party sharing を追加する | REJECT |
| privacy-sensitive path 変更に必要な verification evidence / regression test がない | REJECT |
| spec を超える masking、deletion support、minimization の追加 | OK |

## Review Procedure

1. 関連する Knowledge source を全文開く。
2. それらの Knowledge とこの Policy の `##` section をすべて列挙する。
3. 各 section を diff、data lifecycle、access path に対応づける。
4. REJECT 条件が 1 つもなければ APPROVE する。
