<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSessionStore } from 'solid-helper-vue';
import { useHealthData } from './composables/useHealthData';
import { generateInsights, reportToTurtle, MOCK_DERIVED_POLICY_TURTLE, type InsightsReport } from './insights';
import { saveReportToPod } from './podWriter';
import PolicyPanel from './components/PolicyPanel.vue';
import InsightsCard from './components/InsightsCard.vue';
import OutputPolicyBadge from './components/OutputPolicyBadge.vue';
import { APP_B_POLICY } from './policy';
import { fetchDerivedPolicy, MOCK_MODE, SOLID_SERVER } from '@dtou-demo/dtou-client';
import type { CompatibilityResult } from '@dtou-demo/dtou-client';

const IDP = 'http://localhost:3000';
const REDIRECT_URL = window.location.href;

const OUTPUT_PORT_NAME = APP_B_POLICY.outputs[0].port.name; // 'insightsOutput'
const OUTPUT_URL = `${SOLID_SERVER}/alice/health/insights/report.ttl`;

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

// derived policy: updated from server after compliance check, fallback to mock
const derivedPolicyTurtle = ref<string>(MOCK_DERIVED_POLICY_TURTLE);

const report = ref<InsightsReport | null>(null);
const reportTurtle = ref<string | null>(null);
const saving = ref(false);
const saved = ref(false);
const savedUrls = ref({ reportUrl: '', policyUrl: '' });

function onResult(result: CompatibilityResult) {
  compatibility.value = result;
  if (result.compatible) loadData();
}

function handleGenerate() {
  if (!data.value) return;
  report.value = generateInsights(data.value.heartRate, data.value.steps, data.value.sleep);
  reportTurtle.value = reportToTurtle(report.value);
  saved.value = false;
  savedUrls.value = { reportUrl: '', policyUrl: '' };
}

async function handleSave() {
  if (!report.value) return;
  saving.value = true;
  try {
    if (!MOCK_MODE) {
      try {
        const turtle = await fetchDerivedPolicy(OUTPUT_PORT_NAME, OUTPUT_URL, fetchFn.value);
        if (turtle.trim()) derivedPolicyTurtle.value = turtle;
      } catch (e) {
        console.warn('Could not fetch derived policy from server, using mock:', e);
      }
    }
    const result = await saveReportToPod(report.value, derivedPolicyTurtle.value, fetchFn.value);
    savedUrls.value = result;
    saved.value = true;
  } finally {
    saving.value = false;
  }
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

      <!-- Generate button (visible once data is loaded) -->
      <div v-if="data" class="flex items-center gap-3">
        <button
          @click="handleGenerate"
          class="px-5 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          {{ report ? 'Regenerate' : 'Generate Insights' }}
        </button>
      </div>

      <!-- App-generated: stats + report.ttl preview -->
      <InsightsCard
        v-if="report && reportTurtle"
        :report="report"
        :report-turtle="reportTurtle"
      />

      <div v-if="report && !saved" class="flex items-center gap-3">
        <button
          @click="handleSave"
          :disabled="saving"
          class="px-5 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800 disabled:opacity-50"
        >
          {{ saving ? 'Deriving policy & saving…' : 'Save to Pod (with derived policy)' }}
        </button>
        <span class="text-xs text-gray-500">
          The DToU server will derive a policy for the report when saved.
        </span>
      </div>

      <!-- Pod output: saved content + verify fetch-back -->
      <OutputPolicyBadge
        :shown="saved"
        :report-url="savedUrls.reportUrl"
        :policy-url="savedUrls.policyUrl"
        :saved-report-turtle="reportTurtle ?? ''"
        :saved-policy-turtle="derivedPolicyTurtle"
        :fetch-fn="fetchFn"
      />
    </main>

    <footer class="text-center text-xs text-gray-400 py-6">
      Output policy derived automatically by DToU
    </footer>
  </div>
</template>
