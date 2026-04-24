<script setup lang="ts">
import { ref } from 'vue';
import PolicyPanel from './components/PolicyPanel.vue';
import ConflictCard from './components/ConflictCard.vue';
import { APP_C_POLICY } from './policy';
import type { CompatibilityResult } from '@dtou-demo/dtou-client';

const compatibility = ref<CompatibilityResult | null>(null);
</script>

<template>
  <div class="min-h-screen bg-rose-50">
    <header class="bg-rose-700 text-white px-6 py-4 shadow">
      <h1 class="text-2xl font-bold">HealthShare Pro™</h1>
      <p class="text-sm opacity-75">Your health data powers tomorrow's medical breakthroughs.</p>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <PolicyPanel :app-policy="APP_C_POLICY" @result="compatibility = $event" />

      <div v-if="compatibility && !compatibility.compatible"
           class="bg-red-50 border-2 border-red-400 rounded-lg p-6 space-y-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🚫</span>
          <h2 class="text-xl font-bold text-red-700">Access Blocked by DToU Reasoner</h2>
        </div>

        <ConflictCard
          v-for="(c, i) in compatibility.conflicts"
          :key="i"
          :conflict="c"
        />

        <p class="text-sm text-red-600 bg-red-100 rounded p-3">
          No data was accessed. The compatibility check ran before any request
          was made to Alice's Pod.
        </p>
      </div>

      <!-- This section intentionally never renders: policy check always fails for App C -->
      <div v-if="compatibility?.compatible" class="text-green-700 p-4">
        (This should not appear in the demo.)
      </div>
    </main>

    <footer class="max-w-3xl mx-auto px-4 pb-8">
      <div class="bg-gray-100 rounded p-4 text-sm text-gray-600 border border-gray-300">
        <strong>Without DToU:</strong> You would need to read HealthShare Pro's privacy policy
        to know this would happen. DToU checked it automatically — before any data was touched.
      </div>
    </footer>
  </div>
</template>
