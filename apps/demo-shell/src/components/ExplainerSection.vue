<template>
  <section class="bg-white rounded-lg shadow p-6 space-y-3 text-gray-700 leading-relaxed">
    <h2 class="text-xl font-semibold text-slate-800">What is Solid-DToU?</h2>
    <p>
      <strong class="text-blue-700">Solid-DToU</strong> (Data Terms of Use) is a
      policy language and automated reasoning system for the
      <a href="https://solidproject.org" target="_blank" class="underline">Solid</a> ecosystem.
      A data owner writes a <strong class="text-blue-700">data policy</strong> once —
      covering a type or location of data — expressing how it may be used.
      An app writes an <strong class="text-blue-700">app policy</strong> once —
      declaring how it consumes and transforms data.
      An automated reasoner checks compatibility between the two, with no bilateral
      negotiation and no manual review by the user.
    </p>
    <p>
      The key advance over existing approaches (WAC/ACP, SAI, ODRL) is
      <strong class="text-blue-700">non-coordination</strong>: both sides write
      their policies independently, using shared ontological concepts (shared vocabulary URIs).
      Data produced by an app also receives a
      <strong class="text-blue-700">derived policy</strong> computed from the input
      data policies — privacy constraints propagate through data pipelines automatically.
    </p>
  </section>
</template>
