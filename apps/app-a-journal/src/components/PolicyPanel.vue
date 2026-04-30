<script setup lang="ts">
import { ref } from 'vue';
import type { AppPolicy, DataPolicyDisplay, CompatibilityResult } from '@dtou-demo/dtou-client';
import {
  submitAppPolicy,
  fetchDataPolicyForDisplay,
  fetchComplianceResult,
} from '@dtou-demo/dtou-client';

const props = defineProps<{
  appPolicy: AppPolicy;
  fetchFn?: typeof fetch;
}>();

const emit = defineEmits<{
  result: [CompatibilityResult];
}>();

// currentStep: 0 = not started, 1–4 = steps completed
const currentStep = ref(0);
const stepLoading = ref(false);
const stepError = ref<string | null>(null);

// Real data from each step
const step1Turtle = ref<string | null>(null);
const step1Status = ref<number | null>(null);
// Step 2 is automatic — no client API call needed
const step2Policies = ref<DataPolicyDisplay[] | null>(null);
const step2FetchLoading = ref(false);
const step2FetchError = ref<string | null>(null);
const step3Raw = ref<string | null>(null);
const step3Status = ref<number | null>(null);
const compatResult = ref<CompatibilityResult | null>(null);

async function executeStep(n: number) {
  if (stepLoading.value || n < 1 || n > 4) return;
  stepLoading.value = true;
  stepError.value = null;
  try {
    switch (n) {
      case 1: {
        // POST /dtou — submit app policy; returns the turtle sent
        const r1 = await submitAppPolicy(props.appPolicy, props.fetchFn);
        step1Turtle.value = r1.turtle;
        step1Status.value = r1.status;
        currentStep.value = 1;
        break;
      }
      case 2: {
        // Server-side step — no client call needed, advance immediately
        currentStep.value = 2;
        break;
      }
      case 3: {
        // GET /dtou/compliance — retrieve reasoning result
        const r3 = await fetchComplianceResult(props.appPolicy, props.fetchFn);
        step3Raw.value = r3.raw;
        step3Status.value = r3.status;
        compatResult.value = r3.result;
        currentStep.value = 3;
        break;
      }
      case 4: {
        // Reveal decision and notify parent
        currentStep.value = 4;
        emit('result', compatResult.value!);
        break;
      }
    }
  } catch (e: any) {
    stepError.value = e.message ?? 'Unknown error';
  } finally {
    stepLoading.value = false;
  }
}

async function fetchDataPolicyForStep2() {
  if (step2FetchLoading.value) return;
  step2FetchLoading.value = true;
  step2FetchError.value = null;
  try {
    const display = await fetchDataPolicyForDisplay(props.appPolicy.inputs[0].dataUri, props.fetchFn);
    step2Policies.value = [display];
  } catch (e: any) {
    step2FetchError.value = e.message ?? 'Unknown error';
  } finally {
    step2FetchLoading.value = false;
  }
}

async function nextStep() {
  if (!stepLoading.value && currentStep.value < 4) {
    await executeStep(currentStep.value + 1);
  }
}

async function runAll() {
  for (let n = currentStep.value + 1; n <= 4; n++) {
    await executeStep(n);
    if (stepError.value) break;
  }
}

function reset() {
  if (stepLoading.value) return;
  currentStep.value = 0;
  stepError.value = null;
  step1Turtle.value = null;
  step1Status.value = null;
  step2Policies.value = null;
  step2FetchLoading.value = false;
  step2FetchError.value = null;
  step3Raw.value = null;
  step3Status.value = null;
  compatResult.value = null;
}
</script>

