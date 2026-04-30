import type { AppPolicy } from '@dtou-demo/dtou-client';
import {
  APP_HEALTHSHARE_PRO,
  PURPOSE_HEALTH_SUGGESTIONS,
  CONCEPT_HEALTH_SUGGESTIONS,
  PURPOSE_COMMERCIAL_RESEARCH,
  CONCEPT_COMMERCIAL_RESEARCH,
} from '@dtou-demo/dtou-client';

const APP = 'urn:dtou-demo:app#';
const mkPort = (suffix: string, name: string) => ({ uri: `${APP}${suffix}`, name });

const commercialDownstream = {
  uri: `${APP}c-downstream-commercial`,
  appName: `${APP}CommercialResearchFirm`,
  purposes: [{ uri: PURPOSE_COMMERCIAL_RESEARCH, name: CONCEPT_COMMERCIAL_RESEARCH }],
};

export const APP_C_POLICY: AppPolicy = {
  uri: `${APP}HealthShareProPolicy`,
  appNameUri: APP_HEALTHSHARE_PRO,
  appDisplayName: 'HealthShare Pro',
  description:
    'Aggregates your health data and shares it with a commercial research firm. ' +
    'The downstream partner declares commercial-research purpose — prohibited ' +
    'by your data policy. Access is denied.',
  inputs: [
    {
      uri: `${APP}c-input-hr`,
      dataUri: 'http://localhost:3000/alice/health/heartrate/',
      port: mkPort('port-c-hr', 'heartRateInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [commercialDownstream],
    },
    {
      uri: `${APP}c-input-steps`,
      dataUri: 'http://localhost:3000/alice/health/steps/',
      port: mkPort('port-c-steps', 'stepsInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [commercialDownstream],
    },
    {
      uri: `${APP}c-input-sleep`,
      dataUri: 'http://localhost:3000/alice/health/sleep/',
      port: mkPort('port-c-sleep', 'sleepInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [commercialDownstream],
    },
  ],
  outputs: [
    {
      uri: `${APP}c-output-aggregate`,
      port: mkPort('port-c-out', 'aggregatedOutput'),
      fromPorts: [`${APP}port-c-hr`, `${APP}port-c-steps`, `${APP}port-c-sleep`],
      refinements: [],
    },
  ],
};
