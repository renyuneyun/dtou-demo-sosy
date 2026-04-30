<script setup lang="ts">
const rows = [
  {
    feature: 'Policy authoring',
    wac: 'Per-resource, per-app ACL',
    sai: 'Per authorization-agent negotiation',
    odrl: 'Per bilateral agreement',
    dtou: 'Once per data type or location',
  },
  {
    feature: 'App usage declaration',
    wac: '—',
    sai: 'App registers with auth agent',
    odrl: 'Depends on agreement structure',
    dtou: 'App declares its own usage policy',
  },
  {
    feature: 'Automated compliance check',
    wac: '—',
    sai: '—',
    odrl: 'Possible (not yet standardized)',
    dtou: 'N3 reasoner',
  },
  {
    feature: 'Policy for outputs',
    wac: '—',
    sai: '—',
    odrl: 'Manual (if in original policy)',
    dtou: 'Automatic policy derivation',
  },
];
</script>

<template>
  <section class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-slate-800 mb-1">Feature Comparison</h2>
    <p class="text-sm text-gray-500 mb-4">
      A selection of features across approaches — not intended as a comprehensive evaluation.
    </p>
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-slate-100">
            <th class="text-left p-2 border border-slate-300">Feature</th>
            <th class="text-left p-2 border border-slate-300">WAC / ACP</th>
            <th class="text-left p-2 border border-slate-300">SAI</th>
            <th class="text-left p-2 border border-slate-300">ODRL</th>
            <th class="text-left p-2 border border-slate-300 bg-blue-50 text-blue-800">DToU</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i"
              :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50'">
            <td class="p-2 border border-slate-300 font-medium">{{ row.feature }}</td>
            <td class="p-2 border border-slate-300 text-gray-600">{{ row.wac }}</td>
            <td class="p-2 border border-slate-300 text-gray-600">{{ row.sai }}</td>
            <td class="p-2 border border-slate-300 text-gray-600">{{ row.odrl }}</td>
            <td class="p-2 border border-slate-300 bg-blue-50 text-blue-800">{{ row.dtou }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
