# Task 06 — App C: HealthShare Pro

## Goal

Build **HealthShare Pro** — an app that reads Alice's health data and aggregates it
for commercial research purposes. Its app policy honestly declares this, and the DToU
reasoner detects the `:ProhibitedUse` conflict against Alice's data policy and
**denies access before any data is fetched**.

**Demo talking point:** "This app would send your health data to a commercial research
partner. Its app policy honestly declares `vocab:commercial-research` as its purpose.
Alice's data policy prohibits *any* app from using her health data for that purpose —
she didn't need to know this app existed when she wrote her policy. The reasoner
blocks it automatically, before any data is accessed."

---

## App Policy

### Turtle (`fixtures/app-policies/app-c-marketplace.ttl`)

```turtle
@prefix dtou:  <urn:dtou:core#> .
@prefix vocab: <urn:dtou-demo:vocab#> .
@prefix app:   <urn:dtou-demo:app#> .

# ── Ports ───────────────────────────────────────────────────────────────────
app:port-c-hr     a dtou:Port ; dtou:name "heartRateInput" .
app:port-c-steps  a dtou:Port ; dtou:name "stepsInput" .
app:port-c-sleep  a dtou:Port ; dtou:name "sleepInput" .
app:port-c-out    a dtou:Port ; dtou:name "aggregatedOutput" .

# ── Purpose declarations ─────────────────────────────────────────────────────
# App C declares BOTH purposes:
# - vocab:health-suggestions: Alice has a matching PurposeTag → passes that check
# - vocab:commercial-research: Alice has NO matching PurposeTag (UnmatchedExpectation)
#                              AND Alice has a Prohibition (ProhibitedUse)
# Both conflicts fire for the commercial-research purpose.

app:c-purpose-health a dtou:PurposeExpectation ;
    dtou:descriptor vocab:health-suggestions .

app:c-purpose-commercial a dtou:PurposeExpectation ;
    dtou:descriptor vocab:commercial-research .

# ── Input specs ──────────────────────────────────────────────────────────────
app:c-input-hr a dtou:InputSpec ;
    dtou:data <http://localhost:3000/alice/health/heartrate/> ;
    dtou:port app:port-c-hr ;
    dtou:purpose app:c-purpose-health, app:c-purpose-commercial .  # ← commercial triggers conflicts

app:c-input-steps a dtou:InputSpec ;
    dtou:data <http://localhost:3000/alice/health/steps/> ;
    dtou:port app:port-c-steps ;
    dtou:purpose app:c-purpose-health, app:c-purpose-commercial .

app:c-input-sleep a dtou:InputSpec ;
    dtou:data <http://localhost:3000/alice/health/sleep/> ;
    dtou:port app:port-c-sleep ;
    dtou:purpose app:c-purpose-health, app:c-purpose-commercial .

# ── Output spec ───────────────────────────────────────────────────────────────
# Aggregated dataset sent to external commercial service.
# dtou:refinement removes the personal-ownership attribute before forwarding
# (simulating data stripping — but still prohibited by Alice's policy).

app:c-output-aggregate a dtou:OutputSpec ;
    dtou:port app:port-c-out ;
    dtou:from app:port-c-hr, app:port-c-steps, app:port-c-sleep ;
    dtou:refinement [
        a dtou:Delete ;
        dtou:filter [
            a dtou:Filter ;
            dtou:name  vocab:health-data-personal ;
            dtou:class dtou:personal ;
            dtou:value vocab:nil
        ]
    ] .

# ── App policy ───────────────────────────────────────────────────────────────
app:HealthShareProPolicy a dtou:AppPolicy ;
    dtou:name app:HealthSharePro ;
    dtou:input_spec app:c-input-hr, app:c-input-steps, app:c-input-sleep ;
    dtou:output_spec app:c-output-aggregate .
```

**How the conflict fires:**
1. Alice's data policy prohibition: `dtou:activation_condition [ dtou:purpose vocab:commercial-research ]`
   — `dtou:app` is **omitted**, so it matches any app.
2. App C's InputSpec: `dtou:purpose app:c-purpose-commercial`, where `app:c-purpose-commercial`
   has `dtou:descriptor vocab:commercial-research` — the same shared concept URI as in
   Alice's prohibition. ✓
3. The reasoner matches on concept URI → `dtou:ProhibitedUse` fires. App C's own identity
   (`dtou:name`) is irrelevant to whether it is blocked.

### TypeScript constant (`src/policy.ts`)

