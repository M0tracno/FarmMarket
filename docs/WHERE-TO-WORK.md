# Where to work

Read this before opening a task. It answers one question: given the thing you have been
asked to build, which directory do you open.

Source: AA-00 §0.2–0.3, AA-01 §1.1, AA-02 §2.1, AA-11 (task list). Where this document
and a specification disagree, the specification wins.

---

## 1. The short answer

**There is no single "main application" directory, and that is the source of the
confusion.** This programme is four products sharing one backend.

- **Backend work → `api/`.** Every business rule that writes lives here. This is the
  largest body of work in the programme and the one everything else waits on.
- **Front-end work → `portal-kit/` first, then one of the three portals.** Not the
  mobile app.
- **`mobile-app/` is the existing consumer app and is out of scope for the ten weeks.**
  It has no task assigned to it in AA-11. If you were told to "start on the main app"
  and went looking there, you were pointed at the wrong thing.

The product a farmer opens is already built and shipping. What this programme builds is
the machinery behind it: the staff console, the supplier self-serve surface, the delivery
self-serve surface, and the backend that replaces an operator moving orders by hand.

---

## 2. Directory map

| Directory | Is | Who works here | In scope? |
|---|---|---|---|
| `api/` | Express 5 + Prisma backend, Cloud Run | BE-1, BE-2 | **Yes — the bulk of it** |
| `portal-kit/` | Shared React component + auth library, published as `@atavishaala/kit` | FE-1 owns, FE-2 commits | **Yes — and first** |
| `admin-portal/` | Staff console, 41 screens | FE-1 | Yes |
| `supplier-portal/` | Product-company self-serve, 26 screens | FE-2 | Yes |
| `fleet-portal/` | Delivery-company self-serve, 24 screens, mobile-first | FE-2 | Yes |
| `mobile-app/` | Existing React Native consumer app | nobody, this programme | **No — frozen** |
| `docs/` | The thirteen specification documents | everyone reads | n/a |

91 portal screens total. Zero new mobile app screens.

---

## 3. "I need to change X" → open Y

| What you were asked for | Directory | Also touches |
|---|---|---|
| A new endpoint, any namespace | `api/src/modules/<module>/` | `schema.ts` first, then generate the contract |
| A database column or table | `api/prisma/` — one migration per PR, forward-only | `api/src/modules/<owner>/repo.ts` |
| A permission string | `api/packages/shared/permissions.ts` | the module's `policy.ts` |
| An error code | `api/packages/shared/errors.ts` | the kit's error-code map, and a line in AA-04 |
| A component two portals need | `portal-kit/src/` | nothing — portals pick it up on the next bump |
| A component one portal needs | that portal's `src/components/` | nothing |
| A screen | that portal's `src/features/` + `src/routes/` | never the kit |
| A business rule that rejects a write | `api/` — **always** | the portal may reject early for UX, but it does not count |
| Anything a farmer sees in the app | **stop** — see §7 | |

The last two rows are the ones that get PRs sent back.

---

## 4. Start here, by person

The dependency runs **FE-1 → FE-2**. Nothing FE-2 is scheduled to do can start until
`portal-kit` publishes v0.1 with a working shell, a table, a form field and the four
states. Build those a second time in the supplier portal and you will unbuild them.

### FE-1 — kit owner, then admin portal

1. `P1-FE1-01` Create the repositories from a shared template: tsconfig, eslint,
   prettier, `.editorconfig`. Branch protection on `main` — one review, all checks
   required, no force push. CODEOWNERS.
2. `P1-FE1-02..04` **Publish `@atavishaala/kit` v0.1 by Wednesday.** Deliberately
   unfinished: four components and the four states (loading, empty, error, ready).
   Nothing else. The additive-within-a-minor rule carries the rest.
3. `P1-FE1-05` Scaffold `admin-portal/`, login plus a placeholder dashboard behind
   `RequireAuth`.
4. W2 `P2-FE1-01..03` The kit's real substance: `DataTable` with server-side
   pagination, `AppShell` with a sidebar filtered by permission.
5. W2 `P2-FE1-04..05` First admin screens — AD-04 dashboard shell, AD-05 order list,
   AD-15 product list, AD-16 product detail. Read-only.

### FE-2 — supplier and fleet portals

Blocked until kit v0.1 exists. Until Wednesday of W1, help unblock it.

1. `P1-FE2-01` Scaffold `supplier-portal/` and `fleet-portal/`: Vite, React, TypeScript,
   Router 6, TanStack Query, kit pinned exact. `VITE_NAMESPACE` = `partner` and `fleet`.
   One client per portal. Login plus a placeholder dashboard behind `RequireAuth`. Both
   wired to Cloudflare Pages with a preview per PR.
2. `P1-FE2-02` Security headers: `_headers` per Pages project. CSP with `connect-src`
   listing exactly `api.atavishaala.in` and `res.cloudinary.com`. No wildcard, no
   `unsafe-inline` — move the one inline style into the stylesheet. A Playwright check
   asserting the header on the deployed host.
