# サプライチェーンセキュリティ知識

ソフトウェアのリスクは、自分たちが書くコードだけでなく、ダウンロードする依存物やツールが代わりに実行する処理にもある。

## 依存関係と provenance 制御

| 観点 | ガイダンス |
|------|------------|
| Version pinning | lockfile と deterministic install path を使う |
| Source trust | maintained な package、既知の registry、review 済み internal mirror を優先する |
| Provenance | critical binary / image の入手元と検証方法を記録する |
| Update policy | 脆弱依存は定期 patch し、upgrade owner を明確にする |

## Build / CI の安全性

| トピック | ガイダンス |
|----------|------------|
| Build scripts | postinstall / codegen / plugin hook は executable code として扱う |
| CI secrets | untrusted pull request に高権限 credential を見せない |
| Artifact publishing | release pipeline、signing key、registry token を保護する |
| Review | dependency graph、container base image、build hook の変更は明示 review 対象にする |

## 配布と runtime

| 観点 | ガイダンス |
|------|------------|
| SBOM | 何の dependency / version を ship したか答えられるようにする |
| Image / base OS | base image は小さく、最新で、scan されているものを使う |
| Integrity | critical artifact の download では checksum / signature を検証する |
| Vendor code | vendor が必要なら local patch と upgrade path を追跡する |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| owner や patch plan なしで dependency を追加する | 脆弱性が静かに蓄積する |
| 生成された lockfile diff を盲信する | 悪意ある drift や事故を見逃す |
| 不明な source の installer script を実行する | build 時コード実行 |
| 多数の repo / 人で publish credential を共有する | compromise 時の blast radius が大きい |
