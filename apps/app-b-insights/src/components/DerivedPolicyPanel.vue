<script setup lang="ts">
defineProps<{
  policyTurtle: string;
}>();
</script>

<template>
  <div class="rounded-lg shadow border border-indigo-200 overflow-hidden">
    <!-- Origin header -->
    <div class="px-4 py-2 bg-indigo-600 text-white flex items-center gap-2">
      <span class="text-xs font-bold uppercase tracking-wide bg-indigo-900 rounded px-2 py-0.5">DToU Server</span>
      <span class="font-semibold text-sm">Derived Policy</span>
    </div>

    <div class="bg-indigo-50 px-5 py-4 space-y-3">
      <p class="text-sm text-indigo-900">
        The DToU server computed this policy from Alice's input data policies
        (heart rate, steps, sleep). Because the app declared no refinements,
        the output inherits them in full — including the prohibition on
        commercial-research use.
      </p>

      <details class="text-xs">
        <summary class="cursor-pointer select-none flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-medium">
          <span class="font-mono bg-white border border-indigo-300 rounded px-1.5 py-0.5 text-indigo-800">report.ttl.dtou</span>
          <span class="text-indigo-400 font-normal">computed by the DToU server</span>
        </summary>
        <pre class="mt-2 bg-slate-900 text-slate-200 rounded p-3 overflow-x-auto leading-relaxed max-h-52">{{ policyTurtle }}</pre>
      </details>
    </div>
  </div>
</template>
