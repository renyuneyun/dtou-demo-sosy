# Task 03 — DToU Client Library (`packages/dtou-client`)

## Goal

Implement the shared TypeScript client library used by all three demo apps.
Its primary job is to call the Solid-DToU server's `/dtou` endpoint with the app's
policy and receive back the reasoning result. **All reasoning happens server-side.**

---

## Architecture (important)

```
  App (browser)                        CSS + solid-dtou server
  ─────────────                        ────────────────────────
  1. Serialize app policy → Turtle
  2. POST /dtou  ──────────────────→  3. Receive app policy
                                       4. Generate usage context
                                          (WebID + timestamp)
                                       5. Fetch data policies
                                          (.dtou files from Pod)
                                       6. Run N3 reasoning (EYE)
                                       7. Return result JSON/Turtle
  8. Parse result  ←──────────────────
  9. Display in UI
```

The client:
- Serializes and submits the app policy (step 1–2)
- Parses and displays the reasoning result (step 8–9)
- Optionally fetches `.dtou` files to display them in the UI as information
  (this is purely for the demo's "show Alice's data policy" panel; it is
   separate from the actual reasoning flow)

The client does **not**:
- Fetch `.dtou` files as part of the policy check
- Run any N3 reasoning
- Decide compatibility

For a live demo without a server (`VITE_DTOU_MOCK=true`), hard-coded mock
responses stand in for the server call.

---

## Files

```
packages/dtou-client/src/
  index.ts          (barrel)
  types.ts          (TypeScript interfaces)
  config.ts         (env vars)
  vocab.ts          (shared vocabulary constants)
  policy.ts         (AppPolicy builder + Turtle serializer)
  dtouApi.ts        (POST /dtou — the main integration point)
  displayFetch.ts   (optional: fetch .dtou files for UI display only)
  mock.ts           (hard-coded mock responses)
```

---

## `types.ts`

```typescript
// ── App Policy types ────────────────────────────────────────────────────────

export interface Port {
  uri: string;
  name: string;   // :name string value
}

export interface PurposeExpectation {
  uri: string;    // resource IRI (shared vocab, e.g. vocab:provide-health-suggestions)
  name: string;   // :name — shared concept URI (e.g. urn:dtou-demo:purpose-health-suggestions)
}

export interface SecurityProvide {
  uri: string;
  name: string;
}

export interface DownstreamSpec {
  uri: string;
  appName: string;
  purposes: PurposeExpectation[];
}

export interface AppInputSpec {
  uri: string;
  dataUri: string;
  port: Port;
  purposes: PurposeExpectation[];
  provides: SecurityProvide[];
  downstreams: DownstreamSpec[];
}

export interface Refinement {
  type: 'Delete' | 'Edit';
  filter?: { name?: string; cls?: string; value?: string };
}

export interface AppOutputSpec {
  uri: string;
  port: Port;
  fromPorts: string[];   // input port URIs
  refinements: Refinement[];
}

/** The full app policy — serialized to Turtle and sent to the server */
export interface AppPolicy {
  uri: string;           // IRI of the :AppPolicy resource
  appNameUri: string;    // :name — the app's identifying URI
  appDisplayName: string;
  description: string;
  inputs: AppInputSpec[];
  outputs: AppOutputSpec[];
}

// ── Reasoning result types (returned by the server) ─────────────────────────

export type ConflictType =
  | 'ProhibitedUse'
  | 'UnsatisfiedRequirement'
  | 'UnmatchedExpectation';

export interface Conflict {
  type: ConflictType;
  detail: string;
}

export interface ActivatedObligation {
  obligationClass: string;
  triggeredByPurpose: string;
  args: string[];
}

export interface CompatibilityResult {
  compatible: boolean;
  conflicts: Conflict[];
  activatedObligations: ActivatedObligation[];
  summary: string;
}

// ── Display-only types (for the UI policy panel) ─────────────────────────────

/** A parsed data policy fetched for UI display purposes only */
export interface DataPolicyDisplay {
  resourceUrl: string;
  raw: string;           // raw Turtle text shown in the UI
}
```

---

## `config.ts`

```typescript
export const SOLID_SERVER: string =
  (import.meta as any).env?.VITE_SOLID_SERVER ?? 'http://localhost:3000';

/** When true, skip the server call and return hard-coded mock results */
export const MOCK_MODE: boolean =
  ((import.meta as any).env?.VITE_DTOU_MOCK ?? 'true') === 'true';
```

---

## `vocab.ts`

