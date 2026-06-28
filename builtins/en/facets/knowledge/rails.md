# Ruby on Rails Knowledge

Rails (ActiveRecord, MVC) patterns. Pair with `backend`, `api-design`, `sql-rdb`.

## Models & Queries

| Criteria | Judgment |
|----------|----------|
| N+1 query (no `includes`/`preload`) | REJECT |
| Business logic in controllers | Move to models / service objects |
| Validations / invariants only in app, not also DB constraints | Add DB constraints |
| Callbacks with side effects (emails, external calls) on save | Prefer service objects |

- Skinny controllers, rich models / service objects. Controllers orchestrate; they don't hold logic.
- Eager-load associations (`includes`) to kill N+1; back invariants with DB constraints.

## Security & Conventions

| Criteria | Judgment |
|----------|----------|
| Mass assignment without strong params | REJECT |
| Raw SQL interpolation of user input | REJECT (SQL injection) |
| Fat controllers doing data prep + logic | Extract |
| Skipping migrations for schema change | REJECT |

- Use strong parameters; never interpolate user input into SQL — use parameterized queries.
- Follow convention over configuration; deviate only with a recorded reason.

## Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Callback hell on models | Hidden side effects, hard to test |
| God models | Unfocused, untestable |
| Logic in views | Move to helpers/presenters |
| Ignoring `bullet`-style N+1 warnings | Performance |
