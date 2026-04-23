<script setup lang="ts">
const POLICY_TURTLE = `@prefix dtou:  <urn:dtou:core#> .
@prefix demo:  <urn:dtou-demo:> .
@prefix vocab: <urn:dtou-demo:vocab#> .

# Information holder for the "provide health suggestions" purpose concept.
demo:attr-health-suggest a dtou:Attribute ;
    dtou:name  demo:health-suggest-attr-name ;
    dtou:class vocab:health-suggestions ;
    dtou:value vocab:nil .

# Tags data as suitable for "provide health suggestions" use.
demo:tagging-health-suggest a dtou:PurposeTag ;
    dtou:attribute_ref demo:attr-health-suggest .

# dtou:app is omitted → prohibition applies to ANY app
demo:prohibition-commercial a dtou:Prohibition ;
    dtou:mode dtou:Use ;
    dtou:activation_condition [
        dtou:purpose vocab:commercial-research
    ] .

demo:health-data-policy a dtou:DataPolicy ;
    dtou:attribute   demo:attr-health-suggest ;
    dtou:tagging     demo:tagging-health-suggest ;
    dtou:prohibition demo:prohibition-commercial .`;
</script>

<template>
  <section class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-slate-800 mb-3">Alice's Data Policy</h2>
    <p class="text-sm text-gray-600 mb-3">
      Written once. Applied automatically to all health data resources in her Pod.
    </p>
    <pre class="bg-slate-900 text-slate-100 rounded p-4 text-xs overflow-x-auto leading-relaxed">{{ POLICY_TURTLE }}</pre>
    <p class="text-xs text-gray-500 mt-2">
      The prohibition omits <code class="bg-gray-100 px-1 rounded">dtou:app</code> — it blocks <em>any</em> app from
      using her health data for <code class="bg-gray-100 px-1 rounded">vocab:commercial-research</code>. Alice did not
      need to know which commercial apps exist when she wrote this policy.
    </p>
  </section>
</template>