```typescript
export const VOCAB_BASE = 'http://example.org/dtou-demo/vocab#';
export const URN_BASE   = 'urn:dtou-demo:';
export const APP_BASE   = 'http://example.org/app#';

// PurposeExpectation resource URIs (used in InputSpec :purpose)
export const PURPOSE_HEALTH_SUGGESTIONS: string  = `${VOCAB_BASE}provide-health-suggestions`;
export const PURPOSE_COMMERCIAL_RESEARCH: string = `${VOCAB_BASE}commercial-research`;

// Concept name URIs (:name on PurposeExpectation = :class on Attribute in data policy)
export const CONCEPT_HEALTH_SUGGESTIONS: string  = `${URN_BASE}purpose-health-suggestions`;
export const CONCEPT_COMMERCIAL_RESEARCH: string = `${URN_BASE}purpose-commercial-research`;

export const APP_HEALTHSHARE_PRO: string  = `${APP_BASE}HealthSharePro`;
export const APP_WELLNESS_JOURNAL: string = `${APP_BASE}DailyWellnessJournal`;
export const APP_HEALTH_INSIGHTS: string  = `${APP_BASE}HealthInsights`;
```

---

## `policy.ts`

### `serializeAppPolicy(policy: AppPolicy): string`

Converts an `AppPolicy` to Turtle using `n3`'s Writer. This Turtle is what
gets sent to the server.

Key output structure (see fixtures/app-policies/*.ttl for reference):
```turtle
@prefix :      <http://example.org/ns#> .
@prefix vocab: <http://example.org/dtou-demo/vocab#> .
@prefix app:   <http://example.org/app#> .

<portUri> a :Port ; :name "portName" .
<purposeUri> a :PurposeExpectation ; :name <conceptUri> .

<inputSpecUri> a :InputSpec ;
    :data <dataUri> ;
    :port <portUri> ;
    :purpose <purposeUri> .

<outputSpecUri> a :OutputSpec ;
    :port <outPortUri> ;
    :from <inPort1>, <inPort2> .

<policyUri> a :AppPolicy ;
    :name <appNameUri> ;
    :input_spec <inputSpecUri> ;
    :output_spec <outputSpecUri> .
```

Implement the serializer to iterate over `AppPolicy.inputs` and `AppPolicy.outputs`
and produce valid Turtle. Use `n3`'s `Writer` class.

> **Note:** Check the exact Turtle structure expected by the server against the
> live implementation at https://github.com/renyuneyun/solid-dtou before
> finalizing this serializer. The fixtures in `fixtures/app-policies/*.ttl`
> serve as the reference.

---

## `dtouApi.ts` — The main integration point

### `checkPolicy(policy: AppPolicy, accessToken?: string): Promise<CompatibilityResult>`

This is the core function. It:
1. Serializes the app policy to Turtle
2. POSTs it to the server's DToU endpoint
3. Parses the response into a `CompatibilityResult`

```typescript
import { serializeAppPolicy } from './policy.js';
import type { AppPolicy, CompatibilityResult } from './types.js';
import { SOLID_SERVER, MOCK_MODE } from './config.js';
import { getMockCompatibility } from './mock.js';

/**
 * Submit the app policy to the DToU server and get back the reasoning result.
 *
 * The server:
 * - Receives the app policy Turtle
 * - Generates a usage context (user WebID + timestamp)
 * - Fetches the relevant data policies (.dtou files) from the Pod
 * - Runs N3 reasoning (EYE reasoner) server-side
 * - Returns the compatibility result
 *
 * The client does NOT do any reasoning itself.
 */
export async function checkPolicy(
  policy: AppPolicy,
  accessToken?: string,
): Promise<CompatibilityResult> {
  if (MOCK_MODE) {
    return getMockCompatibility(policy.appNameUri);
  }

  const policyTurtle = serializeAppPolicy(policy);

  // NOTE: The exact endpoint path and request format must be verified against
  // the live solid-dtou server implementation. The path '/dtou' is a best
  // estimate from the spec. Check https://github.com/renyuneyun/solid-dtou
  // for the actual endpoint.
  const endpoint = `${SOLID_SERVER}/dtou`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/turtle',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: policyTurtle,
  });

  if (!res.ok) {
    throw new Error(`DToU server returned ${res.status}: ${await res.text()}`);
  }

  const body = await res.text();
  return parseServerResult(body);
}

/**
 * Parse the server's reasoning result.
 * The exact response format (JSON-LD, Turtle, plain JSON) needs to be verified
 * against the actual server implementation. This is a placeholder parser.
 */
