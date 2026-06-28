# Kubernetes / Docker知識

コンテナイメージと Kubernetes デプロイのパターン。`backend` と `reliability-slo`、`incident-response` 知識と併用する。

## イメージ

| 基準 | 判定 |
|------|------|
| `:latest` ベースタグでビルド | REJECT（バージョンを固定） |
| root ユーザーでコンテナを実行 | REJECT（非 root ユーザー） |
| イメージ / Dockerfile に秘密情報を焼き込む | REJECT |
| マルチステージビルドなし。本番にビルドツールを同梱 | 警告（肥大、攻撃面拡大） |
| `.dockerignore` なし（`node_modules`、`.git` がコンテキストに含まれる） | 警告 |

- ベースイメージのバージョンを固定し、マルチステージでビルドし、非 root で実行し、イメージを最小化する。
- 秘密情報は実行時（env/secret マウント）で渡し、焼き込まない。

## Kubernetes ワークロード

| 基準 | 判定 |
|------|------|
| リソース `requests`/`limits` なし | REJECT（noisy-neighbor、OOM、eviction） |
| liveness/readiness プローブなし | REJECT |
| `SIGTERM` 未処理 / graceful shutdown なし | REJECT（ロールアウト時にリクエスト喪失） |
| 平文 ConfigMap / コミット済みマニフェストの秘密情報 | REJECT（Secrets / 外部 secret store を使う） |
| イメージ再ビルドが必要な mutable 設定 | ConfigMap/env を使う |

- requests/limits、liveness + readiness プローブを設定し、`SIGTERM` で graceful shutdown する。
- Pod はステートレスで水平スケール可能にし、状態は外部化する。

## 信頼性とアンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| デプロイで `latest` イメージタグ | 再現不能なロールアウト |
| ステートレスサービスが 1 レプリカ | ロールアウト/障害時に可用性なし |
| ローカル Pod ディスクに状態保存 | 再スケジュールで喪失（PV/外部を使う） |
| readiness == liveness（同一チェック） | 再起動嵐とトラフィックゲートの混同 |
| ロールアウト戦略 / PodDisruptionBudget なし | 更新時のダウンタイム |
