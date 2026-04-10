# Task 07 — Demo Shell (Landing Page)

## Goal

Build the **Demo Shell** — a polished landing page that ties all three apps together
for live presentation at **Solid Symposium (SoSy) 2026** and later venues.
It should be self-explanatory to a technical Solid audience and work without a server
(mock mode).

---

## UI Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Solid-DToU Demo                              [Paper ↗]  [GitHub ↗]      │
│  "Automated, non-coordinated data usage policy checking"                 │
└──────────────────────────────────────────────────────────────────────────┘

┌──── What is DToU? ──────────────────────────────────────────────────────┐
│  2-paragraph explainer with key terms highlighted                        │
└──────────────────────────────────────────────────────────────────────────┘

┌──── The Scenario ───────────────────────────────────────────────────────┐
│  Alice's Pod · her data policy · three apps · automatic reasoning        │
└──────────────────────────────────────────────────────────────────────────┘

┌──── Three Apps, Three Outcomes ─────────────────────────────────────────┐
│  [App A: Journal ✓]    [App B: Insights ✓]    [App C: HealthShare ✗]    │
└──────────────────────────────────────────────────────────────────────────┘

┌──── Alice's Data Policy ────────────────────────────────────────────────┐
│  Shows the actual .dtou Turtle (condensed) with syntax highlighted       │
└──────────────────────────────────────────────────────────────────────────┘

┌──── DToU vs. Other Approaches ─────────────────────────────────────────┐
│  Comparison table: WAC/ACP, SAI, ODRL, DToU                              │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## App Entries (`src/apps.ts`)

```typescript
export interface AppEntry {
  id: string;
  name: string;
  tagline: string;
  url: string;
  headerColor: string;      // Tailwind bg- class
  result: 'allowed' | 'denied';
  resultReason: string;
  keyFeature: string;       // which DToU feature this app demonstrates
}

export const APPS: AppEntry[] = [
  {
    id: 'app-a',
    name: 'Daily Wellness Journal',
    tagline: 'Journaling app — reads health data as personal context',
    url: 'http://localhost:5101',
    headerColor: 'bg-amber-600',
    result: 'allowed',
    resultReason:
      'App declares purpose vocab:personal-benefit. ' +
      'No prohibition in Alice\'s policy targets app:DailyWellnessJournal.',
    keyFeature: 'Basic compatibility check — different app type',
  },
  {
    id: 'app-b',
    name: 'Health Insights',
    tagline: 'Health analytics — writes insights report back to Pod',
    url: 'http://localhost:5102',
    headerColor: 'bg-green-600',
    result: 'allowed',
    resultReason:
      'Same purpose (personal-benefit), no prohibition match. ' +
      'Output policy is automatically derived from input policies.',
    keyFeature: 'Policy derivation — output inherits Alice\'s constraints',
  },
  {
    id: 'app-c',
    name: 'HealthShare Pro™',
    tagline: 'Commercial data platform — aggregates and shares with partners',
    url: 'http://localhost:5103',
    headerColor: 'bg-rose-700',
    result: 'denied',
    resultReason:
      'App declares purpose vocab:commercial-research. ' +
      'Alice\'s prohibition blocks any app using that purpose (:app omitted) → ProhibitedUse conflict.',
    keyFeature: 'Prohibition — honest app policy triggers automatic block',
  },
];
```

---

## Components

### `src/components/AppCard.vue`

Props: `{ app: AppEntry }`

```vue
<script setup lang="ts">
import type { AppEntry } from '../apps'
const props = defineProps<{ app: AppEntry }>()
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden flex flex-col">
    <!-- Coloured header strip -->
    <div :class="[props.app.headerColor, 'text-white px-4 py-3']">
      <h3 class="font-bold text-lg">{{ props.app.name }}</h3>
      <p class="text-xs opacity-80">{{ props.app.tagline }}</p>
    </div>

    <div class="p-4 flex-1 space-y-3">
      <!-- Result badge -->
      <div :class="props.app.result === 'allowed'
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'"
           class="rounded px-3 py-1 text-sm font-semibold inline-block">
        {{ props.app.result === 'allowed' ? '✓ Allowed' : '✗ Denied' }}
      </div>

      <p class="text-xs text-gray-600">{{ props.app.resultReason }}</p>

      <!-- Key DToU feature callout -->
      <div class="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-600">
        <span class="font-semibold">DToU feature: </span>{{ props.app.keyFeature }}
      </div>
    </div>

    <div class="px-4 pb-4">
      <a :href="props.app.url" target="_blank"
         class="block text-center text-sm bg-slate-700 text-white rounded py-2 hover:bg-slate-800">
        Open App →
      </a>
    </div>
  </div>
</template>
```

### `src/components/ExplainerSection.vue`

Hard-coded two-paragraph explainer. Highlight key terms using `<strong>` or a
colored `<span>`:

