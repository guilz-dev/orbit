# SwiftUI知識

SwiftUI（iOS）のパターン。ライフサイクル/権限は `mobile-platform`、HIG は `ux-ios-hig`（存在時）と併用する。

## 状態とデータフロー

| プロパティラッパ | 用途 |
|------------------|---------|
| `@State` | ビュー局所、値型、一時的な UI 状態 |
| `@Binding` | 親が所有する状態への双方向参照 |
| `@Observable` / `@StateObject` | ビューが所有する参照型モデル |
| `@ObservedObject` / `@Environment` | 外部から注入されたモデル |

| 基準 | 判定 |
|------|------|
| 共有/正のモデルデータに `@State` を使う | REJECT |
| `@StateObject` の代わりに `@ObservedObject` でモデルを毎回再生成 | REJECT |
| `body` 内の重い処理 | REJECT（body は頻繁に再計算される） |
| ビュー更新中の状態変更 | REJECT |

- 単一の正: 所有者は `@State`/`@StateObject`、子は `@Binding`/`@ObservedObject`。
- `body` は状態の安価で純粋な関数でなければならない。

## レイアウトとナビゲーション

| 基準 | 判定 |
|------|------|
| `NavigationStack` の代わりに `NavigationView`（非推奨） | `NavigationStack` を優先 |
| 必要な箇所でレイアウトシステム / `GeometryReader` の代わりに固定 frame | 警告 |
| セーフエリア / Dynamic Type を無視 | REJECT |
| 識別不能なコレクションから長い `List` を構築 | `id`/`Identifiable` を提供 |

- Dynamic Type とセーフエリアをサポートする。アクセシビリティ拡大を壊す固定サイズを使わない。

## アンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| ネストしたロジックを持つ巨大な `body` | サブビューへ分割 |
| View 内のビジネスロジック | `@Observable` モデルへ移す |
| 表示のたびに再実行される `onAppear` の処理 | ガードするか `task` へ移す |
| UI 更新 async に `@MainActor` を忘れる | スレッドバグ |
