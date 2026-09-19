# Atavishaala Portal Programme (APP-2026)

Three web portals and one backend that replace the hand-operated console behind
Atavishaala — a marketplace for farm inputs (seeds, fertiliser, pesticide, equipment)
with a Crop Advisor service.

The full specification is thirteen documents in [`docs/`](docs/). `AA-00` is the root:
if any other document contradicts it, that document is wrong.

**New here, or unsure which directory your task belongs in?**
Read [`docs/WHERE-TO-WORK.md`](docs/WHERE-TO-WORK.md) first.

## Layout

The specification (AA-01 §1.1) calls for **five separate repositories**. They are laid
out here as five top-level directories in one repository; if the split is adopted
later, each directory lifts out unchanged.

| Directory | Spec name | Stack | Deploy target |
|---|---|---|---|
| `api/` | `atavishaala-api` | Express 5, TypeScript, Prisma, Node 20 | Cloud Run (`asia-south1`) → `api.atavishaala.in` |
| `portal-kit/` | `atavishaala-portal-kit` | React 18, TypeScript, Vite library mode | GitHub Packages — `@atavishaala/kit` |
| `admin-portal/` | `atavishaala-admin-portal` | Vite, React 18, TanStack Query, Router 6 | Cloudflare Pages → `admin.atavishaala.in` |
| `supplier-portal/` | `atavishaala-supplier-portal` | same | Cloudflare Pages → `seller.atavishaala.in` |
| `fleet-portal/` | `atavishaala-fleet-portal` | same | Cloudflare Pages → `fleet.atavishaala.in` |

`mobile-app/` holds the existing React Native consumer app — the one farmers use. It is
listed in AA-00 as unchanged by this programme, carries no task in AA-11, and consumes
the frozen `/api/v1/app` surface. It is not one of the five repositories.

`docs/` holds the specification PDFs. `.github/workflows/` holds CI (twelve gates, AA-01 §1.7).

## The shape of the system

- **One writer to Postgres.** Only `api/` holds a database credential. No portal has a
  Prisma client, a `DATABASE_URL`, or any third-party secret in its dependency tree.
- **Five API namespaces**, one per audience, one token audience each:
  `/api/v1/public`, `/api/v1/app`, `/api/v1/admin`, `/api/v1/partner`, `/api/v1/fleet`.
  A token minted for one namespace is rejected on every other.
- **Two published packages, one direction.** `@atavishaala/contract` is generated from
  the backend's Zod schemas; `@atavishaala/kit` depends on it; the three portals depend
  on both, pinned to exact versions. Nothing flows back up.
- **The mobile app contract is frozen.** `/api/v1/app` responses stay byte-compatible;
  new fields go to the new namespaces.

## Conventions

Branches `feat|fix|chore/<area>-<short>`, no personal branches. Conventional commits,
scope = module or portal. One task ID per pull request. One migration per PR, never
edited once applied, forward-only. Zod schema first, then generate — generated files
are never hand-edited. Money is integer paise everywhere, formatted only at the edge.
Timestamps stored UTC, business hours computed in `Asia/Kolkata`.

Full set: AA-01 §1.6.

## Status

Scaffold only — directories and conventions, no application code yet. See
`docs/AA-11_Team_Execution_Handbook.pdf` for the week-by-week task sequence.
