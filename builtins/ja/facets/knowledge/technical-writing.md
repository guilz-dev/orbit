# テクニカルライティング知識

テクニカルライティングは、対象読者が最小の曖昧さと認知負荷で正しく行動できることを目指す。

## Audience-first の書き方

| 観点 | ガイダンス |
|------|------------|
| Audience | reader が operator、developer、reviewer、end user の誰かを決める |
| Purpose | explain、specify、instruct、record のどれかを明確にする |
| Context | prerequisite、assumption、scope を前に出す |
| Actionability | 具体的な steps、examples、expected result を優先する |

## 構造と文体

| トピック | ガイダンス |
|----------|------------|
| Headings | 気の利いた表現より scan しやすい heading を使う |
| Lists / tables | 曖昧さや比較コストを減らすときに使う |
| Examples | リスクが高い場面では placeholder より realistic example を優先する |
| Drift control | durable facts は canonical doc に置き、一時分析は別に逃がす |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| “みんな向け” に書く | 誰にとっても中途半端になる |
| prerequisite を途中に隠す | 読者が開始前に失敗する |
| 手順物なのに構造のない長文 prose | 認知負荷が高い |
| volatile detail をあちこちへ複製する | すぐ drift する |
