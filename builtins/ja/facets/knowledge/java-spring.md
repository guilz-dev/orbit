# Java / Spring知識

Spring Boot サービスのパターン。`backend`、`api-design`、`db-schema-design`、`indexing-query-tuning` と併用する。

## レイヤリングと DI

| 基準 | 判定 |
|------|------|
| `@RestController` 内のビジネスロジック | `@Service` へ移す |
| コンストラクタ注入の代わりにフィールド注入（`@Autowired` フィールド） | コンストラクタ注入を優先 |
| `@Repository` / エンティティを API レスポンスとして漏らす | DTO を使う |
| 循環 Bean 依存 | REJECT（再設計） |

- Controller → Service → Repository。Controller は HTTP のみ。ロジックは Service。
- テスト容易性と不変性のためコンストラクタ注入（final フィールド）を使う。

## トランザクションと JPA

| 基準 | 判定 |
|------|------|
| private/自己呼び出しメソッドへの `@Transactional`（プロキシが効かない） | REJECT（適用されない） |
| トランザクション外で lazy 関連にアクセス（LazyInitializationException） | REJECT |
| ループ内 lazy loading による N+1 | fetch join / `@EntityGraph` を使う |
| flush を期待してトランザクション外でエンティティを変更 | REJECT |

- `@Transactional` はプロキシ経由で呼ばれる Service メソッドに置く。境界を理解する。
- N+1 は fetch join または entity graph で避け、レスポンスは DTO にマップする。

## アンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| catch-and-swallow | 隠れた失敗 |
| エンティティを直接返す（lazy フィールド、過剰露出） | 結合、シリアライズエラー |
| エンティティや Controller 内のビジネスロジック | 責務の誤配置 |
| `@Component` god-service | テスト困難、焦点不明 |
| レイヤーを貫く checked exception | 脆いシグネチャ |
