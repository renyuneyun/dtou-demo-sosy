import { serializeAppPolicy } from './policy.js';
import type { AppPolicy, CompatibilityResult } from './types.js';
import { SOLID_SERVER, MOCK_MODE } from './config.js';
import { getMockCompatibility } from './mock.js';

/**
 * Submit the app policy to the DToU server and get back the reasoning result.
 *
 * The server:
 * - Receives the app policy Turtle
 * - Generates a usage context (user WebID + timestamp)
 * - Fetches the relevant data policies (.dtou files) from the Pod
 * - Runs N3 reasoning (EYE reasoner) server-side
 * - Returns the compatibility result
 *
 * The client does NOT do any reasoning itself.
 */
export async function checkPolicy(
  policy: AppPolicy,
  accessToken?: string,
): Promise<CompatibilityResult> {
  if (MOCK_MODE) {
    return getMockCompatibility(policy.appNameUri);
  }

  const policyTurtle = serializeAppPolicy(policy);

  // NOTE: The exact endpoint path and request format must be verified against
  // the live solid-dtou server implementation. The path '/dtou' is a best
  // estimate from the spec. Check https://github.com/renyuneyun/solid-dtou
  // for the actual endpoint.
  const endpoint = `${SOLID_SERVER}/dtou`;

  const registerRes = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ policy: policyTurtle }),
  });

  if (!registerRes.ok) {
    throw new Error(`DToU server returned ${registerRes.status}: ${await registerRes.text()}`);
  }

  const complianceRes = await fetch(`${SOLID_SERVER}/dtou/compliance`, {
    method: 'GET',
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (!complianceRes.ok) {
    throw new Error(`DToU server returned ${complianceRes.status}: ${await complianceRes.text()}`);
  }

  const body = await complianceRes.text();
  return parseServerResult(body);
}

/**
 * Parse the server's reasoning result.
 *
 * TODO: The exact response format (JSON-LD, Turtle, plain JSON) must be
 * verified against the actual server implementation at
 * https://github.com/renyuneyun/solid-dtou before this function can be
 * finalized. The current implementation attempts JSON first, then falls back
 * to heuristic Turtle inspection.
 */
function parseServerResult(body: string): CompatibilityResult {
  try {
    const json = JSON.parse(body);
    return {
      compatible: json.compatible ?? true,
      conflicts: json.conflicts ?? [],
      activatedObligations: json.activatedObligations ?? [],
      summary: json.summary ?? (json.compatible ? 'Compatible.' : 'Conflicts detected.'),
    };
  } catch {
    // If not JSON, inspect for conflict indicators in Turtle
    const hasConflict = body.includes(':Conflict') || body.includes(':ProhibitedUse') ||
      body.includes(':UnmatchedExpectation') || body.includes(':UnsatisfiedRequirement');
    return {
      compatible: !hasConflict,
      conflicts: hasConflict
        ? [{ type: 'ProhibitedUse', detail: 'Server reported a conflict (raw response).' }]
        : [],
      activatedObligations: [],
      summary: hasConflict ? 'Conflicts detected.' : 'Compatible.',
    };
  }
}
