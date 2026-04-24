# Task Overview & Agent Instructions

## Execution Order

Tasks must run in order — each builds on the previous:

```
01 → 02 → 03 → 04 → 05 → 06 → 07
```

Do not start a task until all prior tasks are complete and compile cleanly.

---

## The `/dtou` Server Endpoint

The `checkPolicy()` function in `dtouApi.ts` calls the solid-dtou server:

- **POST** `/dtou` — body: `{ policy: <Turtle string> }` (JSON wrapper)
- **GET** `/dtou/compliance` — returns Turtle with reasoning result
- Response Turtle uses `urn:dtou:core#Conflict`, `urn:dtou:core#ProhibitedUse`,
  `urn:dtou:core#UnmatchedExpectation` triples
- `parseServerResult()` parses the Turtle with n3 and extracts typed conflicts

All three apps fall back gracefully to mock mode (`VITE_DTOU_MOCK=true`) when the
server is unavailable, so the demo works offline regardless.

---

## DToU Tag Terminology

DToU contains a tag-based language for expressing certain aspects of the usage policy. The hierarchy can be confusing — here is the canonical breakdown:

- **Tag** — umbrella class; covers both **Tagging** and **Requirement**
  - **Tagging** — informational; the app *expects* to find it on data.
    If declared but absent, `UnmatchedExpectation` fires.
    - **Purpose** (`dtou:PurposeTag`) — the most common Tagging type.
      Uses `dtou:purpose` shorthand on `dtou:InputSpec`.
      Matched by concept URI: `dtou:descriptor` (app) vs `dtou:class` (data attribute).
  - **Requirement** — mandatory; the app must *provide* a matching value.
    If not provided, `UnsatisfiedRequirement` fires.
    - **Security** (`dtou:SecurityProvide`) (or equivalently, `dtou:SecurityTag`) — the most common Requirement type.

- **Prohibition** (`dtou:Prohibition`) — independently of tags, blocks a purpose.
  `ProhibitedUse` fires if the app's `dtou:purpose` matches the prohibition's
  `dtou:activation_condition`. `dtou:app` can be omitted to match any app.

**Three conflict types** (all `rdfs:subClassOf dtou:Conflict`):
| Type | Cause |
|------|-------|
| `dtou:UnmatchedExpectation` | App expects a tag the data doesn't have |
| `dtou:UnsatisfiedRequirement` | App fails to provide what the data requires |
| `dtou:ProhibitedUse` | App uses data for a prohibited action |

---

## Cross-Task Consistency Points

### Namespace scheme
All files use the following namespaces:

| Prefix | URI | Used for |
|--------|-----|---------|
| `dtou:` | `urn:dtou:core#` | DToU core types and predicates |
| `demo:` | `urn:dtou-demo:` | Internal policy node identifiers |
| `vocab:` | `urn:dtou-demo:vocab#` | Shared demo vocabulary (concepts, app names) |
| `app:` | `urn:dtou-demo:app#` | App-specific node identifiers |

### Shared vocabulary URIs
The following concept URIs must be identical across all files — do not change them.
They are defined in `fixtures/vocab.ttl` (as `rdfs:subClassOf dpv:Purpose`) and
referenced by both the data policies and app policies:

| Concept | Concept URI (`dtou:descriptor` / `dtou:class`) |
|---------|-----------------------------------------------|
| Health suggestions | `urn:dtou-demo:vocab#health-suggestions` |
| Commercial research | `urn:dtou-demo:vocab#commercial-research` |

Each app additionally uses a local `PurposeExpectation` node URI (with `app:` prefix
in Turtle fixtures, or `urn:dtou-demo:vocab#purpose-*` in the TypeScript constants via
`PURPOSE_HEALTH_SUGGESTIONS` / `PURPOSE_COMMERCIAL_RESEARCH`). These PE node URIs are
defined locally within each app policy, not in `vocab.ttl`.

These concept URIs appear in: `fixtures/vocab.ttl` (definitions), all `container.dtou`
files (`dtou:class`), all three `fixtures/app-policies/*.ttl` files (`dtou:descriptor`),
and the TypeScript `CONCEPT_*` constants in `vocab.ts`.

### App policy URIs
| App | `dtou:name` URI (AppPolicy) | Used in… |
|-----|-----------------------------|----------|
| App A | `urn:dtou-demo:app#DailyWellnessJournal` | app-a policy Turtle + TypeScript |
| App B | `urn:dtou-demo:app#HealthInsights` | app-b policy Turtle + TypeScript |
| App C | `urn:dtou-demo:app#HealthSharePro` | app-c policy Turtle + TypeScript |

### `fixtures/app-policies/` directory
Tasks 04, 05, 06 each create a Turtle file in `fixtures/app-policies/`. This
directory is not created in task-01 or task-02. Create it as part of the first
task that needs it (task-04), or add it to task-02.

### `PolicyPanel.vue` component
This component is described in task-04 and referenced in tasks 05 and 06 as
"copy the component." For the demo, this duplication is acceptable. If you prefer,
move it to `packages/dtou-client/src/vue/PolicyPanel.vue` and share it — but that
requires Vue to be a dependency of the shared package, which adds complexity.

### `useHealthData` composable
Each app has its own version (different app policy, different mock data). Tasks 05
and 06 follow the same pattern as task-04 but reference their own policy constant
and any app-specific state (e.g. task-05 adds `report` and `saved` state on top).

---

## Default Behaviour

- All apps have `.env` set to `VITE_DTOU_MOCK=false` and `VITE_SOLID_SERVER=http://localhost:3000`.
- For offline demo (no server): set `VITE_DTOU_MOCK=true` in each app's `.env`.
- Data policies are uploaded to the live server via `fixtures/setup.sh`.

---

## Ports

| App | Port |
|-----|------|
| Demo shell | 5100 |
| App A (journal) | 5101 |
| App B (insights) | 5102 |
| App C (marketplace) | 5103 |
