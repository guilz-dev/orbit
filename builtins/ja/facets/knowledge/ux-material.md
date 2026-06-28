# UX知識 — Android（Material Design）

Android / Material Design の UX 規約。汎用 `ux` 知識と `jetpack-compose` / `react-native` と併用する。

## Material 構造

| 基準 | 判定 |
|------|------|
| Material パターン（top app bar、navigation bar/rail、drawer）の代わりに独自ナビゲーション | 警告 |
| システム戻るボタン / predictive back の無視 | REJECT |
| Material テーマ（`MaterialTheme`/トークン）の代わりにハードコード色 | REJECT |
| Material 階層と不一致の elevation/surface | 警告 |

- Material コンポーネントとテーマトークンを使う。ダーク/dynamic color はテーマから流す。
- Android システム戻る（および predictive back）を尊重する。ユーザーを閉じ込めない。

## コントロールとタッチ

| 基準 | 判定 |
|------|------|
| 48×48 dp 未満のタッチ領域 | REJECT |
| 非主要アクション（または複数 FAB）への FAB 使用 | 警告 |
| 確認なしの破壊的操作 | REJECT |
| テキスト拡大 / フォントサイズ設定未対応 | REJECT |

- 最小 48dp タッチ領域。FAB は画面の単一主要アクション用に留める。
- フォント拡大と設定変更（回転、ロケール）を状態喪失なくサポートする。

## アクセシビリティとフィードバック

| 基準 | 判定 |
|------|------|
| TalkBack 用 content description なし | REJECT |
| Material surface に対する不十分なコントラスト | REJECT |
| タッチに ripple / 状態フィードバックなし | 警告 |
| ガイダンスと不一致の Snackbar/ダイアログ使用 | 警告 |

- TalkBack 用 `contentDescription`、十分なコントラスト、標準タッチフィードバック（ripple）を提供する。
