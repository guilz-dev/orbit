# React Native知識

React Native のパターン。`react` 知識（hooks/状態）と `mobile-platform` 知識（ライフサイクル/権限）と併用する。

## リストとレンダリング

| 基準 | 判定 |
|------|------|
| 大きな配列を `FlatList`/`FlashList` の代わりに `.map()` で描画 | REJECT |
| 安定した `keyExtractor` なしの `FlatList` | REJECT |
| `renderItem` 内のインライン arrow / オブジェクトによる再レンダー | 警告 |
| スクロールを阻害する JS スレッド上の重い処理 | `InteractionManager`/ネイティブへ移す |

- 非自明なリストは `FlatList`/`SectionList`（または FlashList）を使う。大きなリストを eager に描画しない。
- `renderItem` とアイテムコンポーネントをメモ化する。`keyExtractor` を提供する。

## プラットフォームとレイアウト

| 基準 | 判定 |
|------|------|
| 画面スケール / セーフエリアを無視したピクセル固定サイズ | REJECT |
| ノッチ端末で `SafeAreaView` / insets がない | REJECT |
| プラットフォーム分岐を至る所でインライン化 | `Platform.select` または `.ios./.android.` ファイルを使う |
| フィードバックなしのタッチ（`activeOpacity`/ripple） | 警告 |

- セーフエリア inset と画面密度の違いを尊重する。
- プラットフォーム差は `Platform.select` またはプラットフォーム拡張子ファイルで分離する。

## ブリッジとパフォーマンス

| アンチパターン | 問題 |
|--------------|---------|
| ループ内の頻繁な JS↔ネイティブ ブリッジ呼び出し | シリアライズ負荷。バッチ化する |
| JS スレッド駆動のアニメーション | `useNativeDriver: true` / Reanimated を使う |
| リサイズなしの大きな画像 | メモリ圧迫。リサイズ/キャッシュする |
| AsyncStorage に秘密情報を保存 | 安全でない。Keychain/Keystore を使う |
| リスナー/タイマーの解除漏れによるメモリリーク | effect の teardown でクリーンアップする |

- アニメーションはネイティブドライバ / Reanimated を優先する。
- 秘密情報は AsyncStorage ではなくセキュアストレージ（Keychain / Keystore）に保存する。
