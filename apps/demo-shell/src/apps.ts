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
    tagline: 'Journaling app — reads health data as personal context',
    url: 'http://localhost:5101',
    headerColor: 'bg-amber-600',
    result: 'allowed',
    resultReason:
      'App declares purpose vocab:provide-health-suggestions. ' +
      "Alice's data has a matching Purpose Tagging → no UnmatchedExpectation. " +
      "Alice's prohibition only covers vocab:commercial-research → no ProhibitedUse.",
    keyFeature: 'Basic compatibility check — different app type (journal, not health tool)',
  },
  {
    id: 'app-b',
    name: 'Health Insights',
    tagline: 'Health analytics — writes insights report back to Pod',
    url: 'http://localhost:5102',
    headerColor: 'bg-green-600',
    result: 'allowed',
    resultReason:
      'Same purpose (provide-health-suggestions), no prohibition match. ' +
      'Output policy is automatically derived from input policies via OutputSpec :from.',
    keyFeature: 'Policy derivation — output report inherits Alice\'s constraints automatically',
  },
  {
    id: 'app-c',
    name: 'HealthShare Pro™',
    tagline: 'Commercial data platform — aggregates and shares with partners',
    url: 'http://localhost:5103',
    headerColor: 'bg-rose-700',
    result: 'denied',
    resultReason:
      'App declares purpose vocab:commercial-research. ' +
      "Alice's prohibition blocks any app using that purpose (:app omitted) → ProhibitedUse. " +
      "Alice also has no commercial-research Tagging → UnmatchedExpectation.",
    keyFeature: 'Prohibition — honest app policy triggers automatic block before data access',
  },
];
