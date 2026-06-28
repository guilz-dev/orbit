# Java / Spring Knowledge

Spring Boot service patterns. Pair with `backend`, `api-design`, `sql-rdb`.

## Layering & DI

| Criteria | Judgment |
|----------|----------|
| Business logic in `@RestController` | Move to `@Service` |
| Field injection (`@Autowired` field) instead of constructor injection | Prefer constructor injection |
| `@Repository` / entities leaked to the API as responses | Use DTOs |
| Circular bean dependencies | REJECT (redesign) |

- Controller → Service → Repository. Controllers map HTTP only; services hold logic.
- Use constructor injection (final fields) for testability and immutability.

## Transactions & JPA

| Criteria | Judgment |
|----------|----------|
| `@Transactional` on a private/self-invoked method (no proxy) | REJECT (won't apply) |
| Lazy association accessed outside a transaction (LazyInitializationException) | REJECT |
| N+1 from lazy loading in a loop | Use fetch joins / `@EntityGraph` |
| Entity mutated outside a transaction expecting a flush | REJECT |

- Keep `@Transactional` on service methods called through the proxy; understand boundaries.
- Avoid N+1 with fetch joins or entity graphs; map to DTOs for responses.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Catch-and-swallow exceptions | Hidden failures |
| Returning entities directly (lazy fields, over-exposure) | Coupling, serialization errors |
| Business logic in entities or controllers | Misplaced responsibility |
| `@Component` god-services | Untestable, unfocused |
| Checked exceptions leaking through layers | Brittle signatures |
