plan と利用可能な設計参照に従い、**フロントエンド mock UI** を実装する。

手順:
1. Policy と Knowledge の Source path を Read で開き、全文を取得する
2. それぞれの `##` 節をすべて列挙する（cherry-pick 禁止）
3. ファイル編集前に `coder-scope.md` で変更スコープを宣言する
4. **stub データ、fixture、プレースホルダ handler のみ**で画面・ナビゲーション・状態を組み立てる
5. `ui-design.md` がある場合、レイアウト・ラベル・状態網羅を設計に合わせる（データは fake でよい）
6. **本番 API、実 auth、永続ドメインロジックは接続しない** — ギャップは `mock-ui-summary.md` に記録する
7. プロジェクトが対応していれば build / typecheck を実行する。テストは plan で明示された場合のみ追加・更新する

**handoff レポート（`mock-ui-summary.md`）に必須:**
- 今回の mock で実装した画面とフロー
- 使用した stub / fixture の出所
- 未接続の API、auth、永続化、ドメインルール（明示リスト）
- ギャップごとの推奨次担当（Core Coder / UI Coder）

**完了前セルフチェック（必須）:**

Policy に対して次の手順で監査する。

1. Policy Source path を Read で開き全文を取得する
2. すべての `##` 節を列挙する（cherry-pick 禁止）
3. 各節の REJECT 基準を実装と照合する

REJECT に該当する項目があれば、step 完了前に修正する。
