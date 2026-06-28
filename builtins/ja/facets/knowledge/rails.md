# Ruby on Rails知識

Rails（ActiveRecord、MVC）のパターン。`backend`、`api-design`、`sql-rdb` と併用する。

## モデルとクエリ

| 基準 | 判定 |
|------|------|
| N+1 クエリ（`includes`/`preload` なし） | REJECT |
| コントローラ内のビジネスロジック | モデル / サービスオブジェクトへ移す |
| アプリのみのバリデーション/不変条件（DB 制約なし） | DB 制約を追加 |
| save 時の副作用コールバック（メール、外部呼び出し） | サービスオブジェクトを優先 |

- skinny controller、rich model / サービスオブジェクト。コントローラはオーケストレーションのみ。
- 関連を eager load（`includes`）して N+1 を潰す。不変条件は DB 制約で裏付ける。

## セキュリティと規約

| 基準 | 判定 |
|------|------|
| strong params なしの mass assignment | REJECT |
| ユーザー入力の生 SQL 補間 | REJECT（SQL インジェクション） |
| データ準備 + ロジックを抱える fat controller | 抽出する |
| スキーマ変更でマイグレーションをスキップ | REJECT |

- strong parameters を使う。ユーザー入力を SQL に補間しない — パラメータ化クエリを使う。
- convention over configuration に従う。逸脱は記録された理由がある場合のみ。

## アンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| モデル上の callback hell | 隠れた副作用、テスト困難 |
| God model | 焦点不明、テスト困難 |
| ビュー内ロジック | ヘルパー/presenter へ移す |
| `bullet` 系 N+1 警告の無視 | パフォーマンス |
