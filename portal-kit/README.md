# atavishaala-portal-kit

React 18 · TypeScript · Vite library mode · Tailwind preset → GitHub Packages as
`@atavishaala/kit` (private, `atavishaala` scope).

Consumed at an exact version by all three portals. Never linked as a workspace.
Depends on `@atavishaala/contract`; depends on no portal.

Specification: `docs/AA-01` §1.5.

## What belongs here

One test decides it: **if two portals would need it and it would be a bug for them to
differ, it belongs in the kit.** If it describes what a particular portal is, it does not.

In the kit: the auth session provider and the 401 refresh interceptor (single-flight
lock, so six concurrent 401s produce one refresh); `useApi`, a typed fetch wrapper
generic over the contract's request and response types, and the only way a portal
reaches the network; `Money`, which accepts integer paise and nothing else; `Masked`,
which cannot render more than four characters; `DataTable`, `FilterBar`, `Drawer`,
`ConfirmDialog`, `EmptyState`; `StepUpDialog`, which intercepts `403 STEP_UP_REQUIRED`
and replays the original request without losing form state; the error-code to
human-string map, keyed by the contract's error-code union; IST date and time
formatting; the `Idem` hook.

Not in the kit: route tables, permission strings, business copy, per-tenant branding,
any hard-coded host (the base URL arrives via `createClient`), any screen.

## Masking is a type-level guarantee

`Masked` has no `reveal`, no `showFull`, no `onReveal` prop — the unmasked case is not
expressible. The value arrives already reduced to `last4` by the API serialiser. Adding
a reveal affordance is an API change, which is a major bump, which is a review nobody
merges past quietly.

## Releasing

Additive within a minor: a minor may add an export, an optional prop or an error-code
entry. It may not remove an export, rename a prop, change a default or change a rendered
format — those are a major bump plus three coordinated portal pull requests in the same
week. Bump `package.json`, add a dated `CHANGELOG.md` entry naming the task ID, push the
tag from `main`. The version bump is its own one-line pull request, never part of a
feature PR. A published version that has been consumed is never republished — burn the
number and publish the next patch.
