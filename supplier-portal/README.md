# atavishaala-supplier-portal

Vite · React 18 · TanStack Query · Router 6 → Cloudflare Pages at `seller.atavishaala.in`.

Product-company self-serve: listings, stock, prices, dispatch, settlement. 26 screens. Consumes `/api/v1/partner` only, through `@atavishaala/kit`.
Owner: FE-2.

Specification: `docs/AA-06_Supplier_Portal_Specification.pdf`.

## Layout

    src/routes/       the route table — what this portal is
    src/features/     one directory per feature area, screens composed from kit parts
    src/components/   portal-specific composition only; anything two portals need goes to the kit
    src/api/          thin bindings over the kit client — reviewed by the backend owner

## Rules

No secret, no direct `fetch` or `axios`, no third-party API call, no business rule that
writes, and nothing in the dependency tree that speaks to Postgres. A portal may reject a
form before submitting it; the API rejects it again and the API is the one that counts.

`@atavishaala/kit` and `@atavishaala/contract` are pinned to exact versions — no caret,
no tilde, no workspace link. The range-pin gate fails the build on a range specifier.

## Environment

Six variables, all six public by construction. Every `VITE_` value is inlined into the
bundle at build time and is published to anyone who opens the network tab; there is no
such thing as a secret `VITE_` variable. See `env.example`.

Deploy secrets (`NPM_READ_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
`SENTRY_AUTH_TOKEN`) live in repository Actions secrets and never reach the bundle.

## Verify

`npm run verify` — typecheck, lint, unit tests, build, bundle-size check. Initial JS
budget is 220 KB gzipped; the build fails above it.
