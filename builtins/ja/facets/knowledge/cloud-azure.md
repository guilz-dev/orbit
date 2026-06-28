# Microsoft Azure知識

Azure サービスと identity のパターン。`kubernetes-docker`、`observability` と併用する。

## Identity とセキュリティ

| 基準 | 判定 |
|------|------|
| Key Vault の代わりに app settings の接続文字列 / 秘密情報 | REJECT |
| Managed Identity の代わりに長寿命サービスプリンシパル秘密 | REJECT |
| ワークロードへの過剰に広い RBAC（Owner/Contributor） | REJECT（最小権限） |
| パブリックネットワークアクセス開放の Storage/Key Vault | REJECT |

- サービスプリンシパル秘密より Managed Identity を優先する。秘密情報は Key Vault に置く。
- 最小権限 RBAC を最も狭いスコープで付与する。ネットワークアクセスを締める（Private Endpoints）。

## サービスとアーキテクチャ

| 関心事 | 指針 |
|---------|----------|
| Web/API ホスティング | App Service / Container Apps（スケールルール、ヘルスチェック） |
| 非同期/メッセージング | dead-letter キュー付き Service Bus |
| マネージド SQL | Azure SQL（プライベートエンドポイント、geo-backup） |
| Functions | Consumption/premium プラン。冪等ハンドラ |

| 基準 | 判定 |
|------|------|
| retry/dead-letter なしのメッセージングコンシューマ | REJECT |
| ヘルスプローブ / スケールルールなし | 警告 |
| ポータル経由のインフラ変更（Bicep/Terraform 等 IaC なし） | 警告 |
| diagnostic settings / ログエクスポートなし | 警告 |

## アンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| App Settings 平文の秘密情報 | 漏洩 |
| 過剰権限 RBAC | 大きな blast radius |
| ポータル click-ops | 再現不能 |
| コスト/予算アラートなし | コストの不意 |
