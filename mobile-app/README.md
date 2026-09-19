# atavishaala-mobile (FarmMarket consumer app)

React Native. The app farmers actually use: browse, order, pay, track, request Advisor
help, review. Consumes `/api/v1/app` only.

Specification: `docs/AA-00` §0.2 (audiences), `docs/AA-04` (the frozen surface),
`docs/AA-02` §2.2.1 (what "byte-compatible" obliges).

## Read this before touching anything here

**This app already exists and ships today.** AA-00 lists it as *unchanged by this
programme*. It is not one of the five repositories in AA-01 §1.1 and no task in the
AA-11 handbook is assigned to it. The directory exists so the code has a home in this
tree and so the app's constraints are written down next to everyone else's — not because
the ten-week programme builds it.

If you are a front-end engineer looking for your first task, **it is not in this
directory**. See [`docs/WHERE-TO-WORK.md`](../docs/WHERE-TO-WORK.md).

## The constraint that governs this directory

`/api/v1/app` is a **closed set** and its responses are **byte-compatible**, not merely
source-compatible: same field names, same field order, same types, same absent fields
absent, before and after the programme.

The reason is concrete. There is a build in the field whose update cadence nobody
controls. A farmer who does not update for six weeks is a farmer whose parser must keep
working. So:

- The backend never adds a field to an existing app route. New data goes to
  `/api/v1/admin`, `/api/v1/partner` or `/api/v1/fleet`.
- Where the app genuinely must show something new — the delivery tracker gaining
  shipment-level detail — it reads `order_events`, an append-only stream it already
  consumes. The event shape is new; the endpoint is not.
- The contract sweep in CI asserts the app's catalog responses are byte-identical
  against recorded fixtures. A change here that moves them fails the build.

The farmer keeps seeing the same five-state order status even though an order now splits
into per-supplier shipments underneath. `orders.status` is derived; the app is not told.

## What this app does not share

It does **not** consume `@atavishaala/kit`. The kit is a portal design system built for
staff and business users on desktop browsers; this app has its own design system
(AA-00 §0.3: "all four consume `@atavishaala/kit` **or the app design system**").
Importing the kit here would drag React DOM into a React Native bundle.

It **may** consume `@atavishaala/contract` for request and response types, pinned exact
like everywhere else. Types are safe to share; components are not.

## Layout

    src/screens/      one directory per screen
    src/components/   app design system
    src/navigation/   navigator tree
    src/api/          the app client — `/api/v1/app` and nothing else

## Rules it shares with the portals

Integer paise everywhere, formatted only at the edge. Timestamps stored UTC, business
hours computed in `Asia/Kolkata`, never trust the device clock for an SLA. No secret in
the bundle — a React Native bundle is as readable as a web one. No masked-PII field ever
logged, even masked: log identifiers, not values.
