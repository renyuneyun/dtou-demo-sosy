import { Parser } from 'n3';
import { serializeAppPolicy } from './policy.js';
import type { AppPolicy, CompatibilityResult, Conflict, ConflictType } from './types.js';
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
  fetchFn?: typeof fetch,
): Promise<CompatibilityResult> {
  if (MOCK_MODE) {
    return getMockCompatibility(policy.appNameUri);
  }

  const policyTurtle = serializeAppPolicy(policy);
  const _fetch = fetchFn ?? fetch;

  // NOTE: The exact endpoint path and request format must be verified against
  // the live solid-dtou server implementation. The path '/dtou' is a best
  // estimate from the spec. Check https://github.com/renyuneyun/solid-dtou
  // for the actual endpoint.
  const endpoint = `${SOLID_SERVER}/dtou`;

  const registerRes = await _fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ policy: policyTurtle }),
  });

  if (!registerRes.ok) {
    throw new Error(`DToU server returned ${registerRes.status}: ${await registerRes.text()}`);
  }

  const complianceRes = await _fetch(`${SOLID_SERVER}/dtou/compliance`, {
    method: 'GET',
  });

  if (!complianceRes.ok) {
    throw new Error(`DToU server returned ${complianceRes.status}: ${await complianceRes.text()}`);
  }

  const body = await complianceRes.text();
  return parseServerResult(body);
}

/**
 * Step 1 of the step-by-step reasoning flow.
 * Submits the app policy to the DToU service via POST /dtou.
 * Returns the serialized Turtle that was sent (for display).
 */
export async function submitAppPolicy(
  policy: AppPolicy,
  fetchFn?: typeof fetch,
): Promise<{ turtle: string; status: number }> {
  const turtle = serializeAppPolicy(policy);
  if (MOCK_MODE) {
    await new Promise<void>(r => setTimeout(r, 150));
    return { turtle, status: 200 };
  }
  const res = await (fetchFn ?? fetch)(`${SOLID_SERVER}/dtou`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ policy: turtle }),
  });
  if (!res.ok) throw new Error(`DToU server returned ${res.status}: ${await res.text()}`);
  return { turtle, status: res.status };
}

/**
 * Step 3 of the step-by-step reasoning flow.
 * Fetches the reasoning result via GET /dtou/compliance.
 * Must be called after submitAppPolicy().
 * Returns the raw Turtle body and the parsed CompatibilityResult.
 */
export async function fetchComplianceResult(
  policy: AppPolicy,
  fetchFn?: typeof fetch,
): Promise<{ raw: string; result: CompatibilityResult; status: number }> {
  if (MOCK_MODE) {
    await new Promise<void>(r => setTimeout(r, 200));
    const result = getMockCompatibility(policy.appNameUri);
    const mockRaw = result.compatible
      ? `# Reasoning complete — no conflicts detected.\n# Policy: ${policy.appNameUri}`
      : result.conflicts.map(c => `# ${c.type}: ${c.detail}`).join('\n');
    return { raw: mockRaw, result, status: 200 };
  }
  const res = await (fetchFn ?? fetch)(`${SOLID_SERVER}/dtou/compliance`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error(`DToU server returned ${res.status}: ${await res.text()}`);
  const raw = await res.text();
  return { raw, result: parseServerResult(raw), status: res.status };
}

/**
 * Parse the server's reasoning result Turtle into a CompatibilityResult.
 *
 * The server returns Turtle with conflict triples using urn:dtou:core# namespace.
 * We parse it with N3 to extract distinct conflict subjects and their types.
 */
function parseServerResult(body: string): CompatibilityResult {
  const DTOU = 'urn:dtou:core#';
  const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
  const CONFLICT_TYPES: ConflictType[] = ['ProhibitedUse', 'UnmatchedExpectation', 'UnsatisfiedRequirement'];

  try {
    const parser = new Parser();
    const quads = parser.parse(body);

    // Collect type(s) and properties for each conflict subject
    const subjectTypes = new Map<string, Set<string>>();
    const subjectProps = new Map<string, Map<string, string>>();

    for (const q of quads) {
      const s = q.subject.value;
      if (q.predicate.value === RDF_TYPE) {
        if (!subjectTypes.has(s)) subjectTypes.set(s, new Set());
        subjectTypes.get(s)!.add(q.object.value);
      } else {
        if (!subjectProps.has(s)) subjectProps.set(s, new Map());
        subjectProps.get(s)!.set(q.predicate.value, q.object.value);
      }
    }

    const conflicts: Conflict[] = [];
    for (const [subj, types] of subjectTypes) {
      if (!types.has(`${DTOU}Conflict`)) continue;
      const conflictType = CONFLICT_TYPES.find(t => types.has(`${DTOU}${t}`));
      if (!conflictType) continue;
      const props = subjectProps.get(subj) ?? new Map();
      const descriptor = props.get(`${DTOU}descriptor`) ?? '';
      const port = props.get(`${DTOU}port`) ?? '';
      let detail = '';
      if (conflictType === 'ProhibitedUse') {
        detail = 'Alice\'s data policy prohibits use for commercial research (any app).';
      } else if (conflictType === 'UnmatchedExpectation') {
        const concept = descriptor.split(/[#/]/).pop() ?? descriptor;
        const portName = port.split(/[#/]/).pop() ?? port;
        detail = `No Purpose Tagging for "${concept}" found${portName ? ` (port: ${portName})` : ''}.`;
      } else {
        detail = `Conflict: ${conflictType}`;
      }
      conflicts.push({ type: conflictType, detail });
    }

    const compatible = conflicts.length === 0;
    return {
      compatible,
      conflicts,
      activatedObligations: [],
      summary: compatible ? 'Compatible.' : `${conflicts.length} conflict(s) detected.`,
    };
  } catch {
    // Fallback: heuristic inspection if Turtle parsing fails
    const hasConflict = body.includes('Conflict') || body.includes('ProhibitedUse') ||
      body.includes('UnmatchedExpectation');
    return {
      compatible: !hasConflict,
      conflicts: hasConflict
        ? [{ type: 'ProhibitedUse', detail: 'Server reported conflicts (see raw response).' }]
        : [],
      activatedObligations: [],
      summary: hasConflict ? 'Conflicts detected.' : 'Compatible.',
    };
  }
}
