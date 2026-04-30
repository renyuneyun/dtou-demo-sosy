<script setup lang="ts">
import { ref } from 'vue';
import { MOCK_MODE } from '@dtou-demo/dtou-client';

const props = defineProps<{
  shown: boolean;
  reportUrl: string;
  policyUrl: string;
  savedReportTurtle: string;
  savedPolicyTurtle: string;
  fetchFn?: typeof fetch;
}>();

const podReportTurtle = ref<string | null>(null);
const podPolicyTurtle = ref<string | null>(null);
const fetching = ref(false);
const fetchError = ref<string | null>(null);

async function fetchFromPod() {
  fetching.value = true;
  fetchError.value = null;
  try {
    const _fetch = props.fetchFn ?? fetch;
    const [rRes, pRes] = await Promise.all([
      _fetch(props.reportUrl, { headers: { Accept: 'text/turtle' } }),
      _fetch(props.policyUrl, { headers: { Accept: 'text/turtle' } }),
    ]);
    podReportTurtle.value = rRes.ok ? await rRes.text() : `# HTTP ${rRes.status}`;
    podPolicyTurtle.value = pRes.ok ? await pRes.text() : `# HTTP ${pRes.status}`;
  } catch (e: any) {
    fetchError.value = e.message ?? 'Unknown error';
  } finally {
    fetching.value = false;
  }
}
</script>

<template>
  <div v-if="props.shown" class="space-y-3">

    <!-- Confirmation bar -->
    <div class="rounded-lg bg-gray-800 text-white px-5 py-3 flex items-center gap-3 text-sm">
      <span class="text-green-400 text-lg leading-none">✓</span>
      <span class="font-semibold">Saved to Alice's Solid Pod</span>
      <div class="ml-auto flex gap-3 text-xs font-mono">
        <a :href="props.reportUrl" target="_blank"
           class="text-green-300 underline hover:text-green-100">report.ttl</a>
        <a :href="props.policyUrl" target="_blank"
           class="text-indigo-300 underline hover:text-indigo-100">report.ttl.dtou</a>
      </div>
    </div>

    <!-- App-generated: report.ttl -->
    <div class="rounded-lg border border-green-200 overflow-hidden">
      <div class="px-4 py-2 bg-green-600 text-white flex items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wide bg-green-800 rounded px-2 py-0.5">App</span>
        <span class="text-sm font-medium">report.ttl — written by this app</span>
      </div>
      <div class="bg-white px-4 py-3">
        <details class="text-xs">
          <summary class="cursor-pointer select-none flex items-center gap-2 text-green-700 hover:text-green-900 font-medium">
            <span class="font-mono bg-green-50 border border-green-300 rounded px-1.5 py-0.5">report.ttl</span>
            <span class="text-gray-400 font-normal">{{ !MOCK_MODE && podReportTurtle ? 'read from Pod' : 'as saved' }}</span>
          </summary>
          <pre class="mt-2 bg-slate-900 text-slate-200 rounded p-3 overflow-x-auto leading-relaxed max-h-52">{{ podReportTurtle ?? props.savedReportTurtle }}</pre>
        </details>
      </div>
    </div>

    <!-- Server-derived: report.ttl.dtou -->
    <div class="rounded-lg border border-indigo-200 overflow-hidden">
      <div class="px-4 py-2 bg-indigo-600 text-white flex items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wide bg-indigo-900 rounded px-2 py-0.5">DToU Server</span>
        <span class="text-sm font-medium">report.ttl.dtou — derived by the DToU server</span>
      </div>
      <div class="bg-indigo-50 px-4 py-3 space-y-2">
        <p class="text-xs text-indigo-800">
          This policy was not authored manually — it was automatically derived from
          Alice's input data policies and saved alongside the report. Any future
          app reading <span class="font-mono">report.ttl</span> will be checked against it.
        </p>
        <details class="text-xs">
          <summary class="cursor-pointer select-none flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-medium">
            <span class="font-mono bg-white border border-indigo-300 rounded px-1.5 py-0.5 text-indigo-800">report.ttl.dtou</span>
            <span class="text-indigo-400 font-normal">{{ !MOCK_MODE && podPolicyTurtle ? 'read from Pod' : 'as saved' }}</span>
          </summary>
          <pre class="mt-2 bg-slate-900 text-slate-200 rounded p-3 overflow-x-auto leading-relaxed max-h-52">{{ podPolicyTurtle ?? props.savedPolicyTurtle }}</pre>
        </details>
      </div>
    </div>

    <!-- Verify from Pod (real mode) -->
    <div v-if="!MOCK_MODE && !podReportTurtle" class="flex items-center gap-3 px-1">
      <p class="text-xs text-gray-500">Fetch both files back from the Pod to confirm they're persisted:</p>
      <button
        @click="fetchFromPod"
        :disabled="fetching"
        class="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 shrink-0"
      >
        <svg v-if="fetching" class="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        {{ fetching ? 'Fetching…' : 'Verify from Pod' }}
      </button>
      <p v-if="fetchError" class="text-xs text-red-600">{{ fetchError }}</p>
    </div>

  </div>
</template>
