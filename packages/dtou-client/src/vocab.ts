export const VOCAB_BASE = 'http://example.org/dtou-demo/vocab#';
export const URN_BASE   = 'urn:dtou-demo:';
export const APP_BASE   = 'http://example.org/app#';

// PurposeExpectation resource URIs (used in InputSpec :purpose)
export const PURPOSE_HEALTH_SUGGESTIONS: string  = `${VOCAB_BASE}provide-health-suggestions`;
export const PURPOSE_COMMERCIAL_RESEARCH: string = `${VOCAB_BASE}commercial-research`;

// Concept name URIs (:name on PurposeExpectation = :class on Attribute in data policy)
export const CONCEPT_HEALTH_SUGGESTIONS: string  = `${URN_BASE}purpose-health-suggestions`;
export const CONCEPT_COMMERCIAL_RESEARCH: string = `${URN_BASE}purpose-commercial-research`;

export const APP_HEALTHSHARE_PRO: string  = `${APP_BASE}HealthSharePro`;
export const APP_WELLNESS_JOURNAL: string = `${APP_BASE}DailyWellnessJournal`;
export const APP_HEALTH_INSIGHTS: string  = `${APP_BASE}HealthInsights`;
