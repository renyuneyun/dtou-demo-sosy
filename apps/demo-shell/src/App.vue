<script setup lang="ts">
import ExplainerSection from './components/ExplainerSection.vue';
import ScenarioSection from './components/ScenarioSection.vue';
import AppCard from './components/AppCard.vue';
import DataPolicyViewer from './components/DataPolicyViewer.vue';
import ComparisonTable from './components/ComparisonTable.vue';
import { APPS } from './apps';
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-slate-800 text-white px-8 py-6 flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-bold">Solid-DToU Demo</h1>
        <p class="text-slate-300 mt-1 text-sm max-w-xl">
          Automated, non-coordinated data usage policy checking for the Solid ecosystem
        </p>
        <p class="text-slate-400 text-xs mt-1">
          Oxford Human-Centred Computing Group · WWW 2024
        </p>
      </div>
      <div class="flex gap-4 text-sm pt-1">
        <a href="https://arxiv.org/abs/2403.07587" target="_blank"
           class="underline opacity-70 hover:opacity-100">Paper ↗</a>
        <a href="https://github.com/renyuneyun/solid-dtou" target="_blank"
           class="underline opacity-70 hover:opacity-100">GitHub ↗</a>
        <a href="https://me.ryey.icu/solid-dtou/dtou-spec.html" target="_blank"
           class="underline opacity-70 hover:opacity-100">Spec ↗</a>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <ExplainerSection />
      <ScenarioSection />

      <section>
        <h2 class="text-xl font-semibold text-slate-800 mb-4">Three Apps, Three Outcomes</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AppCard v-for="app in APPS" :key="app.id" :app="app" />
        </div>
      </section>

      <DataPolicyViewer />
      <ComparisonTable />
    </main>

    <footer class="text-center text-xs text-gray-400 py-8">
      Solid-DToU · Oxford Human-Centred Computing Group · WWW 2024 ·
      <a href="https://arxiv.org/abs/2403.07587" class="underline">arXiv:2403.07587</a>
    </footer>
  </div>
</template>
