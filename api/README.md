# atavishaala-api

Express 5 · TypeScript · Prisma · Node 20 → Cloud Run (`asia-south1`).

The only process in the programme holding a database credential, and therefore the only
writer to Postgres. Modular monolith: eleven business modules, five API namespaces.
Publishes `@atavishaala/contract` on a version tag.

Specification: `docs/AA-02` (modules, namespaces, tenancy), `docs/AA-03` (data model and
migrations), `docs/AA-04` (frozen API surface).

## Layout

    prisma/schema.prisma      one schema, one migration history, one client
    prisma/migrations/        M1..M8, forward-only — never edit an applied migration
    src/index.ts              express app, namespace mounting, nothing else
    src/modules/<name>/       the eleven business modules, below
    src/platform/             six cross-cutting concerns no module owns
    packages/shared/          errors.ts, money.ts, permissions union, contract generator

Every module holds the same files:

| File | Holds |
|---|---|
| `router.ts` | route table, Zod bindings, route metadata (`meta.money` etc.) |
| `service.ts` | business rules and transactions — the only caller of `repo.ts` |
| `repo.ts` | Prisma access; in partner and fleet paths only via `scoped()` |
| `schema.ts` | Zod request/response schemas — source of `@atavishaala/contract` |
| `policy.ts` | permission constants and step-up flags for this module |
| `types.ts` | the module's public types — **the only cross-module import** |
| `fsm.ts` | transition table (orders, shipments, jobs, kyc, payouts) |
| `__tests__/` | unit on pure functions, integration on the router |

`src/platform/` is `auth/` (JWT verify, `requireActor`, `requirePermission`,
`requireFreshFactor`), `pii/` (masking client extension, `last4()`, `discloseOrThrow()`),
`money/` (paise arithmetic, ledger append, no float anywhere), `queue/` (`job_queue`
enqueue and drain, `FOR UPDATE SKIP LOCKED`), `audit/` (admin-router middleware,
before/after diff writer), `idem/` (`idempotency_keys` middleware, replay and mismatch
detection).

## The import rule

A module imports from `src/platform` freely. From another module it imports `types.ts`
and nothing else — never another module's `repo.ts`, `service.ts` or `router.ts`.
Enforced by `eslint-plugin-boundaries` plus `import/no-restricted-paths`, so a
cross-module write is a compile error rather than a review observation.

## Modules

| Module | Status | Namespaces |
|---|---|---|
| `identity` | existing | app, public |
| `users` | existing | app, admin |
| `catalog` | extended | app, admin, partner |
| `advisor` | extended | app, admin |
| `commerce` | existing | app, admin |
| `orders` | rewritten | app, admin, partner, fleet |
| `money` | extended | app, admin |
| `platform` | extended | admin |
| `partners` | new | admin, partner |
| `fleet` | new | admin, fleet |
| `backoffice` | new | admin |

`commerce`, `identity` and `users` being marked existing is a commitment, not an
observation: a pull request editing them needs a stated reason.
