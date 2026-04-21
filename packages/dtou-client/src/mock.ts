import type { CompatibilityResult } from './types.js';
import { APP_HEALTHSHARE_PRO } from './vocab.js';

export function getMockCompatibility(appNameUri: string): CompatibilityResult {
  if (appNameUri === APP_HEALTHSHARE_PRO) {
    return {
      compatible: false,
      conflicts: [
        {
          type: 'UnmatchedExpectation',
          detail:
            'App "HealthShare Pro" declares purpose vocab:commercial-research, but ' +
            "Alice's health data has no Purpose Tagging for that concept. " +
            "Alice has not tagged her data as suitable for commercial research.",
        },
        {
          type: 'ProhibitedUse',
          detail:
            "App \"HealthShare Pro\" is additionally prohibited from using Alice's " +
            'health data with purpose vocab:commercial-research. ' +
            "Alice's prohibition has no :app restriction — it blocks any app " +
            'that declares this purpose.',
        },
      ],
      activatedObligations: [],
      summary: '2 conflicts detected — access denied.',
    };
  }
  return {
    compatible: true,
    conflicts: [],
    activatedObligations: [],
    summary: 'No conflicts — app policy is compatible.',
  };
}
