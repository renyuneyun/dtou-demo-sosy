# Task Overview & Agent Instructions

## Execution Order

Tasks must run in order — each builds on the previous:

```
01 → 02 → 03 → 04 → 05 → 06 → 07
```

Do not start a task until all prior tasks are complete and compile cleanly.

---

## Key Unknown: The `/dtou` Server Endpoint

**This is the most important thing to verify before implementing task-03.**

The `checkPolicy()` function in `dtouApi.ts` calls the solid-dtou server's DToU
endpoint. The spec says the path is roughly `/dtou` and the method is `POST`, but
the exact:
- URL path
- Request body format (Turtle? JSON-LD? multipart?)
- Response body format (Turtle with `:Conflict` triples? JSON?)
- Authentication mechanism

…are not fully specified in the publicly available spec. Before finalizing task-03,
consult:
- https://github.com/renyuneyun/solid-dtou (server implementation)
- The previous demo app linked from that repo (Vue client showing real API usage)

The `parseServerResult()` function in task-03 has a prominent TODO for exactly this.
All three apps fall back gracefully to mock mode (`VITE_DTOU_MOCK=true`) when the
server is unavailable, so the demo works offline regardless.

---

## Cross-Task Consistency Points

### Shared vocabulary URIs
The following URIs must be identical across all files — do not change them:

| Concept | PurposeExpectation resource | `:name` (concept URI) |
|---------|----------------------------|-----------------------|
| Health suggestions | `http://example.org/dtou-demo/vocab#provide-health-suggestions` | `urn:dtou-demo:purpose-health-suggestions` |
| Commercial research | `http://example.org/dtou-demo/vocab#commercial-research` | `urn:dtou-demo:purpose-commercial-research` |

These URIs appear in: `fixtures/vocab.ttl`, all six `.dtou` files, all three
`fixtures/app-policies/*.ttl` files, and the TypeScript constants in `vocab.ts`.

### App policy URIs
| App | `:name` URI (AppPolicy) | Used in… |
|-----|------------------------|----------|
| App A | `http://example.org/app#DailyWellnessJournal` | app-a policy Turtle + TypeScript |
| App B | `http://example.org/app#HealthInsights` | app-b policy Turtle + TypeScript |
| App C | `http://example.org/app#HealthSharePro` | app-c policy Turtle + TypeScript + Alice's prohibition (irrelevant — prohibition has no `:app`) |

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

- All apps default to `VITE_DTOU_MOCK=true` — the demo works without any server.
- Copy `.env.example` → `.env` to change settings.
- To test against a real server: set `VITE_DTOU_MOCK=false` and `VITE_SOLID_SERVER`
  to your CSS+solid-dtou instance URL.

---

## Ports

| App | Port |
|-----|------|
| Demo shell | 5100 |
| App A (journal) | 5101 |
| App B (insights) | 5102 |
| App C (marketplace) | 5103 |