3. W2 `P2-FE2-01` SP-01, SP-02, SP-03 — supplier auth and invite acceptance.
4. W2 `P2-FE2-02` FL-01 — fleet auth, dual mode: password for dispatchers, OTP for riders.

### BE-1 — identity, backoffice, partners

1. `P1-BE1-01..04` Token audience split: mint with the correct `aud` per login path,
   `requireActor(kind)` asserting it, and a namespace-mismatch integration test proving
   a partner token gets 401 on `/admin`.
2. W2 `P2-BE1-01..03` The 88-permission union in `packages/shared/permissions.ts` — and
   there is no `pii.read.raw`. Seed `role_permissions` for the nine system roles from a
   checked-in TypeScript fixture.
3. W2 `P2-BE1-04..06` Audit middleware on the admin router with a before/after diff writer.

### BE-2 — orders, fleet, money

1. `P1-BE2-01..03` API skeleton: mount `/public`, `/app`, `/admin`, `/partner`, `/fleet`,
   each with its own actor guard. Idempotency middleware — a repeated key replays
   byte-identically, a different body under the same key returns `409 IDEMPOTENCY_MISMATCH`.
2. W2 `P2-BE2-01..02` M4: `shipments`, `shipment_items`. The orders rewrite begins.
3. W2 `P2-BE2-03` M5 and M6: the fleet tenancy tables.

### Everyone

`P1-ALL-01` Working agreement and the gate log. `P2-ALL-02` Turn the eight custom ESLint
rules on as errors across all five areas.

**Friday of week 1 must show:** a staff user signing in with email, password and TOTP
against the deployed API; TOTP refused when absent; twelve gates green everywhere; the
kit pinned exactly in one portal's `package.json`.

---

## 5. The screens, so nobody invents a route

### `admin-portal/` — 41 screens, FE-1, spec AA-05

| Group | Screens |
|---|---|
| Auth | AD-01 `/login` · AD-02 `/login/totp` · AD-03 `/onboarding/totp` |
| Orders | AD-04 `/` · AD-05 `/orders` · AD-06 `/orders/:id` · AD-07 `/shipments` · AD-08 `/shipments/:id` · AD-09 `/returns` |
| Delivery | AD-10 `/jobs` · AD-11 `/jobs/unassigned` · AD-12 `/jobs/:id` · AD-13 `/pod-review` · AD-14 `/serviceability` |
| Catalog | AD-15 `/products` · AD-16 `/products/:id` · AD-17 `/products/new` · AD-18 `/moderation` · AD-19 `/categories` · AD-20 `/inventory` |
| Partners | AD-21 `/partners` · AD-22 `/partners/:id` · AD-23 `/partners/invite` · AD-24 `/partner-kyc` |
| Fleets | AD-25 `/fleets` · AD-26 `/fleets/:id` · AD-27 `/fleets/invite` · AD-28 `/fleet-kyc` · AD-29 `/fleet-areas` · AD-30 `/riders` |
| Advisor | AD-31 `/advisory` · AD-32 `/advisory/:id` · AD-33 `/advisory/shifts` |
| Money | AD-34 `/payments` · AD-35 `/refunds` · AD-36 `/wallets/:userId` · AD-37 `/payouts` · AD-38 `/cod` |
| Admin | AD-39 `/customers` · AD-40 `/staff` · AD-41 `/audit` |

AD-11 is the most-used screen in the portal. AD-07 is where an ops shift actually sits.
AD-20 is the only screen in the portal that writes stock directly.

### `supplier-portal/` — 26 screens, FE-2, spec AA-06

| Group | Screens |
|---|---|
| Auth | SP-01 `/login` · SP-02 `/invite/:token` · SP-03 `/onboarding` |
| Fulfilment | SP-04 `/` · SP-05 `/shipments` · SP-06 `/shipments/:id` · SP-07 `/shipments/:id/pack` · SP-08 `/shipments/:id/label` · SP-09 `/handover` |
| Catalog | SP-10 `/products` · SP-11 `/products/new` · SP-12 `/products/:id` · SP-13 `/products/:id/edit` · SP-14 `/stock` · SP-15 `/pricing` · SP-16 `/moderation` |
| Returns | SP-17 `/returns` · SP-18 `/returns/:id` |
| Money | SP-19 `/payouts` · SP-20 `/payouts/:runId` · SP-21 `/ledger` · SP-22 `/invoices` |
| Settings | SP-23 `/settings/bank` · SP-24 `/settings/kyc` · SP-25 `/settings/users` · SP-26 `/settings/profile` |

SP-08 is a print-optimised A4 view. Every finance route under `/partner` is a GET except
`PUT /partner/bank`. There is no export route anywhere in this portal.

### `fleet-portal/` — 24 screens, FE-2, spec AA-07 — **mobile-first**

