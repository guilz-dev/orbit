# UX知識 — iOS（Human Interface Guidelines）

iOS 固有の UX 規約。汎用 `ux` 知識と `swiftui` / `react-native` と併用する。

## プラットフォーム規約

| 基準 | 判定 |
|------|------|
| ネイティブパターン（nav stack、tab bar、sheets）の代わりに独自ナビゲーション | REJECT |
| システム戻るスワイプジェスチャの破壊 | REJECT |
| ネイティブがあるのに非標準コントロール（date picker、switch、action sheet） | 警告 |
| セーフエリア / home indicator / Dynamic Island の無視 | REJECT |

- ネイティブナビゲーションに従う: navigation stack（左上戻る + スワイプ）、同列セクションは tab bar、モーダルタスクは sheet/popover。
- セーフエリアと home indicator を尊重する。システム affordance の下にコントロールを置かない。

## コントロールとタッチ

| 基準 | 判定 |
|------|------|
| ~44×44 pt 未満のタップ領域 | REJECT |
| 確認なし / destructive（赤）未マークの破壊的操作 | REJECT |
| Dynamic Type（テキスト拡大）未対応 | REJECT |
| ダークモード未対応（ライト色のハードコード） | 警告 |

- 最小 44pt タッチ領域。破壊的操作はマークし、不可逆なものは確認する。
- ハードコード値ではなくシステム色/タイポグラフィで Dynamic Type とダークモードをサポートする。

## アクセシビリティと感触

| 基準 | 判定 |
|------|------|
| インタラクティブ要素に VoiceOver ラベルなし | REJECT |
| 不十分な色コントラスト | REJECT |
| 主要操作に haptic/視覚フィードバックなし | 警告 |
| プラットフォーム感に反するカスタムアニメーションの乱用 | 警告 |

- VoiceOver ラベル、十分なコントラスト、プラットフォーム期待に沿ったフィードバックを提供する。
