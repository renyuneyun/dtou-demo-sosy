<script setup lang="ts">
import type { InsightsReport } from '../insights';
const props = defineProps<{
  report: InsightsReport;
  reportTurtle?: string;
}>();
</script>

<template>
  <div class="rounded-lg shadow border border-green-200 overflow-hidden">
    <!-- Origin header -->
    <div class="px-4 py-2 bg-green-600 text-white flex items-center gap-2">
      <span class="text-xs font-bold uppercase tracking-wide bg-green-800 rounded px-2 py-0.5">App</span>
      <span class="font-semibold text-sm">Generated Insights Report</span>
      <span class="ml-auto text-xs opacity-60">{{ props.report.generatedAt }}</span>
    </div>

    <div class="bg-white p-5 space-y-4">
      <!-- Key stats -->
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="bg-green-50 border border-green-200 rounded p-3">
          <div class="text-3xl font-bold text-green-700">{{ props.report.avgHeartRate }}</div>
          <div class="text-xs text-green-600 mt-1">avg BPM ♥</div>
        </div>
        <div class="bg-green-50 border border-green-200 rounded p-3">
          <div class="text-3xl font-bold text-green-700">{{ props.report.avgSteps.toLocaleString() }}</div>
          <div class="text-xs text-green-600 mt-1">avg steps/day</div>
        </div>
        <div class="bg-green-50 border border-green-200 rounded p-3">
          <div class="text-3xl font-bold text-green-700">{{ props.report.avgSleepHours }}h</div>
          <div class="text-xs text-green-600 mt-1">avg sleep</div>
        </div>
      </div>

      <!-- Sleep quality -->
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600 shrink-0">Sleep quality:</span>
        <div class="flex-1 bg-gray-200 rounded-full h-2">
          <div class="bg-green-500 h-2 rounded-full" :style="{ width: `${props.report.avgSleepQuality}%` }" />
        </div>
        <span class="text-sm font-medium text-gray-700 shrink-0">{{ props.report.avgSleepQuality }}/100</span>
      </div>

      <!-- Narrative -->
      <blockquote class="border-l-4 border-green-400 pl-4 italic text-gray-600 text-sm">
        {{ props.report.narrative }}
      </blockquote>

      <!-- report.ttl preview -->
      <div v-if="props.reportTurtle" class="border-t border-gray-100 pt-3">
        <details class="text-xs">
          <summary class="cursor-pointer select-none flex items-center gap-2 text-green-700 hover:text-green-900 font-medium">
            <span class="font-mono bg-green-50 border border-green-300 rounded px-1.5 py-0.5">report.ttl</span>
            <span class="text-gray-400 font-normal">serialized by this app</span>
          </summary>
          <pre class="mt-2 bg-slate-900 text-slate-200 rounded p-3 overflow-x-auto leading-relaxed max-h-52">{{ props.reportTurtle }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>
