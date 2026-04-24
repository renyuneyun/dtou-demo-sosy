# Task 05 — App B: Health Insights

## Goal

Build **Health Insights** — an app that reads Alice's health data, runs a simple
analysis, and writes a generated insights report back to Alice's Pod.
The key DToU feature demonstrated here is **policy derivation**: the output report
automatically inherits Alice's data policy via the OutputSpec's `:from` mechanism.

**Demo talking point:** "This app writes new data to Alice's Pod. But its app policy
declares exactly which input data the output derives from. The DToU reasoner
automatically derives the output's policy — the report is governed by the same
constraints as Alice's original health data. No extra setup needed."

---

## App Policy

### Turtle (`fixtures/app-policies/app-b-insights.ttl`)

```turtle
@prefix dtou:  <urn:dtou:core#> .
@prefix vocab: <urn:dtou-demo:vocab#> .
@prefix app:   <urn:dtou-demo:app#> .

# ── Ports ───────────────────────────────────────────────────────────────────
app:port-b-hr     a dtou:Port ; dtou:name "heartRateInput" .
app:port-b-steps  a dtou:Port ; dtou:name "stepsInput" .
app:port-b-sleep  a dtou:Port ; dtou:name "sleepInput" .
app:port-b-out    a dtou:Port ; dtou:name "insightsOutput" .

# ── Purpose declarations ─────────────────────────────────────────────────────
app:b-purpose-personal a dtou:PurposeExpectation ;
    dtou:descriptor vocab:health-suggestions .

# ── Input specs ──────────────────────────────────────────────────────────────
app:b-input-hr a dtou:InputSpec ;
    dtou:data <http://localhost:3000/alice/health/heartrate/> ;
    dtou:port app:port-b-hr ;
    dtou:purpose app:b-purpose-personal .

app:b-input-steps a dtou:InputSpec ;
    dtou:data <http://localhost:3000/alice/health/steps/> ;
    dtou:port app:port-b-steps ;
    dtou:purpose app:b-purpose-personal .

app:b-input-sleep a dtou:InputSpec ;
    dtou:data <http://localhost:3000/alice/health/sleep/> ;
    dtou:port app:port-b-sleep ;
    dtou:purpose app:b-purpose-personal .

# ── Output spec ───────────────────────────────────────────────────────────────
# The insights report derives from all three input ports.
# No dtou:refinement → all policy attributes from the input policies are inherited.
# The DToU reasoner derives output attributes/tags/prohibitions via OutputAttribute/OutputTagging rules.

app:b-output-insights a dtou:OutputSpec ;
    dtou:port app:port-b-out ;
    dtou:from app:port-b-hr, app:port-b-steps, app:port-b-sleep .

# ── App policy ───────────────────────────────────────────────────────────────
app:HealthInsightsPolicy a dtou:AppPolicy ;
    dtou:name app:HealthInsights ;
    dtou:input_spec app:b-input-hr, app:b-input-steps, app:b-input-sleep ;
    dtou:output_spec app:b-output-insights .
```

**Why no conflict:** App B declares only `vocab:health-suggestions` as its concept.
Alice's data HAS a matching PurposeTag → no `UnmatchedExpectation`. Alice's prohibition
covers only `vocab:commercial-research` → no `ProhibitedUse`. ✓

**Policy derivation:** The output port `app:port-b-out` derives from all three input
ports. The DToU reasoner computes `OutputAttribute`, `OutputTagging`, and
`OutputProhibition` instances for the output, inheriting Alice's prohibition. This
means the saved report at `/alice/health/insights/report.ttl` will carry the same
prohibition — any future app accessing the report faces the same constraints.

### TypeScript constant (`src/policy.ts`)

