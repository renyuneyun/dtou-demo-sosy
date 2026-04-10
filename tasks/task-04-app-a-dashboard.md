# Task 04 — App A: Daily Wellness Journal

## Goal

Build the **Daily Wellness Journal** — a journaling/lifestyle app that imports
Alice's health metrics (heart rate, steps, sleep) as context for her daily entries.
It is a different *type* of app from Apps B and C (which are health analytics apps):
this is a personal productivity tool that happens to read health data as side context.

It reads data only — nothing leaves the Pod — and its app policy is compatible with
Alice's data policy.

**Demo talking point:** "This is a completely different kind of app — a journal, not
a health tool. Yet it still accesses Alice's health data. The DToU system works across
app categories: it checks the declared policy, not what type of app is asking."

---

## App Policy

### Turtle (`fixtures/app-policies/app-a-journal.ttl`)

Create this file alongside the data fixtures so the complete policy set is in one place.

```turtle
@prefix :      <http://example.org/ns#> .
@prefix vocab: <http://example.org/dtou-demo/vocab#> .
@prefix app:   <http://example.org/app#> .

# ── Ports ───────────────────────────────────────────────────────────────────
app:port-a-hr     a :Port ; :name "heartRateInput" .
app:port-a-steps  a :Port ; :name "stepsInput" .
app:port-a-sleep  a :Port ; :name "sleepInput" .

# ── Purpose declarations ─────────────────────────────────────────────────────
# The app declares it uses data to provide health suggestions (journaling context).
# Alice's data HAS a Purpose Tagging for this concept → no UnmatchedExpectation.
# Alice's prohibition only covers vocab:commercial-research → no ProhibitedUse.
app:a-purpose-health a :PurposeExpectation ;
    :name <urn:dtou-demo:purpose-health-suggestions> .

# ── Input specs ──────────────────────────────────────────────────────────────
# One InputSpec per data resource type.
# :data IRIs are illustrative; the app reads all resources matching the pattern.

app:a-input-hr a :InputSpec ;
    :data <http://localhost:3000/alice/health/heartrate/> ;
    :port app:port-a-hr ;
    :purpose app:a-purpose-health .

app:a-input-steps a :InputSpec ;
    :data <http://localhost:3000/alice/health/steps/> ;
    :port app:port-a-steps ;
    :purpose app:a-purpose-health .

app:a-input-sleep a :InputSpec ;
    :data <http://localhost:3000/alice/health/sleep/> ;
    :port app:port-a-sleep ;
    :purpose app:a-purpose-health .

# ── App policy ───────────────────────────────────────────────────────────────

app:WellnessJournalPolicy a :AppPolicy ;
    :name app:DailyWellnessJournal ;
    :input_spec app:a-input-hr, app:a-input-steps, app:a-input-sleep .
    # No :output_spec — health data produces no output from this app.
```

### TypeScript constant (`src/policy.ts`)

```typescript
import type { AppPolicy } from '@dtou-demo/dtou-client';
import {
  APP_WELLNESS_JOURNAL, PURPOSE_HEALTH_SUGGESTIONS, CONCEPT_HEALTH_SUGGESTIONS,
} from '@dtou-demo/dtou-client';

const APP = 'http://example.org/app#';
const mkPort = (uri: string, name: string) => ({ uri: `${APP}${uri}`, name });
const mkPurpose = (uri: string) => ({
  uri: `${VOCAB_BASE}${uri}`,
  name: `urn:dtou-demo:purpose-${uri}`,
});

export const APP_A_POLICY: AppPolicy = {
  uri: `${APP}WellnessJournalPolicy`,
  appNameUri: APP_WELLNESS_JOURNAL,
  appDisplayName: 'Daily Wellness Journal',
  description:
    'A personal journaling app. Reads your health metrics (heart rate, steps, sleep) ' +
    'as context for your daily entries. No data leaves your Pod.',
  inputs: [
    {
      uri: `${APP}a-input-hr`,
      dataUri: 'http://localhost:3000/alice/health/heartrate/',
      port: mkPort('port-a-hr', 'heartRateInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
    {
      uri: `${APP}a-input-steps`,
      dataUri: 'http://localhost:3000/alice/health/steps/',
      port: mkPort('port-a-steps', 'stepsInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
    {
      uri: `${APP}a-input-sleep`,
      dataUri: 'http://localhost:3000/alice/health/sleep/',
      port: mkPort('port-a-sleep', 'sleepInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
  ],
  outputs: [],
};
```