function parseServerResult(body: string): CompatibilityResult {
  // TODO: implement based on actual server response format.
  // The server likely returns Turtle or JSON containing :Conflict instances,
  // :ActivatedObligation instances, and output policy triples.
  // For now, attempt JSON parse as a guess:
  try {
    const json = JSON.parse(body);
    return {
      compatible: json.compatible ?? true,
      conflicts: json.conflicts ?? [],
      activatedObligations: json.activatedObligations ?? [],
      summary: json.summary ?? (json.compatible ? 'Compatible.' : 'Conflicts detected.'),
    };
  } catch {
    // If not JSON, inspect for conflict indicators in Turtle
    const hasConflict = body.includes(':Conflict') || body.includes(':ProhibitedUse') ||
      body.includes(':UnmatchedExpectation') || body.includes(':UnsatisfiedRequirement');
    return {
      compatible: !hasConflict,
      conflicts: hasConflict
        ? [{ type: 'ProhibitedUse', detail: 'Server reported a conflict (raw response).' }]
        : [],
      activatedObligations: [],
      summary: hasConflict ? 'Conflicts detected.' : 'Compatible.',
    };
  }
}
```

---

## `displayFetch.ts` — UI display only

This is separate from the policy check flow and is used **only to show Alice's
data policy Turtle in the UI policy panel**. It has no effect on reasoning.

```typescript
import type { DataPolicyDisplay } from './types.js';
import { MOCK_MODE } from './config.js';

const MOCK_DTOU_TURTLE = `@prefix :      <http://example.org/ns#> .
@prefix demo:  <http://example.org/dtou-demo#> .
@prefix vocab: <http://example.org/dtou-demo/vocab#> .

demo:attr-health-suggest a :Attribute ;
    :name  demo:health-suggest-id ;
    :class <urn:dtou-demo:purpose-health-suggestions> ;
    :value :nil .

demo:tagging-health-suggest a :Purpose ;
    :attribute_ref demo:attr-health-suggest .

demo:prohibition-commercial a :Prohibition ;
    :mode :Use ;
    :activation_condition [
        :purpose vocab:commercial-research
    ] .

demo:health-data-policy a :DataPolicy ;
    :attribute   demo:attr-health-suggest ;
    :tag         demo:tagging-health-suggest ;
    :prohibition demo:prohibition-commercial .`;

/**
 * Fetch a .dtou file for UI display purposes only.
 * This is NOT part of the policy check flow — just for showing the policy
 * to the user in the demo's information panel.
 */
export async function fetchDataPolicyForDisplay(
  resourceUrl: string,
): Promise<DataPolicyDisplay> {
  if (MOCK_MODE) {
    return { resourceUrl, raw: MOCK_DTOU_TURTLE };
  }

  const policyUrl = `${resourceUrl}.dtou`;
  try {
    const res = await fetch(policyUrl, { headers: { Accept: 'text/turtle' } });
    const raw = res.ok ? await res.text() : `# Could not fetch: ${policyUrl}`;
    return { resourceUrl, raw };
  } catch {
    return { resourceUrl, raw: `# Could not fetch: ${policyUrl}` };
  }
}
```

---

## `mock.ts`

```typescript
import type { CompatibilityResult } from './types.js';
import { APP_HEALTHSHARE_PRO } from './vocab.js';

export function getMockCompatibility(appNameUri: string): CompatibilityResult {
  if (appNameUri === APP_HEALTHSHARE_PRO) {
    return {
      compatible: false,
      conflicts: [
        {
          type: 'UnmatchedExpectation',
          detail:
            'App "HealthShare Pro" declares purpose vocab:commercial-research, but ' +
            "Alice's health data has no Purpose Tagging for that concept. " +
            "Alice has not tagged her data as suitable for commercial research.",
        },
        {
          type: 'ProhibitedUse',
          detail:
            "App \"HealthShare Pro\" is additionally prohibited from using Alice's " +
            'health data with purpose vocab:commercial-research. ' +
            "Alice's prohibition has no :app restriction — it blocks any app " +
            'that declares this purpose.',
        },
      ],
      activatedObligations: [],
      summary: '2 conflicts detected — access denied.',
    };
  }
  return {
    compatible: true,
    conflicts: [],
    activatedObligations: [],
    summary: 'No conflicts — app policy is compatible.',
  };
}
```

---

## `index.ts`

```typescript
export * from './types.js';
export * from './config.js';
export * from './vocab.js';
export * from './policy.js';
export * from './dtouApi.js';
export * from './displayFetch.js';
export { getMockCompatibility } from './mock.js';
```

---

## Acceptance Criteria

- TypeScript compiles without errors.
- `checkPolicy` in mock mode returns `compatible: true` for App A/B and `compatible: false`
  (2 conflicts) for App C.
- `serializeAppPolicy` produces valid Turtle parseable by `n3`.
- `fetchDataPolicyForDisplay` is clearly separate from `checkPolicy` — it is never
  called as part of a policy check, only for UI display.
- The `parseServerResult` function has a prominent TODO noting the response format
  needs verification against the actual server.
- No local N3 reasoning is performed anywhere in the library.
