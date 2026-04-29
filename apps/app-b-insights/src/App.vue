<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSessionStore } from 'solid-helper-vue';
import { useHealthData } from './composables/useHealthData';
import { generateInsights, reportFromTurtle, type InsightsReport } from './insights';
import { saveReportToPod } from './podWriter';
import { SOLID_SERVER } from '@dtou-demo/dtou-client';
import PolicyPanel from './components/PolicyPanel.vue';
import InsightsCard from './components/InsightsCard.vue';
import OutputPolicyBadge from './components/OutputPolicyBadge.vue';
import { APP_B_POLICY } from './policy';
import type { CompatibilityResult } from '@dtou-demo/dtou-client';

const IDP = 'http://localhost:3000';
const REDIRECT_URL = window.location.href;

const sessionStore = useSessionStore();
onMounted(() => sessionStore.handleRedirectAfterLogin(REDIRECT_URL));

const isLoggedIn = computed(() => sessionStore.isLoggedIn);
const webId = computed(() => sessionStore.webid);
const fetchFn = computed(() => sessionStore.session?.fetch as typeof fetch | undefined);

async function login() {
  await sessionStore.login(IDP, REDIRECT_URL, 'DToU Demo – Health Insights');
}
async function logout() {
  await sessionStore.logout();
}

const { data, error, loadData } = useHealthData(() => fetchFn.value);
const compatibility = ref<CompatibilityResult | null>(null);

const report = ref<InsightsReport | null>(null);
const generating = ref(false);
const saved = ref(false);
const savedUrls = ref({ reportUrl: '', policyUrl: '' });

const savedReport = ref<InsightsReport | null>(null);
const loadingReport = ref(false);
const loadReportError = ref<string | null>(null);

async function handleLoadReport() {
  loadingReport.value = true;
  loadReportError.value = null;
  try {
    const url = `${SOLID_SERVER}/alice/health/insights/report.ttl`;
    const res = await (fetchFn.value ?? fetch)(url, { headers: { Accept: 'text/turtle' } });
    if (!res.ok) throw new Error(`Pod returned ${res.status}`);
    const turtle = await res.text();
    const parsed = await reportFromTurtle(turtle, url);
    if (!parsed) throw new Error('No InsightsReport found in document');
    savedReport.value = parsed;
  } catch (e: any) {
    loadReportError.value = e.message ?? 'Unknown error';
  } finally {
    loadingReport.value = false;
  }
}

function onResult(result: CompatibilityResult) {
  compatibility.value = result;
  if (result.compatible) loadData();
}

function handleGenerate() {
  if (!data.value) return;
  generating.value = true;
  report.value = generateInsights(data.value.heartRate, data.value.steps, data.value.sleep);
  generating.value = false;
}

async function handleSave() {
  if (!report.value) return;
  const result = await saveReportToPod(report.value, '# derived policy (mock)', fetchFn.value);
  savedUrls.value = result;
  saved.value = true;
}
</script>

<template>
  <div class="min-h-screen bg-green-50">
    <header class="bg-green-600 text-white px-6 py-4 shadow flex items-center gap-4">
      <div class="flex-1">
        <h1 class="text-2xl font-bold">Health Insights</h1>
        <p class="text-sm opacity-75">Analyse your health trends · Save to your Pod · Solid-DToU</p>
      </div>
      <div class="flex items-center gap-3 text-sm shrink-0">
        <template v-if="isLoggedIn">
          <span class="opacity-75 text-xs truncate max-w-48" :title="webId">
            {{ webId?.split('/profile')[0].split('/').pop() ?? webId }}
          </span>
          <button
            @click="logout"
            class="px-3 py-1.5 rounded border border-white/50 hover:bg-green-700 transition-colors text-xs font-medium"
          >
            Logout
          </button>
        </template>
        <button
          v-else
          @click="login"
          class="px-3 py-1.5 rounded bg-white text-green-700 font-semibold hover:bg-green-50 transition-colors text-xs"
        >
          Login with Solid
        </button>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <PolicyPanel :app-policy="APP_B_POLICY" :fetch-fn="fetchFn" @result="onResult" />

      <div v-if="error" class="text-red-600 p-4 bg-red-50 rounded">{{ error }}</div>

      <div v-if="data">
        <button
          @click="handleGenerate"
          :disabled="generating"
          class="px-5 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 disabled:opacity-50"
        >
          {{ generating ? 'Generating…' : 'Generate Insights' }}
        </button>
      </div>

      <InsightsCard v-if="report" :report="report" />

      <div v-if="report && !saved">
        <button
          @click="handleSave"
          class="px-5 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800"
        >
          Save to Pod (with derived policy)
        </button>
      </div>

      <OutputPolicyBadge
        :shown="saved"
        :report-url="savedUrls.reportUrl"
        :policy-url="savedUrls.policyUrl"
      />

      <!-- Read back saved report from Pod -->
      <div class="border-t border-gray-200 pt-4 space-y-3">
        <div class="flex items-center gap-3">
          <h2 class="text-sm font-semibold text-gray-700">Saved Insights Report</h2>
          <button
            @click="handleLoadReport"
            :disabled="loadingReport"
            class="px-3 py-1.5 text-xs rounded border border-green-400 text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50"
          >
            {{ loadingReport ? 'Loading…' : 'Load from Pod' }}
          </button>
        </div>
        <p v-if="loadReportError" class="text-xs text-red-600 bg-red-50 rounded px-3 py-2">
          {{ loadReportError }}
        </p>
        <InsightsCard v-if="savedReport" :report="savedReport" />
      </div>
    </main>

    <footer class="text-center text-xs text-gray-400 py-6">
      Output policy derived automatically by DToU
    </footer>
  </div>
</template>
