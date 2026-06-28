ux-review ↔ fix ループが {cycle_count} 回繰り返された。

Report Directory 内の最新 ux-review.md を確認し、設計ドキュメント修正ループが
収束しているか（healthy）、非生産的か（unproductive）を判定する。

**判定基準:**
- 同じ finding_id が ui-design.md の更新なしに複数サイクル残存しているか
  - 同じ finding_id が繰り返し persists → unproductive（停滞）
  - 以前の所見が解消され新規所見のみ → healthy（収束）
- ui-design.md または関連設計成果物に修正が反映されているか
- 新規 / reopened UX 所見の数が全体として減っているか

コードや実装の修正が必要な場合は、このループを続けず review-fix-frontend へ誘導する。
