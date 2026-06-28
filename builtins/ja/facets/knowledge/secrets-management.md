# シークレット管理知識

シークレットには API keys、signing keys、database passwords、client secrets、tokens、certificates など、アクセス権を与える credential 全般が含まれる。

## 保存と配布

| 観点 | ガイダンス |
|------|------------|
| Source control | secret は commit せず、secret store と template だけを使う |
| Runtime delivery | コピー済み local file ではなく、managed store から runtime inject する |
| Scope | environment、service、trust boundary ごとに secret を分離する |
| Rotation | 可能なら無停止で rotation できる設計にする |

## 露出制御

| トピック | ガイダンス |
|----------|------------|
| Logs | raw secret value やそれを含む header をログ出力しない |
| Client apps | mobile/web bundle に server secret を埋め込まない |
| CI/CD | deploy secret を読める主体を最小化し、短命 credential を優先する |
| Local dev | `.env.example` や safe example を使い、docs / fixtures に実値を書かない |

## 運用実践

| 実践 | 意義 |
|------|------|
| secret inventory と owner 管理 | orphaned credential を防ぐ |
| rotation drill | incident 前に recovery path が動くことを証明する |
| revocation plan | 漏えい・過剰権限時に必須 |
| access audit | 想定外 reader と privilege creep を検出する |

## アンチパターン

| アンチパターン | 問題 |
|----------------|------|
| 全 environment で 1 つの shared secret を使う | cross-environment blast radius |
| 長寿命の人間用 token を automation に使う | rotation しにくく leak しやすい |
| 多数の中間 file を経由して secret を受け渡す | 露出点が増える |
| base64 / obfuscation を保護とみなす | 実際の security ではない |
