# プライバシー知識

プライバシー設計では、どの personal data を、なぜ集め、誰が見られ、どれだけ保持し、どう削除・出力できるかを扱う。

## データ最小化

| 原則 | ガイダンス |
|------|------------|
| Purpose limitation | 明示された product / operational purpose のために必要なデータだけを集める |
| Minimum necessary | 成立するなら、より低感度・より粗い粒度の形で保存する |
| Default retention | retention と deletion の挙動を最初に決める |
| Access scope | role と task need に応じて personal data access を絞る |

## データライフサイクル

| 段階 | ガイダンス |
|------|------------|
| Collection | 何を集め、どこから system に入るかを説明できるようにする |
| Storage | sensitive field を分類し、in transit / at rest の保護を行う |
| Use | 明示根拠なしに無関係な目的へ転用しない |
| Deletion | orphaned copy を残さず deletion / retention expiry を支える |
| Export | 誰がどの範囲を export できるかを監査対象にする |

## 機微データの扱い

| 観点 | ガイダンス |
|------|------------|
| Logs / analytics | aggregate や pseudonymous signal で足りるなら raw personal data を避ける |
| Testing | 本当に必要で保護される場合を除き、synthetic / anonymized data を使う |
| Third parties | 必要最小限だけ共有し、processor / vendor の責任を記録する |
| Regional rules | design に効く residency や lawful-basis 制約を明示する |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| owner 不在の “あると便利” データ収集 | privacy debt と不要な露出 |
| 無期限保持を default にする | breach 時の被害が拡大する |
| 通常 product scope より広い admin / export path | 気づかれにくいデータ過露出 |
| 実データを fixtures、screenshots、docs にコピーする | 恒久的な漏えいになる |
