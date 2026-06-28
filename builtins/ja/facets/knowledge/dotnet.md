# .NET / ASP.NET Core知識

ASP.NET Core + EF Core サービスのパターン。`backend`、`api-design`、`db-schema-design`、`indexing-query-tuning` と併用する。

## 非同期と DI

| 基準 | 判定 |
|------|------|
| `async void`（イベントハンドラ以外） | REJECT |
| Task に対する `.Result` / `.Wait()`（デッドロックリスク） | REJECT |
| 非同期/EF 呼び出しへ `CancellationToken` を伝播しない | 警告 |
| scoped サービスを singleton に注入 | REJECT（captive dependency） |

- 端から端まで async: `Task` を返し、await し、`CancellationToken` を渡す。async をブロックしない。
- DI ライフタイムを尊重する。scoped/transient を singleton 内に閉じ込めない。

## EF Core とデータ

| 基準 | 判定 |
|------|------|
| ループ内クエリ / lazy loading による N+1 | `Include`/投影を使う |
| エンティティを API 出力として返す | DTO へ投影 |
| 読み取り専用データに tracking クエリ | `AsNoTracking()` を使う |
| スキーマ変更にマイグレーションがない | REJECT |

- `Select` で DTO に投影する。読み取りは `AsNoTracking()`。1 往復でバッチ化する。

## 構造とアンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| Controller 内のビジネスロジック | サービス/ハンドラへ移す |
| 例外の握りつぶし / 汎用 `catch` | 隠れた失敗 |
| 静的 mutable 状態 | 並行性バグ |
| スレッド/リクエスト間で共有する `DbContext` | スレッドセーフでない |
| エラーを 200 で返す | 適切な status code + ProblemDetails を使う |
