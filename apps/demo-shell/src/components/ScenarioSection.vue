<template>
  <section class="bg-amber-50 border border-amber-200 rounded-lg p-6 text-gray-700">
    <h2 class="text-xl font-semibold text-slate-800 mb-3">The Scenario</h2>
    <div class="flex flex-col md:flex-row gap-6 items-start">
      <div class="flex-1 space-y-2 text-sm">
        <p>
          <strong>Alice</strong> stores health data (heart rate, steps, sleep) in her
          <strong>Solid Pod</strong>.
        </p>
        <p>
          She writes a <strong>data policy</strong> once:
          <em>"Any app declaring <code class="bg-amber-100 px-1 rounded">vocab:commercial-research</code>
          as its purpose may not use my health data."</em>
        </p>
        <p>
          Three apps — a journal, an analytics tool, and a commercial platform —
          each declare their own app policy. The DToU reasoner checks each one
          <strong>automatically</strong>, before any data is accessed.
        </p>
      </div>
      <!-- Simple visual flow: Pod → Reasoner → 3 apps -->
      <div class="shrink-0 text-center text-sm text-slate-600 space-y-1">
        <div class="bg-amber-100 border border-amber-300 rounded px-3 py-2">Alice's Pod</div>
        <div>↓ data policy (.dtou)</div>
        <div class="bg-slate-100 border border-slate-300 rounded px-3 py-2">DToU Reasoner</div>
        <div class="flex gap-2 justify-center mt-1">
          <span class="bg-green-100 border border-green-300 rounded px-2 py-1">App A ✓</span>
          <span class="bg-green-100 border border-green-300 rounded px-2 py-1">App B ✓</span>
          <span class="bg-red-100 border border-red-300 rounded px-2 py-1">App C ✗</span>
        </div>
      </div>
    </div>
  </section>
</template>
