# Mock Implementation Policy

mock UI は体験と合意の検証用である。黙って本番統合になってはならない。

## 原則

| 原則 | 基準 |
|------|------|
| 実統合より stub | データと副作用は fixture / fake / ローカル placeholder |
| 境界の明示 | 未接続の API / auth / 永続化はすべて文書化 |
| 設計優先 | `ui-design.md` があるとき、見た目の構造と状態はそれに合わせる |
| 捨ててよい | mock は置き換え可能。コアドメインモジュールと絡めない |

## 適用範囲

persona `front-mock-coder` または instruction `implement-frontend-mock` を使う step。

## 判定基準

| 基準 | 判定 |
|------|------|
| mock UI から本番 API を呼ぶ | REJECT |
| 実 auth / セッション永続を配線 | REJECT |
| 本番相当のドメイン/ビジネスルールを実装 | REJECT |
| ローカル fake 以外の DB / サーバー更新 | REJECT |
| 未接続点を文書化した stub/fixture | OK |
| プレースホルダ handler（log / noop / ローカル toggle のみ） | OK |
| レイアウト・フロー用のハードコード行 | OK |
| fake データによる loading / empty / error 状態 | OK |

## 実装手順

1. Policy と Knowledge を開き、実装前にすべての `##` 節を列挙する
2. ネットワーク呼び出しより fixture とインラインサンプルを優先する
3. 未接続統合は `mock-ui-summary.md` に記録する
4. プロジェクトの build / typecheck を実行する。テストは plan で要求されない限り任意

## レビュー手順

1. 本番 API クライアント、auth フロー、ドメインサービスの混入を確認する
2. diff と `mock-ui-summary.md` を突合 — 隠れた stub は REJECT
3. `ui-design.md` がある場合、画面と状態が表現されているか確認する（データの本番正しさは不要）