```vue
<template>
  <section class="bg-white rounded-lg shadow p-6 space-y-3 text-gray-700 leading-relaxed">
    <h2 class="text-xl font-semibold text-slate-800">What is Solid-DToU?</h2>
    <p>
      <strong class="text-blue-700">Solid-DToU</strong> (Data Terms of Use) is a
      policy language and automated reasoning system for the
      <a href="https://solidproject.org" target="_blank" class="underline">Solid</a> ecosystem.
      A data owner writes a <strong class="text-blue-700">data policy</strong> once —
      covering a type or location of data — expressing how it may be used.
      An app writes an <strong class="text-blue-700">app policy</strong> once —
      declaring how it consumes and transforms data.
      An automated reasoner checks compatibility between the two, with no bilateral
      negotiation and no manual review by the user.
    </p>
    <p>
      The key advance over existing approaches (WAC/ACP, SAI, ODRL) is
      <strong class="text-blue-700">non-coordination</strong>: both sides write
      their policies independently, using shared ontological concepts (shared vocabulary URIs).
      Data produced by an app also receives a
      <strong class="text-blue-700">derived policy</strong> computed from the input
      data policies — privacy constraints propagate through data pipelines automatically.
    </p>
  </section>
</template>
```

### `src/components/ScenarioSection.vue`

```vue
<template>
  <section class="bg-amber-50 border border-amber-200 rounded-lg p-6 text-gray-700">
    <h2 class="text-xl font-semibold text-slate-800 mb-3">The Scenario</h2>
    <div class="flex flex-col md:flex-row gap-6 items-start">
      <div class="flex-1 space-y-2 text-sm">
        <p>
          <strong>Alice</strong> stores health data (heart rate, steps, sleep) in her
          <strong>Solid Pod</strong>.
        </p>
        <p>
          She writes a <strong>data policy</strong> once:
          <em>"Apps named app:HealthSharePro may not use my data for
          commercial research purposes."</em>
        </p>
        <p>
          Three apps — a journal, an analytics tool, and a commercial platform —
          each declare their own app policy. The DToU reasoner checks each one
          <strong>automatically</strong>, before any data is accessed.
        </p>
      </div>
      <!-- Simple visual flow: Pod → Reasoner → 3 apps -->
      <div class="shrink-0 text-center text-sm text-slate-600 space-y-1">
        <div class="bg-amber-100 border border-amber-300 rounded px-3 py-2">Alice's Pod</div>
        <div>↓ data policy (.dtou)</div>
        <div class="bg-slate-100 border border-slate-300 rounded px-3 py-2">DToU Reasoner</div>
        <div class="flex gap-2 justify-center mt-1">
          <span class="bg-green-100 border border-green-300 rounded px-2 py-1">App A ✓</span>
          <span class="bg-green-100 border border-green-300 rounded px-2 py-1">App B ✓</span>
          <span class="bg-red-100 border border-red-300 rounded px-2 py-1">App C ✗</span>
        </div>
      </div>
    </div>
  </section>
</template>
```

### `src/components/DataPolicyViewer.vue`

Shows the actual Turtle of Alice's data policy in a `<pre>` block with minimal
syntax highlighting (highlight prefixes, class names, and IRIs with different colors
using `<span>` wrapping or a simple regex replacement).

Hard-code the policy Turtle string (same as the `.dtou` files in Task 02):

```vue
<script setup lang="ts">
const POLICY_TURTLE = `@prefix :      <http://example.org/ns#> .
@prefix demo:  <http://example.org/dtou-demo#> .
@prefix vocab: <http://example.org/dtou-demo/vocab#> .

demo:attr-personal a :Attribute ;
    :name  demo:health-data-personal ;
    :class :personal ;
    :value :nil .

# :app is omitted → prohibition applies to ANY app
demo:prohibition-commercial a :Prohibition ;
    :mode :Use ;
    :activation_condition [
        :purpose vocab:commercial-research
    ] .

demo:health-data-policy a :DataPolicy ;
    :attribute   demo:attr-personal ;
    :prohibition demo:prohibition-commercial .`
</script>

<template>
  <section class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-slate-800 mb-3">Alice's Data Policy</h2>
    <p class="text-sm text-gray-600 mb-3">
      Written once. Applied automatically to all health data resources in her Pod.
    </p>
    <pre class="bg-slate-900 text-slate-100 rounded p-4 text-xs overflow-x-auto leading-relaxed">{{ POLICY_TURTLE }}</pre>
    <p class="text-xs text-gray-500 mt-2">
      The prohibition omits <code>:app</code> — it blocks <em>any</em> app from
      using her health data for <code>vocab:commercial-research</code>. Alice did not
      need to know which commercial apps exist when she wrote this policy.
    </p>
  </section>
</template>
```

### `src/components/ComparisonTable.vue`

