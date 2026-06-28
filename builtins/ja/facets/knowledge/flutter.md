# Flutter知識

Flutter / Dart ウィジェットのパターン。ライフサイクル/権限は `mobile-platform` と併用する。

## ウィジェットと build()

| 基準 | 判定 |
|------|------|
| `build()` 内の副作用（ネットワーク、ナビゲーション） | REJECT |
| 1 つの巨大な `build()` メソッドに深いウィジェットツリー | ウィジェットへ分割 |
| `StatelessWidget` + 状態管理で足りるのに `StatefulWidget` | stateless を優先 |
| 静的サブツリーに `const` コンストラクタがない | 警告（再ビルドコスト） |

- `build()` は純粋で軽くなければならない。毎フレーム走りうる。副作用を入れない。
- サブツリーをウィジェット（ヘルパーメソッドではない）へ抽出し、Flutter が再ビルドをスキップできるようにする。
- 静的サブツリーには可能な限り `const` コンストラクタを使う。

## 状態管理

| 基準 | 判定 |
|------|------|
| 画面全体を再ビルドする巨大ウィジェット内の `setState` | 状態のスコープを下げる |
| ウィジェットに混ざったビジネスロジック | notifier/bloc/provider へ移す |
| コントローラ（Animation/TextEditing）の dispose 漏れ | REJECT（リーク） |
| inherited state を正しく listen せずに読む | REJECT |

- 状態管理は 1 つに決め（Provider/Riverpod/Bloc）、境界を明確に保つ。
- コントローラ、ストリーム、リスナーは必ず `dispose()` する。

## リストとパフォーマンス

| アンチパターン | 問題 |
|--------------|---------|
| 長いリストに `Column`/`ListView(children: [...])` | 一度に全部ビルド。`ListView.builder` を使う |
| 小さな変更でツリー全体を再ビルド | const + 対象 notifier で再ビルド範囲を絞る |
| `cacheWidth`/リサイズなしの大きな画像 | メモリ圧迫 |
| 重い計算で UI isolate をブロック | `compute()` / isolate を使う |

- 長さ不明のリスト/グリッドは `.builder` コンストラクタを使う。
- 重い CPU 処理は isolate へオフロードする。
