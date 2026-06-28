# 認証・認可知識

Identity proof（authentication）と permission decision（authorization）は別の関心事であり、分けて設計する必要がある。

## 認証の基本

| 観点 | ガイダンス |
|------|------------|
| Identity proof | password、SSO/OIDC、token、mTLS、signed request など明示的な方式を選ぶ |
| Session | token / session の lifetime、rotation、revocation、storage を定義する |
| Recovery | password reset / account recovery が本来の trust model を迂回しないようにする |
| Service auth | 人の認証と service-to-service credential を分離する |

## 認可設計

| モデル | ガイダンス |
|--------|------------|
| RBAC | permission が role に素直に対応するなら有効 |
| ABAC / policy check | resource 属性や tenancy 依存の access で有効 |
| Ownership check | “自分の resource” と admin override の境界を定義する |
| Least privilege | default deny、必要最小限だけを付与する |

- Authentication は「誰か」を答える。
- Authorization は「この文脈で、この resource に対して、この操作ができるか」を答える。

## 境界ケース

| failure mode | 問題 |
|--------------|------|
| endpoint が client 提供の role / tenant / user id を信頼する | 権限昇格 |
| auth check はあるが object-level access check がない | IDOR / data leak |
| admin 経路が hidden UI だけで一般ユーザーフローを再利用する | security by obscurity |
| revocation 経路のない長寿命 token | compromise 時の影響期間が長い |

## レビュー観点

- 必要な箇所で logout、password change、credential rotation 時の session invalidation を確認する。
- multi-tenant 境界を明示的に確認する。query scope、cache key、background job context、export path。
- “authenticated” と “authorized” を混同しない。両方を証明する必要がある。