**Why no conflict:** App A declares only `vocab:provide-health-suggestions` as its
purpose. Alice's data HAS a matching Purpose Tagging → no `UnmatchedExpectation`.
Alice's prohibition covers only `vocab:commercial-research` → no `ProhibitedUse`. ✓

---

## Health Data Composable (`src/composables/useHealthData.ts`)

A Vue composable wrapping all data/policy fetching:

```typescript
import { ref, onMounted } from 'vue';
import {
  checkPolicy, fetchDataPolicyForDisplay, MOCK_MODE,
} from '@dtou-demo/dtou-client';
import type { DataPolicyDisplay, CompatibilityResult } from '@dtou-demo/dtou-client';
import { APP_A_POLICY } from '../policy';

export interface HeartRateRecord { time: string; bpm: number; }
export interface StepsRecord { date: string; steps: number; }
export interface SleepRecord { date: string; hours: number; quality: number; }

export interface HealthData {
  heartRate: HeartRateRecord[];
  steps: StepsRecord[];
  sleep: SleepRecord[];
}

const MOCK_DATA: HealthData = {
  heartRate: [
    { time: '08:00', bpm: 72 }, { time: '12:00', bpm: 68 }, { time: '20:00', bpm: 75 },
    { time: '08:00', bpm: 70 }, { time: '12:00', bpm: 65 }, { time: '20:00', bpm: 78 },
  ],
  steps: [
    { date: '2024-03-01', steps: 8423 },
    { date: '2024-03-02', steps: 10251 },
  ],
  sleep: [
    { date: '2024-03-01', hours: 7.5, quality: 82 },
    { date: '2024-03-02', hours: 6.5, quality: 71 },
  ],
};

export function useHealthData() {
  const loading = ref(true);
  const error = ref<string | null>(null);
  // Fetched for UI display only — not part of the reasoning flow
  const dataPolicyDisplay = ref<DataPolicyDisplay | null>(null);
  const compatibility = ref<CompatibilityResult | null>(null);
  const data = ref<HealthData | null>(null);

  onMounted(async () => {
    try {
      // Step 1: Submit app policy to the DToU server.
      // The server fetches data policies, runs N3 reasoning, and returns the result.
      compatibility.value = await checkPolicy(APP_A_POLICY);

      // Step 2 (display only): Fetch one .dtou file to show Alice's policy in the UI.
      dataPolicyDisplay.value = await fetchDataPolicyForDisplay(
        'http://localhost:3000/alice/health/heartrate/2024-03-01.ttl',
      );

      // Step 3: Only fetch actual health data if the policy check passed.
      if (compatibility.value.compatible) {
        data.value = MOCK_MODE ? MOCK_DATA : await fetchRealHealthData();
      }
    } catch (e: any) {
      error.value = e.message ?? 'Unknown error';
    } finally {
      loading.value = false;
    }
  });

  return { loading, error, dataPolicyDisplay, compatibility, data };
}

async function fetchRealHealthData(): Promise<HealthData> {
  // TODO: fetch and parse the actual .ttl resources from the Pod using n3
  return MOCK_DATA;
}
```

---

## Components

All components are Vue SFCs (`.vue` files) using `<script setup lang="ts">`.

### `src/components/PolicyPanel.vue`

Props:
```typescript
interface Props {
  appPolicy: AppPolicy;
  dataPolicies: DataPolicy[];
  result: CompatibilityResult | null;
  loading: boolean;
}
```

Render a collapsible `<details>` element containing three sub-sections:

1. **App Policy** — app name, description, input specs (as a table: Port / Purpose /
   App URI), outputs (none for App A).
2. **Data Policies** — for each policy, show its prohibition activation conditions
   (app URI + purpose URI). Keep compact.
