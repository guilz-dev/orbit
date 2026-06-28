# Jetpack Compose知識

Jetpack Compose（Android）のパターン。`mobile-platform` と `ux-material`（存在時）と併用する。

## 状態とリコンポジション

| 基準 | 判定 |
|------|------|
| `remember` なしで composable 内から mutable state を読む（リコンポジションで失われる） | REJECT |
| 親が必要なのに葉 composable 内に状態を所有 | 状態を持ち上げる |
| 非 `@Stable`/不安定なパラメータによる不要なリコンポジション | 警告 |
| effect ではなく composition 内で直接副作用を呼ぶ | REJECT |

- **状態の持ち上げ:** ステートレス composable は `value` + `onValueChange` を受け取る。状態は呼び出し元 / ViewModel に置く。
- リコンポジション / 設定変更を跨いで残す状態には `remember` / `rememberSaveable` を使う。
- 副作用は `LaunchedEffect` / `DisposableEffect` / `SideEffect` に置き、インラインにしない。

```kotlin
// ✅ ステートレス + 持ち上げ
@Composable
fun NameField(value: String, onValueChange: (String) -> Unit) {
  TextField(value = value, onValueChange = onValueChange)
}
```

## リストとパフォーマンス

| 基準 | 判定 |
|------|------|
| 長いリストに `Column { items.forEach { ... } }` | REJECT（`LazyColumn` を使う） |
| 安定した `key` なしの `LazyColumn` アイテム | 警告 |
| 頻繁に変わる状態をツリー高所で読む | 読み取り範囲を絞りリコンポジションを遅延 |
| ViewModel の代わりに composition 内で重い処理 | REJECT |

- リストには `key` 付きの `LazyColumn`/`LazyRow` を使う。
- ビジネスロジックは ViewModel に置き、composable は状態を描画してイベントを emit する。

## アンチパターン

| アンチパターン | 問題 |
|--------------|---------|
| ViewModel ロジックが composable に漏れる | テスト不能な UI |
| composition 中の共有状態変更 | 未定義動作 |
| ライフサイクル無視（`collectAsStateWithLifecycle` 未使用） | 無駄な処理 / リーク |
| MaterialTheme トークンの代わりに dp/色をハードコード | テーマ/ダークモード破壊 |
