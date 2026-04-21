<script setup lang="ts">
import type { InsightsReport } from '../insights';
const props = defineProps<{ report: InsightsReport }>();
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6 space-y-4">
    <h2 class="font-semibold text-gray-700">Generated Insights Report</h2>

    <!-- Key stats row -->
    <div class="grid grid-cols-3 gap-4 text-center">
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

    <!-- Sleep quality indicator -->
    <div class="flex items-center gap-3">
      <span class="text-sm text-gray-600">Sleep quality:</span>
      <div class="flex-1 bg-gray-200 rounded-full h-2">
        <div
          class="bg-green-500 h-2 rounded-full"
          :style="{ width: `${props.report.avgSleepQuality}%` }"
        />
      </div>
      <span class="text-sm font-medium text-gray-700">{{ props.report.avgSleepQuality }}/100</span>
    </div>

    <!-- Narrative -->
    <blockquote class="border-l-4 border-green-400 pl-4 italic text-gray-600 text-sm">
      {{ props.report.narrative }}
    </blockquote>

    <p class="text-xs text-gray-400">Generated at {{ props.report.generatedAt }}</p>
  </div>
</template>
