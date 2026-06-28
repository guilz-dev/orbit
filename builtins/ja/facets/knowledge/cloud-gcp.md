# Google Cloud（GCP）知識

GCP サービスと IAM のパターン。`kubernetes-docker`、`observability`、`terraform-aws`（IaC 規律）と併用する。

## IAM とセキュリティ

| 基準 | 判定 |
|------|------|
| ワークロードに primitive role（`Owner`/`Editor`） | REJECT（最小権限） |
| 長寿命 JSON としてエクスポートされたサービスアカウント鍵 | REJECT（Workload Identity / ADC を使う） |
| Secret Manager の代わりに env/config の秘密情報 | REJECT |
| デフォルトで公開のストレージバケット / データセット | REJECT |

- サービスアカウントには最小権限の predefined/custom role を付与する。primitive role を避ける。
- ダウンロード SA 鍵の代わりに Workload Identity / Application Default Credentials を使う。秘密情報は Secret Manager に置く。

## サービスとアーキテクチャ

| 関心事 | 指針 |
|---------|----------|
| ステートレス HTTP/イベントサービス | Cloud Run（ゼロへオートスケール、同時実行） |
| 非同期/疎結合 | dead-letter topic 付き Pub/Sub |
| マネージド SQL | Cloud SQL（プライベート IP、自動バックアップ） |
| スケジュールジョブ | Cloud Scheduler + Cloud Run/Functions |

| 基準 | 判定 |
|------|------|
| Pub/Sub コンシューマに retry/dead-letter なし | REJECT |
| パブリック IP で公開された Cloud SQL | REJECT |
| オートスケール / リソース制限なし | 警告 |
| コンソール手作業のインフラ変更（IaC なし） | 警告 |

## アンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| 過剰に広い IAM | 侵害時の blast radius |
| 長寿命 SA 鍵 | 資格情報漏洩 |
| Click-ops インフラ | 再現不能、未文書化 |
| 予算/クォータアラートなし | コストの不意 |
