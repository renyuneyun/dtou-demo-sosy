import type { DataPolicyDisplay } from './types.js';
import { MOCK_MODE } from './config.js';

const MOCK_DTOU_TURTLE = `@prefix dtou:  <urn:dtou:core#> .
@prefix demo:  <urn:dtou-demo:> .
@prefix vocab: <urn:dtou-demo:vocab#> .

demo:attr-health-suggest a dtou:Attribute ;
    dtou:name  demo:health-suggest-attr-name ;
    dtou:class vocab:health-suggestions ;
    dtou:value vocab:nil .

demo:tagging-health-suggest a dtou:PurposeTag ;
    dtou:attribute_ref demo:attr-health-suggest .

demo:prohibition-commercial a dtou:Prohibition ;
    dtou:mode dtou:Use ;
    dtou:activation_condition [
        dtou:purpose vocab:commercial-research
    ] .

demo:health-data-policy a dtou:DataPolicy ;
    dtou:attribute   demo:attr-health-suggest ;
    dtou:tagging     demo:tagging-health-suggest ;
    dtou:prohibition demo:prohibition-commercial .`;

/**
 * Fetch a .dtou file for UI display purposes only.
 * This is NOT part of the policy check flow — just for showing the policy
 * to the user in the demo's information panel.
 */
export async function fetchDataPolicyForDisplay(
  resourceUrl: string,
  fetchFn?: typeof fetch,
): Promise<DataPolicyDisplay> {
  if (MOCK_MODE) {
    return { resourceUrl, raw: MOCK_DTOU_TURTLE, status: 200 };
  }

  const policyUrl = `${resourceUrl}.dtou`;
  try {
    const res = await (fetchFn ?? fetch)(policyUrl, { headers: { Accept: 'text/turtle' } });
    const raw = res.ok ? await res.text() : `# Could not fetch: ${policyUrl}`;
    return { resourceUrl, raw, status: res.status };
  } catch {
    return { resourceUrl, raw: `# Could not fetch: ${policyUrl}`, status: 0 };
  }
}