```typescript
import type { AppPolicy } from '@dtou-demo/dtou-client';
import {
  APP_HEALTHSHARE_PRO,
  PURPOSE_HEALTH_SUGGESTIONS, CONCEPT_HEALTH_SUGGESTIONS,
  PURPOSE_COMMERCIAL_RESEARCH, CONCEPT_COMMERCIAL_RESEARCH,
} from '@dtou-demo/dtou-client';

const APP = 'urn:dtou-demo:app#';
const mkPort = (suffix: string, name: string) => ({ uri: `${APP}${suffix}`, name });

export const APP_C_POLICY: AppPolicy = {
  uri: `${APP}HealthShareProPolicy`,
  appNameUri: APP_HEALTHSHARE_PRO,
  appDisplayName: 'HealthShare Pro',
  description:
    'Aggregates your health data with data from other users and shares it with ' +
    'commercial health research partners. You may earn reward points.',
  inputs: [
    {
      uri: `${APP}c-input-hr`,
      dataUri: 'http://localhost:3000/alice/health/heartrate/',
      port: mkPort('port-c-hr', 'heartRateInput'),
      purposes: [
        { uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS },
        { uri: PURPOSE_COMMERCIAL_RESEARCH, name: CONCEPT_COMMERCIAL_RESEARCH },
      ],
      provides: [],
      downstreams: [],
    },
    {
      uri: `${APP}c-input-steps`,
      dataUri: 'http://localhost:3000/alice/health/steps/',
      port: mkPort('port-c-steps', 'stepsInput'),
      purposes: [
        { uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS },
        { uri: PURPOSE_COMMERCIAL_RESEARCH, name: CONCEPT_COMMERCIAL_RESEARCH },
      ],
      provides: [],
      downstreams: [],
    },
    {
      uri: `${APP}c-input-sleep`,
      dataUri: 'http://localhost:3000/alice/health/sleep/',
      port: mkPort('port-c-sleep', 'sleepInput'),
      purposes: [
        { uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS },
        { uri: PURPOSE_COMMERCIAL_RESEARCH, name: CONCEPT_COMMERCIAL_RESEARCH },
      ],
      provides: [],
      downstreams: [],
    },
  ],
  outputs: [
    {
      uri: `${APP}c-output-aggregate`,
      port: mkPort('port-c-out', 'aggregatedOutput'),
      fromPorts: [`${APP}port-c-hr`, `${APP}port-c-steps`, `${APP}port-c-sleep`],
      refinements: [
        {
          type: 'Delete',
          filter: {
            name: 'urn:dtou-demo:vocab#health-data-personal',
            cls: 'personal',
            value: 'nil',
          },
        },
      ],
    },
  ],
};
```

---

## UI Layout

The app has a deliberate "corporate" look (to feel like a real commercial service)
contrasting with the clean, personal look of Apps A and B.

**Header:** dark rose (`bg-rose-700`), "HealthShare Pro™", tagline: "Your health data
powers tomorrow's medical breakthroughs."

**Policy Panel:** shown prominently at the top with red "✗ Not Compatible" result.
This is the centre of the demo moment.

**Blocked state panel:** replaces the entire data section:
```
┌─────────────────────────────────────────────────────────────┐
│  🚫  Access Blocked by DToU Reasoner                        │
│                                                             │
│  [Conflict Card: ProhibitedUse]                             │
│                                                             │
│  ℹ  No data was accessed. The check ran before any         │
│     request was made to Alice's Pod.                        │
└─────────────────────────────────────────────────────────────┘
```

**Contrast note** at the bottom of the page:
```
Without DToU, you would need to read HealthShare Pro's privacy policy to know
this is happening. DToU checked it automatically, before any data was touched.
```

---

## Components

### `src/components/PolicyPanel.vue`
Same as Apps A and B. Copy the component.

### `src/components/ConflictCard.vue`

Props: `{ conflict: Conflict }`

Renders a red card:

```
┌────────────────────────────────────────────────────────────┐
│  ✗  Conflict: ProhibitedUse                                │
│                                                            │
│  App "HealthShare Pro" is prohibited from using            │
│  Alice's health data with purpose:                         │
│  vocab:commercial-research                                 │
│                                                            │
│  Triggered by: Alice's data policy prohibition             │
│  Activation condition:                                     │
│    :purpose vocab:commercial-research                      │
│    (:app omitted — matches any app)                        │
└────────────────────────────────────────────────────────────┘
```

Show the activation condition in a monospace code block. The `:app omitted` note
is important for the demo — it emphasises that Alice blocked this *purpose*, not
this specific app by name.

---

## `src/App.vue`

```vue
<script setup lang="ts">
import { useHealthData } from './composables/useHealthData'
import PolicyPanel from './components/PolicyPanel.vue'
import ConflictCard from './components/ConflictCard.vue'
import { APP_C_POLICY } from './policy'

const { loading, dataPolicies, compatibility } = useHealthData()
</script>

<template>
  <div class="min-h-screen bg-rose-50">
    <header class="bg-rose-700 text-white px-6 py-4 shadow">
      <h1 class="text-2xl font-bold">HealthShare Pro™</h1>
      <p class="text-sm opacity-75">Your health data powers tomorrow's medical breakthroughs.</p>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <PolicyPanel
        :app-policy="APP_C_POLICY"
        :data-policies="dataPolicies"
        :result="compatibility"
        :loading="loading"
      />

      <div v-if="loading" class="text-center py-8 text-rose-700">Checking policy…</div>

      <div v-if="compatibility && !compatibility.compatible"
           class="bg-red-50 border-2 border-red-400 rounded-lg p-6 space-y-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🚫</span>
          <h2 class="text-xl font-bold text-red-700">Access Blocked by DToU Reasoner</h2>
        </div>

        <ConflictCard
          v-for="(c, i) in compatibility.conflicts"
          :key="i"
          :conflict="c"
        />

        <p class="text-sm text-red-600 bg-red-100 rounded p-3">
          No data was accessed. The compatibility check ran before any request
          was made to Alice's Pod.
        </p>
      </div>

      <!-- This section intentionally never renders: policy check always fails for App C -->
      <div v-if="compatibility?.compatible" class="text-green-700 p-4">
        (This should not appear in the demo.)
      </div>
    </main>

    <footer class="max-w-3xl mx-auto px-4 pb-8">
      <div class="bg-gray-100 rounded p-4 text-sm text-gray-600 border border-gray-300">
        <strong>Without DToU:</strong> You would need to read HealthShare Pro's privacy policy
        to know this would happen. DToU checked it automatically — before any data was touched.
      </div>
    </footer>
  </div>
</template>
```

---

## Acceptance Criteria

- App renders at `http://localhost:5103` (`npm run dev:app-c`).
- Policy panel shows red "✗ Not Compatible — 1 conflict detected".
- `ConflictCard` shows `ProhibitedUse` type with the activation condition details.
- No health data is shown (the data section never renders).
- The contrast note is visible.
- Rose/red color scheme distinguishes this from Apps A (amber) and B (green).
- No TypeScript / Vue compile errors.
