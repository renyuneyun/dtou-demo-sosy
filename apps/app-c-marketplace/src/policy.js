import { APP_HEALTHSHARE_PRO, PURPOSE_HEALTH_SUGGESTIONS, CONCEPT_HEALTH_SUGGESTIONS, PURPOSE_COMMERCIAL_RESEARCH, CONCEPT_COMMERCIAL_RESEARCH, } from '@dtou-demo/dtou-client';
const APP = 'urn:dtou-demo:app#';
const mkPort = (suffix, name) => ({ uri: `${APP}${suffix}`, name });
export const APP_C_POLICY = {
    uri: `${APP}HealthShareProPolicy`,
    appNameUri: APP_HEALTHSHARE_PRO,
    appDisplayName: 'HealthShare Pro',
    description: 'Aggregates your health data with data from other users and shares it with ' +
        'commercial health research partners. You may earn reward points.',
    inputs: [
        {
            uri: `${APP}c-input-hr`,
            dataUri: 'http://localhost:3000/alice/health/heartrate/',
            port: mkPort('port-c-hr', 'heartRateInput'),
            purposes: [
                { uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS },
                { uri: PURPOSE_COMMERCIAL_RESEARCH, name: CONCEPT_COMMERCIAL_RESEARCH },
            ],
            provides: [],
            downstreams: [],
        },
        {
            uri: `${APP}c-input-steps`,
            dataUri: 'http://localhost:3000/alice/health/steps/',
            port: mkPort('port-c-steps', 'stepsInput'),
            purposes: [
                { uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS },
                { uri: PURPOSE_COMMERCIAL_RESEARCH, name: CONCEPT_COMMERCIAL_RESEARCH },
            ],
            provides: [],
            downstreams: [],
        },
        {
            uri: `${APP}c-input-sleep`,
            dataUri: 'http://localhost:3000/alice/health/sleep/',
            port: mkPort('port-c-sleep', 'sleepInput'),
            purposes: [
                { uri: PURPOSE_HEALTH_SUGGESTIONS, name: CONCEPT_HEALTH_SUGGESTIONS },
                { uri: PURPOSE_COMMERCIAL_RESEARCH, name: CONCEPT_COMMERCIAL_RESEARCH },
            ],
            provides: [],
            downstreams: [],
        },
    ],
    outputs: [
        {
            uri: `${APP}c-output-aggregate`,
            port: mkPort('port-c-out', 'aggregatedOutput'),
            fromPorts: [`${APP}port-c-hr`, `${APP}port-c-steps`, `${APP}port-c-sleep`],
            refinements: [
                {
                    type: 'Delete',
                    filter: {
                        name: 'urn:dtou-demo:vocab#health-data-personal',
                        cls: 'personal',
                        value: 'nil',
                    },
                },
            ],
        },
    ],
};
