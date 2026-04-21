import type { AppPolicy } from '@dtou-demo/dtou-client';
import {
  APP_WELLNESS_JOURNAL,
  PURPOSE_HEALTH_SUGGESTIONS,
  CONCEPT_HEALTH_SUGGESTIONS,
} from '@dtou-demo/dtou-client';

const APP = 'http://example.org/app#';
const mkPort = (suffix: string, name: string) => ({ uri: `${APP}${suffix}`, name });

export const APP_A_POLICY: AppPolicy = {
  uri: `${APP}WellnessJournalPolicy`,
  appNameUri: APP_WELLNESS_JOURNAL,
  appDisplayName: 'Daily Wellness Journal',
  description:
    'A personal journaling app. Reads your health metrics (heart rate, steps, sleep) ' +
    'as context for your daily entries. No data leaves your Pod.',
  inputs: [
    {
      uri: `${APP}a-input-hr`,
      dataUri: 'http://localhost:3000/alice/health/heartrate/',
      port: mkPort('port-a-hr', 'heartRateInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
    {
      uri: `${APP}a-input-steps`,
      dataUri: 'http://localhost:3000/alice/health/steps/',
      port: mkPort('port-a-steps', 'stepsInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
    {
      uri: `${APP}a-input-sleep`,
      dataUri: 'http://localhost:3000/alice/health/sleep/',
      port: mkPort('port-a-sleep', 'sleepInput'),
      purposes: [{ uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS }],
      provides: [],
      downstreams: [],
    },
  ],
  outputs: [],
};
