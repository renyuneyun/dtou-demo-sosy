<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSessionStore } from 'solid-helper-vue';
import { useHealthData } from './composables/useHealthData';
import PolicyPanel from './components/PolicyPanel.vue';
import HealthContextSidebar from './components/HealthContextSidebar.vue';
import DatePicker from './components/DatePicker.vue';
import { APP_A_POLICY } from './policy';
import type { CompatibilityResult } from '@dtou-demo/dtou-client';

const MOCK_JOURNAL: Record<string, string> = {
  '2024-03-01':
    'Productive morning — finished the literature review draft. Afternoon walk helped clear my head. Feeling good about the direction of the research.',
  '2024-03-02':
    'Long day of meetings. Skipped lunch, probably why energy was low. Need to plan better tomorrow.',
};

const IDP = 'http://localhost:3000';
const REDIRECT_URL = window.location.href;

const sessionStore = useSessionStore();
onMounted(() => sessionStore.handleRedirectAfterLogin(REDIRECT_URL));

const isLoggedIn = computed(() => sessionStore.isLoggedIn);
const webId = computed(() => sessionStore.webid);
const fetchFn = computed(() => sessionStore.session?.fetch as typeof fetch | undefined);

async function login() {
  await sessionStore.login(IDP, REDIRECT_URL, 'DToU Demo – Daily Wellness Journal');
}
async function logout() {
  await sessionStore.logout();
}

const { data, error, loadData } = useHealthData(() => fetchFn.value);
const compatibility = ref<CompatibilityResult | null>(null);
const selectedDate = ref('2024-03-01');

function onResult(result: CompatibilityResult) {
  compatibility.value = result;
  if (result.compatible) loadData();
}
</script>

<template>
  <div class="min-h-screen bg-amber-50">
    <header class="bg-amber-600 text-white px-6 py-4 shadow flex items-center gap-4">
      <div class="flex-1">
        <h1 class="text-2xl font-bold">Daily Wellness Journal</h1>
        <p class="text-sm opacity-75">Your reflections, enriched by your health context · Solid-DToU</p>
      </div>
      <div class="flex items-center gap-3 text-sm shrink-0">
        <template v-if="isLoggedIn">
          <span class="opacity-75 text-xs truncate max-w-48" :title="webId">
            {{ webId?.split('/profile')[0].split('/').pop() ?? webId }}
          </span>
          <button
            @click="logout"
            class="px-3 py-1.5 rounded border border-white/50 hover:bg-amber-700 transition-colors text-xs font-medium"
          >
            Logout
          </button>
        </template>
        <button
          v-else
          @click="login"
          class="px-3 py-1.5 rounded bg-white text-amber-700 font-semibold hover:bg-amber-50 transition-colors text-xs"
        >
          Login with Solid
        </button>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <PolicyPanel :app-policy="APP_A_POLICY" :fetch-fn="fetchFn" @result="onResult" />

      <div v-if="error" class="text-red-600 p-4 bg-red-50 rounded">{{ error }}</div>

      <div v-if="compatibility && !compatibility.compatible"
           class="bg-red-50 border border-red-300 rounded p-4">
        <h2 class="font-semibold text-red-700">Access Denied by DToU Reasoner</h2>
        <ul class="mt-2 text-sm text-red-600 list-disc list-inside">
          <li v-for="(c, i) in compatibility.conflicts" :key="i">{{ c.detail }}</li>
        </ul>
      </div>

      <template v-if="data">
        <DatePicker
          :dates="['2024-03-01', '2024-03-02']"
          v-model="selectedDate"
        />
        <div class="flex gap-6">
          <div class="flex-1 bg-white rounded-lg shadow p-6">
            <h2 class="font-semibold text-gray-700 mb-3">{{ selectedDate }} — Journal Entry</h2>
            <p class="text-gray-600 leading-relaxed italic">
              {{ MOCK_JOURNAL[selectedDate] ?? 'No entry for this date.' }}
            </p>
          </div>
          <div class="w-56 shrink-0">
            <HealthContextSidebar
              :date="selectedDate"
              :heart-rate="data.heartRate"
              :steps="data.steps"
              :sleep="data.sleep"
            />
          </div>
        </div>
      </template>
    </main>

    <footer class="text-center text-xs text-gray-400 py-6">
      Health context provided by Alice's Solid Pod via DToU
    </footer>
  </div>
</template>
