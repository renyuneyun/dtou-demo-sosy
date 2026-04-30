export interface AppEntry {
  id: string;
  name: string;
  tagline: string;
  url: string;
  headerColor: string;      // Tailwind bg- class
  result: 'allowed' | 'denied';
  resultReason: string;
  keyFeature: string;       // which DToU feature this app demonstrates
}

export const APPS: AppEntry[] = [
  {
    id: 'app-a',
    name: 'Daily Wellness Journal',
    tagline: 'Journaling app — reads health data locally, no third parties',
    url: 'http://localhost:5101',
    headerColor: 'bg-amber-600',
    result: 'allowed',
    resultReason:
      'App declares purpose vocab:health-suggestions (local use only, no downstream). ' +
      "Alice's data has a matching Purpose Tagging → no UnmatchedExpectation. " +
      'No downstream declared → downstream prohibition check is not triggered.',
    keyFeature: 'Local-only use — no third-party involvement, trivially permitted',
  },
  {
    id: 'app-b',
    name: 'Health Insights',
    tagline: 'Health analytics — uses a third-party health AI service',
    url: 'http://localhost:5102',
    headerColor: 'bg-teal-600',
    result: 'allowed',
    resultReason:
      'App declares purpose vocab:health-suggestions and a downstream (app:HealthAIService) ' +
      'with the same health-suggestions purpose. ' +
      "Alice's PurposeTag covers health-suggestions → downstream check passes. " +
      'Output policy is automatically derived from input policies via OutputSpec :from.',
    keyFeature: 'Third-party allowed — downstream health purpose matches Alice\'s tagging',
  },
  {
    id: 'app-c',
    name: 'HealthShare Pro™',
    tagline: 'Commercial data platform — shares with a commercial research firm',
    url: 'http://localhost:5103',
    headerColor: 'bg-orange-600',
    result: 'denied',
    resultReason:
      'App declares a downstream (app:CommercialResearchFirm) with purpose ' +
      'vocab:commercial-research. ' +
      "Alice's prohibition has no :app restriction — it fires for any app or downstream " +
      'declaring this purpose → ProhibitedUse.',
    keyFeature: 'Downstream prohibition — third-party commercial purpose caught automatically',
  },
];
