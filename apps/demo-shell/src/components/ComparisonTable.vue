<script setup lang="ts">
const rows = [
  {
    feature: 'Policy authoring burden',
    wac: 'Per-resource ACL per app',
    sai: 'Per-authorization-agent negotiation',
    odrl: 'Per bilateral agreement',
    dtou: 'Once per data type / location',
  },
  {
    feature: 'App accountability',
    wac: 'None — user decides manually',
    sai: 'App registers with auth agent',
    odrl: 'Depends on enforcement layer',
    dtou: 'App declares usage policy (verifiable)',
  },
  {
    feature: 'Automated compliance check',
    wac: '✗',
    sai: 'Partial',
    odrl: 'Possible, complex',
    dtou: '✓ Built-in N3 reasoner',
  },
  {
    feature: 'Policy derivation for outputs',
    wac: '✗',
    sai: '✗',
    odrl: 'Manual',
    dtou: '✓ Automatic (OutputSpec)',
  },
  {
    feature: 'Non-coordinated parties',
    wac: '✗ (user reads each privacy policy)',
    sai: '✗ (requires auth agent agreement)',
    odrl: '✗ (requires bilateral contract)',
    dtou: '✓ (shared ontology only)',
  },
  {
    feature: 'Solid integration',
    wac: '✓ Native',
    sai: 'Proposed spec',
    odrl: 'Via plugin',
    dtou: '✓ CSS extension (solid-dtou)',
  },
];
</script>

<template>
  <section class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-slate-800 mb-4">DToU vs. Other Approaches</h2>
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-slate-100">
            <th class="text-left p-2 border border-slate-300">Feature</th>
            <th class="text-left p-2 border border-slate-300">WAC / ACP</th>
            <th class="text-left p-2 border border-slate-300">SAI</th>
            <th class="text-left p-2 border border-slate-300">ODRL</th>
            <th class="text-left p-2 border border-slate-300 bg-blue-50 font-bold text-blue-800">DToU</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i"
              :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50'">
            <td class="p-2 border border-slate-300 font-medium">{{ row.feature }}</td>
            <td class="p-2 border border-slate-300 text-gray-600">{{ row.wac }}</td>
            <td class="p-2 border border-slate-300 text-gray-600">{{ row.sai }}</td>
            <td class="p-2 border border-slate-300 text-gray-600">{{ row.odrl }}</td>
            <td class="p-2 border border-slate-300 bg-blue-50 text-blue-800 font-medium">{{ row.dtou }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
