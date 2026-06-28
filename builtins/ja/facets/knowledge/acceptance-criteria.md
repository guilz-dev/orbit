# 受け入れ条件知識

受け入れ条件は、変更が完了かつ正しいと見なせる観測可能な条件を定義する。

## 良い受け入れ条件の性質

| 性質 | ガイダンス |
|------|------------|
| Observable | reviewer / tester が証拠から pass/fail を判定できる |
| Specific | “better” や “easy” のような曖昧語は測定なしで使わない |
| Scoped | 1 つの user outcome または system behavior に結びつける |
| Edge-aware | 重要な failure、empty、permission、boundary case を含める |

## 書き方のパターン

| パターン | 用途 |
|----------|------|
| Scenario form | 振る舞い期待を “Given / When / Then” で書く |
| Rule list | 独立条件が複数ある場合 |
| Trace IDs | requirement ID や design section とリンクする |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| implementation detail だけを言い換えた条件 | user value を証明できない |
| 多数の隠れ subcase を持つ巨大 1 bullet | 検証しづらい |
| リスクの高い flow に negative / error case がない | false confidence |
| “Works as expected” | 検証不能 |