3. **Compatibility Result**:
   - Loading: grey spinner "Checking policy…"
   - Compatible: green badge "✓ Compatible — no conflicts detected"
   - Not compatible: red badge "✗ Not Compatible" + list of conflicts

### `src/components/HealthContextSidebar.vue`

Props: `{ date: string; heartRate: HeartRateRecord[]; steps: StepsRecord[]; sleep: SleepRecord[] }`

Shows three compact stat badges for the selected date:
- Heart rate (average BPM for that day, ♥ icon)
- Steps (daily total, 👟 icon — or text)
- Sleep (hours + quality score)

### `src/components/DatePicker.vue`

Props: `{ dates: string[]; modelValue: string }`  
Emits: `update:modelValue`

A simple button strip (v-model compatible) for selecting among the two mock dates.

### `src/components/HeartRateChart.vue`, `StepsChart.vue`, `SleepChart.vue`

These are not used in App A (which is a journal, not a chart dashboard — health data
is shown as compact stats in the sidebar, not as charts). Keep visuals minimal.

---

## `src/App.vue`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useHealthData } from './composables/useHealthData'
import PolicyPanel from './components/PolicyPanel.vue'
import HealthContextSidebar from './components/HealthContextSidebar.vue'
import DatePicker from './components/DatePicker.vue'
import { APP_A_POLICY } from './policy'

const MOCK_JOURNAL: Record<string, string> = {
  '2024-03-01':
    'Productive morning — finished the literature review draft. Afternoon walk helped clear my head. Feeling good about the direction of the research.',
  '2024-03-02':
    'Long day of meetings. Skipped lunch, probably why energy was low. Need to plan better tomorrow.',
}

const { loading, error, dataPolicies, compatibility, data } = useHealthData()
const selectedDate = ref('2024-03-01')
</script>

<template>
  <div class="min-h-screen bg-amber-50">
    <header class="bg-amber-600 text-white px-6 py-4 shadow">
      <h1 class="text-2xl font-bold">Daily Wellness Journal</h1>
      <p class="text-sm opacity-75">Your reflections, enriched by your health context · Solid-DToU</p>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <PolicyPanel
        :app-policy="APP_A_POLICY"
        :data-policies="dataPolicies"
        :result="compatibility"
        :loading="loading"
      />

      <div v-if="loading" class="text-center py-12 text-amber-700">Checking data policy…</div>
      <div v-if="error" class="text-red-600 p-4 bg-red-50 rounded">{{ error }}</div>

      <div v-if="compatibility && !compatibility.compatible"
           class="bg-red-50 border border-red-300 rounded p-4">
        <h2 class="font-semibold text-red-700">Access Denied by DToU Reasoner</h2>
        <ul class="mt-2 text-sm text-red-600 list-disc list-inside">
          <li v-for="(c, i) in compatibility.conflicts" :key="i">{{ c.detail }}</li>
        </ul>
      </div>

      <template v-if="data">
        <DatePicker
          :dates="['2024-03-01', '2024-03-02']"
          v-model="selectedDate"
        />
        <div class="flex gap-6">
          <div class="flex-1 bg-white rounded-lg shadow p-6">
            <h2 class="font-semibold text-gray-700 mb-3">{{ selectedDate }} — Journal Entry</h2>
            <p class="text-gray-600 leading-relaxed italic">
              {{ MOCK_JOURNAL[selectedDate] ?? 'No entry for this date.' }}
            </p>
          </div>
          <div class="w-56 shrink-0">
            <HealthContextSidebar
              :date="selectedDate"
              :heart-rate="data.heartRate"
              :steps="data.steps"
              :sleep="data.sleep"
            />
          </div>
        </div>
      </template>
    </main>

    <footer class="text-center text-xs text-gray-400 py-6">
      Health context provided by Alice's Solid Pod via DToU
    </footer>
  </div>
</template>
```

---

## Acceptance Criteria

- App renders at `http://localhost:5101` (`npm run dev:app-a`).
- In mock mode, journal entry and health context sidebar appear for both dates.
- Date picker switches the displayed entry and stats.
- Policy panel shows green "✓ Compatible" result.
- Amber color scheme clearly distinguishes this from Apps B (green) and C (red).
- No TypeScript / Vue compile errors.
