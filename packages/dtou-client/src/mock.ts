import type { CompatibilityResult } from './types.js';
import { APP_HEALTHSHARE_PRO } from './vocab.js';

export function getMockCompatibility(appNameUri: string): CompatibilityResult {
  if (appNameUri === APP_HEALTHSHARE_PRO) {
    const ports = ['port-c-hr', 'port-c-steps', 'port-c-sleep'];
    return {
      compatible: false,
      conflicts: [
        ...ports.map(p => ({
          type: 'UnmatchedExpectation' as const,
          detail: `No tagging for "commercial-research" found (port: ${p}).`,
        })),
        ...ports.map(() => ({
          type: 'ProhibitedUse' as const,
          detail: 'Prohibited use: purpose "commercial-research".',
        })),
      ],
      activatedObligations: [],
      summary: '6 conflict(s) detected.',
    };
  }
  return {
    compatible: true,
    conflicts: [],
    activatedObligations: [],
    summary: 'No conflicts — app policy is compatible.',
  };
}
