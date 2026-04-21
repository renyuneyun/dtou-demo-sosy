<script setup lang="ts">
const props = defineProps<{ shown: boolean; reportUrl: string; policyUrl: string }>();
</script>

<template>
  <div v-if="props.shown"
       class="bg-green-50 border border-green-300 rounded-lg p-4 space-y-2">
    <div class="flex items-center gap-2 text-green-800 font-semibold">
      <span class="text-lg">✓</span>
      <span>Report saved to Pod</span>
    </div>
    <p class="text-xs text-green-700">
      Derived policy inherited from Alice's health data
    </p>
    <div class="flex gap-3 text-xs font-mono">
      <a :href="props.reportUrl" target="_blank"
         class="underline text-green-700 hover:text-green-900">report.ttl</a>
      <a :href="props.policyUrl" target="_blank"
         class="underline text-green-700 hover:text-green-900">report.ttl.dtou</a>
    </div>
    <details class="text-xs text-green-600">
      <summary class="cursor-pointer font-medium">About derived policies</summary>
      <p class="mt-2 bg-green-100 rounded p-2 leading-relaxed">
        The insights report carries a derived DToU policy computed from Alice's input
        data policies. Any future app accessing the report will face the same constraints
        — no manual policy authoring required.
      </p>
    </details>
  </div>
</template>