<template>
  <details class="bg-white rounded-lg shadow border border-gray-200">
    <summary class="px-4 py-3 cursor-pointer font-semibold text-gray-700 select-none flex items-center gap-2">
      <span>DToU Policy Check</span>
      <span v-if="stepLoading" class="text-xs text-gray-400">Checking…</span>
      <span v-else-if="compatResult?.compatible"
            class="ml-auto text-xs bg-green-100 text-green-800 border border-green-300 rounded px-2 py-0.5 font-semibold">
        ✓ Compatible
      </span>
      <span v-else-if="compatResult && !compatResult.compatible"
            class="ml-auto text-xs bg-red-100 text-red-800 border border-red-300 rounded px-2 py-0.5 font-semibold">
        ✗ Not Compatible
      </span>
    </summary>

    <div class="border-t border-gray-200 px-4 py-4 space-y-5 text-sm">

      <!-- Reasoning Steps -->
      <div>
        <h3 class="font-semibold text-gray-700 mb-3">Policy Reasoning</h3>

        <ol class="space-y-4 mb-4">

          <!-- Step 1: Submit policy -->
          <li class="flex gap-3" :class="currentStep < 1 && !stepLoading ? 'opacity-40' : ''">
            <span class="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border"
                  :class="currentStep > 1
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : currentStep === 1
                      ? 'bg-blue-500 text-white border-blue-500'
                      : stepLoading && currentStep === 0
                        ? 'bg-blue-200 text-blue-600 border-blue-300'
                        : 'bg-gray-100 text-gray-400 border-gray-300'">
              <svg v-if="stepLoading && currentStep === 0"
                   class="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <template v-else>{{ currentStep >= 1 ? '✓' : '1' }}</template>
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-700">App submits its app policy to DToU component</p>
              <p v-if="currentStep >= 1" class="mt-0.5 text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                Serialized as RDF/Turtle and sent via
                <code class="font-mono bg-gray-100 px-1 rounded">POST /dtou</code>.
                <span v-if="step1Status !== null"
                      class="font-mono px-1.5 py-0.5 rounded text-xs font-semibold"
                      :class="step1Status >= 200 && step1Status < 300
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'">
                  {{ step1Status }}
                </span>
              </p>
              <div v-if="step1Turtle" class="mt-2">
                <details class="text-xs">
                  <summary class="cursor-pointer text-blue-600 hover:text-blue-800 select-none">
                    View submitted app policy (Turtle)
                  </summary>
                  <pre class="mt-1 bg-slate-900 text-slate-200 rounded p-3 overflow-x-auto leading-relaxed max-h-48">{{ step1Turtle }}</pre>
                </details>
              </div>
            </div>
          </li>

          <!-- Step 2: DToU component automatically reads data policies (no client call needed) -->
          <li class="flex gap-3" :class="currentStep < 2 ? 'opacity-40' : ''">
            <span class="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border"
                  :class="currentStep >= 2
                    ? 'bg-gray-200 text-gray-600 border-gray-400'
                    : 'bg-gray-100 text-gray-400 border-gray-300'">
              {{ currentStep >= 2 ? '✓' : '2' }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-700 flex items-center gap-2">
                DToU component reads Alice's data policies from Pod
                <span class="text-xs font-normal text-gray-400 bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5">automatic</span>
              </p>
              <p v-if="currentStep >= 2" class="mt-0.5 text-xs text-gray-500">
                The server reads co-located
                <code class="font-mono bg-gray-100 px-1 rounded">.dtou</code>
                files from Alice's Pod. The app never sees these directly.
              </p>
              <!-- Optional fetch button -->
              <div v-if="currentStep >= 2" class="mt-2 space-y-2">
                <button
                  v-if="!step2Policies"
                  @click="fetchDataPolicyForStep2"
                  :disabled="step2FetchLoading"
                  class="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg v-if="step2FetchLoading" class="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  {{ step2FetchLoading ? 'Fetching…' : 'Fetch data policy for display' }}
                </button>
                <p v-if="step2FetchError" class="text-xs text-red-600">{{ step2FetchError }}</p>
                <div v-if="step2Policies" class="space-y-1">
                  <details v-for="dp in step2Policies" :key="dp.resourceUrl" class="text-xs">
                    <summary class="cursor-pointer text-blue-600 hover:text-blue-800 select-none flex items-start gap-2 flex-wrap">
                      Alice's data policy
                      <span class="font-mono text-gray-400 break-all">{{ dp.resourceUrl }}.dtou</span>
                      <span class="font-mono px-1.5 py-0.5 rounded font-semibold"
                            :class="dp.status >= 200 && dp.status < 300
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'">
                        {{ dp.status }}
                      </span>
                    </summary>
                    <pre class="mt-1 bg-slate-900 text-slate-200 rounded p-3 overflow-x-auto leading-relaxed max-h-48">{{ dp.raw }}</pre>
                  </details>
                </div>
              </div>
            </div>
          </li>

          <!-- Step 3: DToU policy engine -->
          <li class="flex gap-3" :class="currentStep < 3 && !(stepLoading && currentStep === 2) ? 'opacity-40' : ''">
            <span class="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border"
                  :class="currentStep > 3
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : currentStep === 3
                      ? 'bg-blue-500 text-white border-blue-500'
                      : stepLoading && currentStep === 2
                        ? 'bg-blue-200 text-blue-600 border-blue-300'
                        : 'bg-gray-100 text-gray-400 border-gray-300'">
              <svg v-if="stepLoading && currentStep === 2"
                   class="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <template v-else>{{ currentStep >= 3 ? '✓' : '3' }}</template>
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-700">DToU policy engine checks compatibility</p>
              <p v-if="currentStep >= 3" class="mt-0.5 text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                DToU policy engine runs inside the Solid server. Result retrieved via
                <code class="font-mono bg-gray-100 px-1 rounded">GET /dtou/compliance</code>.
                <span v-if="step3Status !== null"
                      class="font-mono px-1.5 py-0.5 rounded text-xs font-semibold"
                      :class="step3Status >= 200 && step3Status < 300
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'">
                  {{ step3Status }}
                </span>
              </p>
              <div v-if="step3Raw" class="mt-2">
                <details class="text-xs">
                  <summary class="cursor-pointer text-blue-600 hover:text-blue-800 select-none">
                    View raw reasoning result (Turtle)
                  </summary>
                  <pre class="mt-1 bg-slate-900 text-slate-200 rounded p-3 overflow-x-auto leading-relaxed max-h-48">{{ step3Raw }}</pre>
                </details>
              </div>
            </div>
          </li>

          <!-- Step 4: Decision -->
          <li class="flex gap-3" :class="currentStep < 4 && !(stepLoading && currentStep === 3) ? 'opacity-40' : ''">
            <span class="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border"
                  :class="currentStep < 4
                    ? stepLoading && currentStep === 3
                      ? 'bg-blue-200 text-blue-600 border-blue-300'
                      : 'bg-gray-100 text-gray-400 border-gray-300'
                    : compatResult?.compatible
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-red-500 text-white border-red-500'">
              <svg v-if="stepLoading && currentStep === 3"
                   class="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <template v-else-if="currentStep >= 4 && compatResult?.compatible">✓</template>
              <template v-else-if="currentStep >= 4">✗</template>
              <template v-else>4</template>
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-700">Decision</p>
              <div v-if="currentStep >= 4 && compatResult" class="mt-1">
                <div v-if="compatResult.compatible"
                     class="text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                  ✓ Compatible — access granted, no conflicts detected.
                </div>
                <div v-else
                     class="text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 space-y-1">
                  <p class="font-semibold">✗ Not compatible — {{ compatResult.conflicts.length }} conflict(s)</p>
                  <ul class="list-disc list-inside text-xs space-y-0.5">
                    <li v-for="(c, i) in compatResult.conflicts" :key="i">
                      <span class="font-medium">{{ c.type }}:</span> {{ c.detail }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>

        </ol>

        <!-- Step error -->
        <div v-if="stepError"
             class="mb-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          Error: {{ stepError }}
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-2">
          <button
            @click="nextStep"
            :disabled="currentStep >= 4 || stepLoading"
            class="px-3 py-1.5 text-xs rounded border font-medium transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed
                   border-blue-400 text-blue-700 hover:bg-blue-50 disabled:hover:bg-white"
          >
            {{ currentStep === 0 ? '▶ Start' : 'Next Step →' }}
          </button>
          <button
            @click="runAll"
            :disabled="currentStep >= 4 || stepLoading"
            class="px-3 py-1.5 text-xs rounded border font-medium transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed
                   border-gray-400 text-gray-700 hover:bg-gray-50 disabled:hover:bg-white"
          >
            Run All
          </button>
          <button
            v-if="currentStep > 0"
            @click="reset"
            :disabled="stepLoading"
            class="px-3 py-1.5 text-xs rounded text-gray-400 hover:text-gray-600 transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- App Policy -->
      <div>
        <h3 class="font-semibold text-gray-700 mb-2">App Policy</h3>
        <p class="text-gray-500 mb-2">{{ props.appPolicy.description }}</p>
        <table class="w-full text-xs border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="text-left p-1.5 border border-gray-200">Input</th>
              <th class="text-left p-1.5 border border-gray-200">Port</th>
              <th class="text-left p-1.5 border border-gray-200">Purpose(s)</th>
              <th class="text-left p-1.5 border border-gray-200">3rd Parties</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="input in props.appPolicy.inputs" :key="input.uri">
              <td class="p-1.5 border border-gray-200 font-mono text-gray-500 break-all">
                {{ input.dataUri }}
              </td>
              <td class="p-1.5 border border-gray-200">{{ input.port.name }}</td>
              <td class="p-1.5 border border-gray-200">
                <span v-for="p in input.purposes" :key="p.uri" class="block font-mono text-blue-700"
                      :title="p.name">
                  {{ p.name.split(/[#/]/).pop() }}
                </span>
              </td>
              <td class="p-1.5 border border-gray-200">
                <span v-if="!input.downstreams.length" class="text-gray-400 italic">none</span>
                <span v-for="ds in input.downstreams" :key="ds.uri" class="block">
                  <span class="font-mono text-gray-700" :title="ds.appName">
                    {{ ds.appName.split(/[#/]/).pop() }}
                  </span>
                  <span v-for="p in ds.purposes" :key="p.uri"
                        class="ml-1 font-mono text-blue-700" :title="p.name">
                    ({{ p.name.split(/[#/]/).pop() }})
                  </span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="props.appPolicy.outputs.length" class="mt-2 text-xs text-gray-500">
          <span class="font-medium">Outputs:</span>
          <span v-for="o in props.appPolicy.outputs" :key="o.uri" class="ml-2">
            {{ o.port.name }} (from: {{ o.fromPorts.length }} input port(s))
          </span>
        </div>
        <div v-else class="mt-1 text-xs text-gray-400">No outputs — data stays in Pod.</div>
      </div>

    </div>
  </details>
</template>
