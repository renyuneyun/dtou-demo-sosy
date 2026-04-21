<script setup lang="ts">
import type { HeartRateRecord, StepsRecord, SleepRecord } from '../composables/useHealthData';

const props = defineProps<{
  date: string;
  heartRate: HeartRateRecord[];
  steps: StepsRecord[];
  sleep: SleepRecord[];
}>();

function avgBpm(): number {
  const records = props.heartRate;
  if (!records.length) return 0;
  // Both dates' records are interleaved (3 per day); filter by index is not possible
  // without date info, so show overall average for simplicity.
  return Math.round(records.reduce((s, r) => s + r.bpm, 0) / records.length);
}

function stepsForDate(): number {
  return props.steps.find(r => r.date === props.date)?.steps ?? 0;
}

function sleepForDate(): SleepRecord | undefined {
  return props.sleep.find(r => r.date === props.date);
}
</script>

<template>
  <aside class="bg-amber-100 border border-amber-300 rounded-lg p-4 space-y-4">
    <h3 class="font-semibold text-amber-800 text-sm">Health Context</h3>

    <!-- Heart rate -->
    <div class="text-center">
      <div class="text-2xl font-bold text-amber-700">{{ avgBpm() }}</div>
      <div class="text-xs text-amber-600">avg BPM ♥</div>
    </div>

    <!-- Steps -->
    <div class="text-center">
      <div class="text-2xl font-bold text-amber-700">{{ stepsForDate().toLocaleString() }}</div>
      <div class="text-xs text-amber-600">steps 👟</div>
    </div>

    <!-- Sleep -->
    <div v-if="sleepForDate()" class="text-center">
      <div class="text-2xl font-bold text-amber-700">{{ sleepForDate()!.hours }}h</div>
      <div class="text-xs text-amber-600">sleep · quality {{ sleepForDate()!.quality }}/100</div>
    </div>
  </aside>
</template>