```typescript
import type { AppPolicy } from '@dtou-demo/dtou-client';
import { APP_HEALTH_INSIGHTS, PURPOSE_HEALTH_SUGGESTIONS, CONCEPT_HEALTH_SUGGESTIONS } from '@dtou-demo/dtou-client';

const APP = 'urn:dtou-demo:app#';
const mkPort = (suffix: string, name: string) => ({ uri: `${APP}${suffix}`, name });

export const APP_B_POLICY: AppPolicy = {
  uri: `${APP}HealthInsightsPolicy`,
  appNameUri: APP_HEALTH_INSIGHTS,
  appDisplayName: 'Health Insights',
  description:
    'Analyzes your health data and generates a personalized insights report. ' +
    'The report is written back to your Pod and inherits your data policy ' +
    'automatically via DToU policy derivation.',
  inputs: [
    {
      uri: `${APP}b-input-hr`,
      dataUri: 'http://localhost:3000/alice/health/heartrate/',
      port: mkPort('port-b-hr', 'heartRateInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
    {
      uri: `${APP}b-input-steps`,
      dataUri: 'http://localhost:3000/alice/health/steps/',
      port: mkPort('port-b-steps', 'stepsInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
    {
      uri: `${APP}b-input-sleep`,
      dataUri: 'http://localhost:3000/alice/health/sleep/',
      port: mkPort('port-b-sleep', 'sleepInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
  ],
  outputs: [
    {
      uri: `${APP}b-output-insights`,
      port: mkPort('port-b-out', 'insightsOutput'),
      fromPorts: [`${APP}port-b-hr`, `${APP}port-b-steps`, `${APP}port-b-sleep`],
      refinements: [],  // no deletion = full policy inheritance
    },
  ],
};
```

---

## Insight Generation (`src/insights.ts`)

```typescript
export interface InsightsReport {
  avgHeartRate: number;
  avgSteps: number;
  totalSteps: number;
  avgSleepHours: number;
  avgSleepQuality: number;
  narrative: string;
  generatedAt: string;
}

export function generateInsights(
  heartRate: { bpm: number }[],
  steps: { steps: number }[],
  sleep: { hours: number; quality: number }[],
): InsightsReport {
  const avgHR = Math.round(heartRate.reduce((s, r) => s + r.bpm, 0) / heartRate.length);
  const totalSteps = steps.reduce((s, r) => s + r.steps, 0);
  const avgSteps = Math.round(totalSteps / steps.length);
  const avgSleep = parseFloat((sleep.reduce((s, r) => s + r.hours, 0) / sleep.length).toFixed(1));
  const avgQuality = Math.round(sleep.reduce((s, r) => s + r.quality, 0) / sleep.length);

  const parts: string[] = [];
  parts.push(avgHR < 75 ? 'Heart rate is in a healthy range.' : 'Heart rate is slightly elevated.');
  parts.push(avgSteps >= 10000 ? 'You\'re hitting the 10,000-steps goal!' : 'Consider increasing daily steps.');
  parts.push(avgSleep >= 7 ? 'Sleep duration is healthy.' : 'Aim for 7–8 hours of sleep.');
  parts.push(avgQuality >= 75 ? 'Sleep quality looks good.' : 'Sleep quality could be improved.');

  return {
    avgHeartRate: avgHR,
    avgSteps,
    totalSteps,
    avgSleepHours: avgSleep,
    avgSleepQuality: avgQuality,
    narrative: parts.join(' '),
    generatedAt: new Date().toISOString(),
  };
}

/** Serialize the report as Turtle for saving to the Pod */
export function reportToTurtle(report: InsightsReport): string {
  return `@prefix health: <urn:dtou-demo:health#> .
@prefix xsd:    <http://www.w3.org/2001/XMLSchema#> .

<#report>
  a health:HealthInsightsReport ;
  health:avgHeartRate ${report.avgHeartRate} ;
  health:avgSteps ${report.avgSteps} ;
  health:totalSteps ${report.totalSteps} ;
  health:avgSleepHours "${report.avgSleepHours}"^^xsd:decimal ;
  health:avgSleepQuality ${report.avgSleepQuality} ;
  health:narrative """${report.narrative}""" ;
  health:generatedAt "${report.generatedAt}"^^xsd:dateTime .
`;
}
```

---

## Pod Writer (`src/podWriter.ts`)

```typescript
import { SOLID_SERVER, MOCK_MODE } from '@dtou-demo/dtou-client';
import { reportToTurtle, type InsightsReport } from './insights';

export async function saveReportToPod(
  report: InsightsReport,
  derivedPolicyTurtle: string,
  accessToken?: string,
): Promise<{ reportUrl: string; policyUrl: string }> {
  const reportUrl = `${SOLID_SERVER}/alice/health/insights/report.ttl`;
  const policyUrl = `${reportUrl}.dtou`;

  if (MOCK_MODE) {
    console.log('[mock] saveReportToPod:', reportUrl);
    return { reportUrl, policyUrl };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'text/turtle',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
  await fetch(reportUrl, { method: 'PUT', headers, body: reportToTurtle(report) });
  await fetch(policyUrl, { method: 'PUT', headers, body: derivedPolicyTurtle });
  return { reportUrl, policyUrl };
}
```

