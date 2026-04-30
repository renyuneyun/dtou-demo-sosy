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
  </div>
</template>
