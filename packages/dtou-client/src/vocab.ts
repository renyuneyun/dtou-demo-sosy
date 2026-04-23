export const VOCAB_BASE = 'urn:dtou-demo:vocab#';
export const APP_BASE   = 'urn:dtou-demo:app#';

// PurposeExpectation resource URIs (node identity; used in InputSpec dtou:purpose)
export const PURPOSE_HEALTH_SUGGESTIONS: string  = `${VOCAB_BASE}purpose-health-suggestions`;
export const PURPOSE_COMMERCIAL_RESEARCH: string = `${VOCAB_BASE}purpose-commercial-research`;

// Concept name URIs (dtou:descriptor on PE = dtou:class on Attribute in data policy)
export const CONCEPT_HEALTH_SUGGESTIONS: string  = `${VOCAB_BASE}health-suggestions`;
export const CONCEPT_COMMERCIAL_RESEARCH: string = `${VOCAB_BASE}commercial-research`;

export const APP_HEALTHSHARE_PRO: string  = `${APP_BASE}HealthSharePro`;
export const APP_WELLNESS_JOURNAL: string = `${APP_BASE}DailyWellnessJournal`;
export const APP_HEALTH_INSIGHTS: string  = `${APP_BASE}HealthInsights`;