```vue
<script setup lang="ts">
const rows = [
  {
    feature: 'Policy authoring burden',
    wac: 'Per-resource ACL per app',
    sai: 'Per-authorization-agent negotiation',
    odrl: 'Per bilateral agreement',
    dtou: 'Once per data type / location',
  },
  {
    feature: 'App accountability',
    wac: 'None — user decides manually',
    sai: 'App registers with auth agent',
    odrl: 'Depends on enforcement layer',
    dtou: 'App declares usage policy (verifiable)',
  },
  {
    feature: 'Automated compliance check',
    wac: '✗',
    sai: 'Partial',
    odrl: 'Possible, complex',
    dtou: '✓ Built-in N3 reasoner',
  },
  {
    feature: 'Policy derivation for outputs',
    wac: '✗',
    sai: '✗',
    odrl: 'Manual',
    dtou: '✓ Automatic (OutputSpec)',
  },
  {
    feature: 'Non-coordinated parties',
    wac: '✗ (user reads each privacy policy)',
    sai: '✗ (requires auth agent agreement)',
    odrl: '✗ (requires bilateral contract)',
    dtou: '✓ (shared ontology only)',
  },
  {
    feature: 'Solid integration',
    wac: '✓ Native',
    sai: 'Proposed spec',
    odrl: 'Via plugin',
    dtou: '✓ CSS extension (solid-dtou)',
  },
]
</script>

<template>
  <section class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-slate-800 mb-4">DToU vs. Other Approaches</h2>
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-slate-100">
            <th class="text-left p-2 border border-slate-300">Feature</th>
            <th class="text-left p-2 border border-slate-300">WAC / ACP</th>
            <th class="text-left p-2 border border-slate-300">SAI</th>
            <th class="text-left p-2 border border-slate-300">ODRL</th>
            <th class="text-left p-2 border border-slate-300 bg-blue-50 font-bold text-blue-800">DToU</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i"
              :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50'">
            <td class="p-2 border border-slate-300 font-medium">{{ row.feature }}</td>
            <td class="p-2 border border-slate-300 text-gray-600">{{ row.wac }}</td>
            <td class="p-2 border border-slate-300 text-gray-600">{{ row.sai }}</td>
            <td class="p-2 border border-slate-300 text-gray-600">{{ row.odrl }}</td>
            <td class="p-2 border border-slate-300 bg-blue-50 text-blue-800 font-medium">{{ row.dtou }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
```

---

## `src/App.vue`

```vue
<script setup lang="ts">
import ExplainerSection from './components/ExplainerSection.vue'
import ScenarioSection from './components/ScenarioSection.vue'
import AppCard from './components/AppCard.vue'
import DataPolicyViewer from './components/DataPolicyViewer.vue'
import ComparisonTable from './components/ComparisonTable.vue'
import { APPS } from './apps'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-slate-800 text-white px-8 py-6 flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-bold">Solid-DToU Demo</h1>
        <p class="text-slate-300 mt-1 text-sm max-w-xl">
          Automated, non-coordinated data usage policy checking for the Solid ecosystem
        </p>
        <p class="text-slate-400 text-xs mt-1">
          Oxford Human-Centred Computing Group · WWW 2024
        </p>
      </div>
      <div class="flex gap-4 text-sm pt-1">
        <a href="https://arxiv.org/abs/2403.07587" target="_blank"
           class="underline opacity-70 hover:opacity-100">Paper ↗</a>
        <a href="https://github.com/renyuneyun/solid-dtou" target="_blank"
           class="underline opacity-70 hover:opacity-100">GitHub ↗</a>
        <a href="https://me.ryey.icu/solid-dtou/dtou-spec.html" target="_blank"
           class="underline opacity-70 hover:opacity-100">Spec ↗</a>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <ExplainerSection />
      <ScenarioSection />

      <section>
        <h2 class="text-xl font-semibold text-slate-800 mb-4">Three Apps, Three Outcomes</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AppCard v-for="app in APPS" :key="app.id" :app="app" />
        </div>
      </section>

      <DataPolicyViewer />
      <ComparisonTable />
    </main>

    <footer class="text-center text-xs text-gray-400 py-8">
      Solid-DToU · Oxford Human-Centred Computing Group · WWW 2024 ·
      <a href="https://arxiv.org/abs/2403.07587" class="underline">arXiv:2403.07587</a>
    </footer>
  </div>
</template>
```

---

## Acceptance Criteria

- Demo shell renders at `http://localhost:5100` (`npm run dev:shell`).
- Three app cards show correct allowed/denied badges with result reasons.
- "Open App →" links point to correct ports.
- Alice's data policy Turtle is displayed in a code block.
- Comparison table shows DToU column highlighted in blue.
- Links to paper, GitHub, and spec are present.
- No TypeScript / Vue compile errors.
- Page is readable on a laptop screen share (14"+ screens at ~1080p).
