# Pythonバックエンド知識

FastAPI / Django バックエンドのパターン。`backend`、`api-design`、`sql-rdb` と併用する。

## 非同期とブロッキング

| 基準 | 判定 |
|------|------|
| `async def` ハンドラ内のブロッキング I/O（同期 DB ドライバ、`requests`） | REJECT |
| イベントループ上の CPU バウンド処理 | worker / `run_in_executor` へ移す |
| 同期と非同期 DB セッションの混在 | REJECT |
| 非同期コード内の `time.sleep` | REJECT（`asyncio.sleep` を使う） |

- 非同期フレームワークでは、await する呼び出しはすべて非ブロッキング。async ドライバ（asyncpg、httpx）を端から端まで使う。
- CPU バウンド処理はタスクキュー（Celery/RQ/arq）または executor へオフロードする。

## 構造とバリデーション

| 基準 | 判定 |
|------|------|
| ルートハンドラ / ビュー内のビジネスロジック | サービス層へ抽出 |
| スキーマ（Pydantic / serializer）なしでリクエストデータを信頼 | REJECT |
| ORM モデルを API 出力として直接返す | レスポンススキーマ/DTO を使う |
| 横断関心を抱えた fat model | 責務を分割 |

- 境界で Pydantic モデル / DRF serializer により入力を検証する。生の dict を信頼しない。
- ハンドラは薄く保つ: 解析 → サービス呼び出し → レスポンススキーマへマップ。

## データと設定

| 基準 | 判定 |
|------|------|
| ループ内 ORM クエリ（N+1） | `select_related`/`selectinload`/join を使う |
| env / settings の代わりに秘密情報/設定をハードコード | REJECT |
| リクエストごとにスコープされない DB セッション（リーク） | REJECT |
| スキーマ変更にマイグレーション未使用 | REJECT |

## アンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| 裸の `except:` でエラーを握りつぶす | 隠れた失敗 |
| 可変デフォルト引数（`def f(x=[])`） | 共有状態バグ |
| リクエスト間で共有するグローバル DB 接続 | 並行性問題 |
| エラー本文を 200 で返す | クライアントを誤解させる（適切な status を使う） |
