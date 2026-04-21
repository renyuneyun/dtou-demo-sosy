<script setup lang="ts">
import type { Conflict } from '@dtou-demo/dtou-client';
const props = defineProps<{ conflict: Conflict }>();
</script>

<template>
  <div class="bg-white border-2 border-red-300 rounded-lg p-4 space-y-3">
    <div class="flex items-center gap-2 text-red-700 font-bold">
      <span>✗</span>
      <span>Conflict: {{ props.conflict.type }}</span>
    </div>

    <p class="text-sm text-gray-700">{{ props.conflict.detail }}</p>

    <div v-if="props.conflict.type === 'ProhibitedUse'" class="text-xs space-y-1">
      <p class="font-semibold text-gray-600">Activation condition:</p>
      <pre class="bg-slate-900 text-slate-100 rounded p-3 overflow-x-auto leading-relaxed">:activation_condition [
    :purpose vocab:commercial-research
] .
<span class="text-yellow-400"># :app omitted — matches any app</span></pre>
      <p class="text-gray-500 italic">
        Alice blocked this <em>purpose</em>, not this specific app by name.
        Any app declaring <code class="bg-gray-100 px-1 rounded">vocab:commercial-research</code>
        is blocked, including apps she had never heard of when she wrote the policy.
      </p>
    </div>

    <div v-if="props.conflict.type === 'UnmatchedExpectation'" class="text-xs text-gray-500 italic">
      Alice's data has no Purpose Tagging for <code class="bg-gray-100 px-1 rounded">vocab:commercial-research</code>.
      The app expected to find one — it doesn't exist.
    </div>
  </div>
</template>
