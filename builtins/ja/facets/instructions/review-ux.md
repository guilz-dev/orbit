**ユーザー体験（UX）**のレビューに集中してください（スタンドアロン review workflow 向け。実装後または UI コードがある場合）。

手順:
1. Knowledge と Policy の Source Path を Read ツールで開き、全文を取得する
2. それぞれの `##` セクションをすべて列挙する（取捨選択しない）
3. 列挙した各セクションの判定基準を `ui-design.md`（存在時）と実装 UI — 画面、状態、ナビゲーション、インタラクションフロー — に照合し、問題を検出する

**注意:** この変更にユーザー向け UI がなければ、問題なしとして次に進んでください。

**SDD:** spec-driven workflow は設計ゲートで別 instruction `review-ux-design` を使う（ui-design.md のみ、実装前）。
