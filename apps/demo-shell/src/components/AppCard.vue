<script setup lang="ts">
import type { AppEntry } from '../apps';
const props = defineProps<{ app: AppEntry }>();
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden flex flex-col">
    <!-- Coloured header strip -->
    <!-- Tailwind safelist: bg-amber-600 bg-teal-600 bg-orange-600 -->
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
