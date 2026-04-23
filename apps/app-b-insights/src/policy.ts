import type { AppPolicy } from '@dtou-demo/dtou-client';
import {
  APP_HEALTH_INSIGHTS,
  PURPOSE_HEALTH_SUGGESTIONS,
  CONCEPT_HEALTH_SUGGESTIONS,
} from '@dtou-demo/dtou-client';

const APP = 'urn:dtou-demo:app#';
const mkPort = (suffix: string, name: string) => ({ uri: `${APP}${suffix}`, name });

export const APP_B_POLICY: AppPolicy = {
  uri: `${APP}HealthInsightsPolicy`,
  appNameUri: APP_HEALTH_INSIGHTS,
  appDisplayName: 'Health Insights',
  description:
    'Analyzes your health data and generates a personalized insights report. ' +
    'The report is written back to your Pod and inherits your data policy ' +
    'automatically via DToU policy derivation.',
  inputs: [
    {
      uri: `${APP}b-input-hr`,
      dataUri: 'http://localhost:3000/alice/health/heartrate/',
      port: mkPort('port-b-hr', 'heartRateInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
    {
      uri: `${APP}b-input-steps`,
      dataUri: 'http://localhost:3000/alice/health/steps/',
      port: mkPort('port-b-steps', 'stepsInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
    {
      uri: `${APP}b-input-sleep`,
      dataUri: 'http://localhost:3000/alice/health/sleep/',
      port: mkPort('port-b-sleep', 'sleepInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
  ],
  outputs: [
    {
      uri: `${APP}b-output-insights`,
      port: mkPort('port-b-out', 'insightsOutput'),
      fromPorts: [`${APP}port-b-hr`, `${APP}port-b-steps`, `${APP}port-b-sleep`],
      refinements: [], // no deletion = full policy inheritance
    },
  ],
};
