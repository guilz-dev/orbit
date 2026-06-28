# Node.jsバックエンド知識

Express / NestJS サービスのパターン。`backend`、`api-design`、`sql-rdb` と併用する。汎用 backend を超える Node 固有の課題に使う。

## 非同期とエラー

| 基準 | 判定 |
|------|------|
| 未処理 promise rejection（`await`/`.catch` なし、floating promise） | REJECT |
| エラーをミドルウェアへ伝播しない async ルートハンドラ | REJECT |
| イベントループのブロック（大きなデータへの sync crypto/fs/JSON） | REJECT |
| 空の `catch` でエラーを握りつぶす | REJECT |

- promise を浮かせない。`await` するかエラーハンドリングを付ける。async エラーは中央エラーミドルウェアへ。
- イベントループを空ける: 非同期 API を使い、CPU 処理は worker threads / キューへオフロードする。

## 構造とセキュリティ

| 基準 | 判定 |
|------|------|
| コントローラ / ルートハンドラ内のビジネスロジック | サービスへ抽出 |
| バリデーションなし（zod/class-validator/Joi）でリクエスト body を信頼 | REJECT |
| env / secret store の代わりにコード内秘密情報 | REJECT |
| 公開エンドポイントに入力サイズ / レート制限なし | 警告 |

- 境界で入力を検証・型付けする。ハンドラは薄く保つ。
- エラーハンドリングと設定を集中管理する。秘密情報をハードコードしない。

## アンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| callback と promise の混在 | 制御フローが混乱 |
| リクエスト間で共有するグローバル mutable 状態 | 並行性バグ |
| モジュール深部で `process.env` を読む | 追跡不能な設定 |
| 秘密情報入りのリクエスト/DTO を丸ごとログ | データ漏洩 |
| graceful shutdown のための `SIGTERM` 未処理 | デプロイ時にリクエスト喪失 |
