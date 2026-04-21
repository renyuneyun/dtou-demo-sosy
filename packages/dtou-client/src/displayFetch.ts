import type { DataPolicyDisplay } from './types.js';
import { MOCK_MODE } from './config.js';

const MOCK_DTOU_TURTLE = `@prefix :      <http://example.org/ns#> .
@prefix demo:  <http://example.org/dtou-demo#> .
@prefix vocab: <http://example.org/dtou-demo/vocab#> .

demo:attr-health-suggest a :Attribute ;
    :name  demo:health-suggest-id ;
    :class <urn:dtou-demo:purpose-health-suggestions> ;
    :value :nil .

demo:tagging-health-suggest a :Purpose ;
    :attribute_ref demo:attr-health-suggest .

demo:prohibition-commercial a :Prohibition ;
    :mode :Use ;
    :activation_condition [
        :purpose vocab:commercial-research
    ] .

demo:health-data-policy a :DataPolicy ;
    :attribute   demo:attr-health-suggest ;
    :tag         demo:tagging-health-suggest ;
    :prohibition demo:prohibition-commercial .`;

/**
 * Fetch a .dtou file for UI display purposes only.
 * This is NOT part of the policy check flow — just for showing the policy
 * to the user in the demo's information panel.
 */
export async function fetchDataPolicyForDisplay(
  resourceUrl: string,
): Promise<DataPolicyDisplay> {
  if (MOCK_MODE) {
    return { resourceUrl, raw: MOCK_DTOU_TURTLE };
  }

  const policyUrl = `${resourceUrl}.dtou`;
  try {
    const res = await fetch(policyUrl, { headers: { Accept: 'text/turtle' } });
    const raw = res.ok ? await res.text() : `# Could not fetch: ${policyUrl}`;
    return { resourceUrl, raw };
  } catch {
    return { resourceUrl, raw: `# Could not fetch: ${policyUrl}` };
  }
}
