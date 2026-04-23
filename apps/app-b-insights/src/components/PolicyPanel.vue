<script setup lang="ts">
import type { AppPolicy, DataPolicyDisplay, CompatibilityResult } from '@dtou-demo/dtou-client';

const props = defineProps<{
  appPolicy: AppPolicy;
  dataPolicies: DataPolicyDisplay[];
  result: CompatibilityResult | null;
  loading: boolean;
}>();
</script>

<template>
  <details class="bg-white rounded-lg shadow border border-gray-200">
    <summary class="px-4 py-3 cursor-pointer font-semibold text-gray-700 select-none flex items-center gap-2">
      <span>DToU Policy Check</span>
      <span v-if="props.loading" class="text-xs text-gray-400">Checking…</span>
      <span v-else-if="props.result?.compatible"
            class="ml-auto text-xs bg-green-100 text-green-800 border border-green-300 rounded px-2 py-0.5 font-semibold">
        ✓ Compatible
      </span>
      <span v-else-if="props.result && !props.result.compatible"
            class="ml-auto text-xs bg-red-100 text-red-800 border border-red-300 rounded px-2 py-0.5 font-semibold">
        ✗ Not Compatible
      </span>
    </summary>

    <div class="border-t border-gray-200 px-4 py-4 space-y-5 text-sm">

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
            </tr>
          </thead>
          <tbody>
            <tr v-for="input in props.appPolicy.inputs" :key="input.uri">
              <td class="p-1.5 border border-gray-200 font-mono text-gray-500 truncate max-w-[12rem]">
                {{ input.dataUri }}
              </td>
              <td class="p-1.5 border border-gray-200">{{ input.port.name }}</td>
              <td class="p-1.5 border border-gray-200">
                <span v-for="p in input.purposes" :key="p.uri" class="block font-mono text-blue-700"
                      :title="p.name">
                  {{ p.name.split(/[#/]/).pop() }}
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

      <!-- Data Policies (display only) -->
      <div v-if="props.dataPolicies.length">
        <h3 class="font-semibold text-gray-700 mb-2">Alice's Data Policy (display)</h3>
        <div v-for="dp in props.dataPolicies" :key="dp.resourceUrl" class="mb-2">
          <p class="text-xs text-gray-400 mb-1 font-mono">{{ dp.resourceUrl }}.dtou</p>
          <pre class="bg-slate-900 text-slate-200 rounded p-3 text-xs overflow-x-auto leading-relaxed max-h-40">{{ dp.raw }}</pre>
        </div>
      </div>

      <!-- Compatibility Result -->
      <div>
        <h3 class="font-semibold text-gray-700 mb-2">Compatibility Result</h3>
        <div v-if="props.loading" class="flex items-center gap-2 text-gray-400">
          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Checking policy…
        </div>
        <div v-else-if="props.result?.compatible"
             class="text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          ✓ Compatible — no conflicts detected
        </div>
        <div v-else-if="props.result && !props.result.compatible"
             class="text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 space-y-1">
          <div class="font-semibold">✗ Not Compatible — {{ props.result.conflicts.length }} conflict(s)</div>
          <ul class="list-disc list-inside text-xs space-y-1">
            <li v-for="(c, i) in props.result.conflicts" :key="i">
              <span class="font-medium">{{ c.type }}:</span> {{ c.detail }}
            </li>
          </ul>
        </div>
      </div>

    </div>
  </details>
</template>