---

## Components

### `src/components/PolicyPanel.vue`
Same as App A (copy the component).

### `src/components/InsightsCard.vue`

Props: `{ report: InsightsReport }`

Renders:
- A stats row: three large numbers (avg HR, avg steps, avg sleep hours)
- A quality indicator for sleep
- The narrative paragraph in a styled blockquote

### `src/components/OutputPolicyBadge.vue`

Props: `{ shown: boolean; reportUrl: string; policyUrl: string }`

When `shown`, renders a green pill:
```
✓ Report saved to Pod
  Derived policy inherited from Alice's health data
  [report.ttl] [report.ttl.dtou]
```

With a tooltip or expandable note:
> "The insights report carries a derived DToU policy computed from Alice's input
> data policies. Any future app accessing the report will face the same constraints
> — no manual policy authoring required."

---

## `src/App.vue`

App state flow: `loading → policy_checked → (if compatible) ready → generating → (after click) saved`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useHealthData } from './composables/useHealthData'
import { generateInsights, type InsightsReport } from './insights'
import { saveReportToPod } from './podWriter'
import PolicyPanel from './components/PolicyPanel.vue'
import InsightsCard from './components/InsightsCard.vue'
import OutputPolicyBadge from './components/OutputPolicyBadge.vue'
import { APP_B_POLICY } from './policy'

const { loading, error, dataPolicies, compatibility, data } = useHealthData()

const report = ref<InsightsReport | null>(null)
const generating = ref(false)
const saved = ref(false)
const savedUrls = ref({ reportUrl: '', policyUrl: '' })

function handleGenerate() {
  if (!data.value) return
  generating.value = true
  report.value = generateInsights(data.value.heartRate, data.value.steps, data.value.sleep)
  generating.value = false
}

async function handleSave() {
  if (!report.value) return
  const result = await saveReportToPod(report.value, '# derived policy (mock)')
  savedUrls.value = result
  saved.value = true
}
</script>

<template>
  <div class="min-h-screen bg-green-50">
    <header class="bg-green-600 text-white px-6 py-4 shadow">
      <h1 class="text-2xl font-bold">Health Insights</h1>
      <p class="text-sm opacity-75">Analyse your health trends · Save to your Pod · Solid-DToU</p>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <PolicyPanel
        :app-policy="APP_B_POLICY"
        :data-policies="dataPolicies"
        :result="compatibility"
        :loading="loading"
      />

      <div v-if="loading" class="text-center py-8 text-green-700">Checking policy…</div>
      <div v-if="error" class="text-red-600 p-4 bg-red-50 rounded">{{ error }}</div>

      <div v-if="compatibility?.compatible">
        <button
          @click="handleGenerate"
          :disabled="generating"
          class="px-5 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 disabled:opacity-50"
        >
          {{ generating ? 'Generating…' : 'Generate Insights' }}
        </button>
      </div>

      <InsightsCard v-if="report" :report="report" />

      <div v-if="report && !saved">
        <button
          @click="handleSave"
          class="px-5 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800"
        >
          Save to Pod (with derived policy)
        </button>
      </div>

      <OutputPolicyBadge
        :shown="saved"
        :report-url="savedUrls.reportUrl"
        :policy-url="savedUrls.policyUrl"
      />
    </main>

    <footer class="text-center text-xs text-gray-400 py-6">
      Output policy derived automatically by DToU
    </footer>
  </div>
</template>
```

---

## Acceptance Criteria

- App renders at `http://localhost:5102` (`npm run dev:app-b`).
- Policy panel shows green "✓ Compatible".
- "Generate Insights" button appears and produces an `InsightsCard`.
- "Save to Pod" shows the `OutputPolicyBadge` explaining policy derivation.
- Green color scheme distinguishes this from Apps A (amber) and C (red).
- No TypeScript / Vue compile errors.