| Group | Screens |
|---|---|
| Auth | FL-01 `/login` · FL-02 `/invite/:token` · FL-03 `/onboarding` |
| Offers and jobs | FL-04 `/` · FL-05 `/offers` · FL-06 `/jobs` · FL-07 `/jobs/:id` · FL-08 `/jobs/:id/manifest` · FL-09 `/jobs/:id/pod` · FL-10 `/jobs/:id/fail` |
| Rider | FL-11 `/rider` · FL-12 `/rider/scan` |
| Fleet ops | FL-13 `/riders` · FL-14 `/riders/new` · FL-15 `/riders/:id` · FL-16 `/vehicles` |
| Areas | FL-17 `/areas` · FL-18 `/areas/request` |
| Money | FL-19 `/earnings` · FL-20 `/earnings/:runId` · FL-21 `/ledger` · FL-22 `/cod` |
| Settings | FL-23 `/settings/bank` · FL-24 `/settings/users` |

Riders are on phones on mobile networks. FL-11 and FL-12 are the rider's whole world —
design them for a 360px viewport first, not last.

FL-08 is the **single PII exception in the entire programme**: it releases the delivery
address only, scoped to one job, for `MANIFEST_WINDOW_MINUTES = 240`, and writes a
`pii_disclosures` row in the same transaction as the read. The customer phone is never
released. Do not treat this screen as a precedent for anything.

---

## 6. Kit or portal? One test

**If two portals would need it and it would be a bug for them to differ, it belongs in
the kit.** If it describes what this particular portal *is*, it does not.

In the kit: the session provider and the 401 refresh interceptor, `useApi`, `Money`
(integer paise, no float prop), `Masked`, `DataTable`, `FilterBar`, `Drawer`,
`ConfirmDialog`, `EmptyState`, `StepUpDialog`, the error-code map, IST formatting, `Idem`.

Not in the kit: route tables, permission strings, business copy, branding, any hard-coded
host, any screen.

The failure mode is not bad design. It is that you need a component, you cannot get it
merged this week, and you copy it into your portal instead. That is tracked as risk R-05,
and its detection signal is a new file under a portal's `components/` whose export name
duplicates a kit export. If the kit is blocking you, say so at the Wednesday sync — do
not route around it.

---

## 7. What a farmer sees: do not touch

If a task says "show the farmer X":

1. **Do not add a field to an existing `/api/v1/app` response.** It is byte-frozen. The
   contract sweep will fail your build against recorded fixtures.
2. **Do not add a screen to `mobile-app/`.** No AA-11 task authorises it.
3. Check whether the data can ride `order_events`, the append-only stream the app already
   consumes. That is how the delivery tracker gains shipment granularity without the
   endpoint changing.
4. If it genuinely cannot, that is a programme-scope change: it goes to AA-00 §0.15 and
   is decided there, not in a pull request.

An order now splits into one shipment per supplier, each with its own sixteen-state
machine. The farmer still sees five states. `orders.status` is derived and the app is
never told the difference. Keeping that true is most of why the orders module is a
rewrite rather than an extension.

---

## 8. Rules that get a PR sent back

- A range specifier (`^`, `~`, `workspace:`, `file:`) on `@atavishaala/kit` or
  `@atavishaala/contract`. Pin exact.
- A bare `fetch` or an `axios` import in a portal. Everything goes through the kit client.
- A local type declaration duplicating a contract shape. Ask for the API change instead.
- A hand-edit to the generated OpenAPI document or client.
- A cross-module import of anything but `types.ts` in `api/src/modules/`.
- A second migration in the same PR, or an edit to an applied one.
- A float anywhere near money. Integer paise, formatted at the edge only.
- A rendered PII identifier not wrapped in `<Masked>`. There is no escape hatch, and a
  suppression comment fails CI.
- Two task IDs in one PR. The week plan stops reflecting reality within three days.
- A feature crossing a week boundary without a flag defaulting to off.

---

## 9. The ten weeks, coarsely

130 tasks across W1–W10. Detail is in AA-11; this is orientation only.

| Week | Shape |
|---|---|
| W1 | Not a setup week — it decides the rest. Repos, kit v0.1, token audiences. |
| W2 | Largest week, 18 tasks. The authorisation substrate every later week assumes. |
| W3 | First week producing something an outsider recognises as a product. |
| W4 | The week most likely to be lost. Orders rewrite and the shipment FSM, with nothing else scheduled against it. |
| W5 | Offer allocation — the only genuinely distributed decision in the system. |
| W6 | First contact with a real person outside a building. |
| W7 | Finance. Nothing in it may be approximate. |
| W8 | Two unrelated workstreams running in parallel. |
| W9 | Four CI gates that could not pass until the systems they check existed. Not polish, not buffer. |
| W10 | Lightest week, 9 tasks. No new features — pilot, runbooks, cutover, evidence. |

---

## 10. If you are still unsure

Ask in this order. Is it a write? Then it is `api/`. Would two portals need it? Then it is
`portal-kit/`. Which audience sees it — staff, supplier, delivery? That names the portal.
Does a farmer see it? Then it is probably not in scope; check §7 before writing anything.
