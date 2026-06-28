# Goバックエンド知識

慣用的な Go サービスのパターン。`backend`、`api-design`、`db-schema-design`、`indexing-query-tuning` と併用する。

## エラー

| 基準 | 判定 |
|------|------|
| 返された `error` を無視（`_ =` または未チェック） | REJECT |
| 通常/想定内エラーに `panic` | REJECT（error を返す） |
| 文脈喪失 — `fmt.Errorf("...: %w", err)` でラップしない | 警告 |
| `errors.Is`/`errors.As` の代わりに文字列比較 | REJECT |

- error を返し、`%w` でラップしてチェーンを保持し、`errors.Is/As` で検査する。
- `panic` は真に回復不能なプログラマエラーに限定する。

## 並行性と Context

| 基準 | 判定 |
|------|------|
| 停止手段のない goroutine / キャンセル時のリーク | REJECT |
| I/O 呼び出しへ `context.Context` を伝播しない | REJECT |
| 同期なしで goroutine 間の map/状態を共有 | REJECT（レース） |
| リクエスト処理の深部で `context.Background()` | リクエスト ctx を渡す |

- キャンセル/期限のため、すべての I/O に `context.Context` を通す。
- 共有状態は mutex または channel で保護する。CI では `-race` を実行する。

## 構造

| 基準 | 判定 |
|------|------|
| 利用者ではなく提供者側で interface を定義 | 利用者側の小さな interface を優先 |
| 具象型の代わりに interface を返す | 通常は具象を返し、interface を受け入れる |
| HTTP ハンドラ内のビジネスロジック | サービスへ抽出 |
| `interface{}`/`any` の乱用 | 具象/ジェネリック型を優先 |

## アンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| 長い関数での naked return | 読みにくい |
| 不要な早すぎる goroutine | 複雑化、リーク |
| グローバル mutable シングルトン | テスト困難、レース |
| `defer rows.Close()` 忘れ / リソースリーク | 接続枯渇 |
