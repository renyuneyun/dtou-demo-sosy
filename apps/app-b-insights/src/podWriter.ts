import { SOLID_SERVER, MOCK_MODE } from '@dtou-demo/dtou-client';
import { reportToTurtle, type InsightsReport } from './insights';

export async function saveReportToPod(
  report: InsightsReport,
  derivedPolicyTurtle: string,
  fetchFn?: typeof fetch,
): Promise<{ reportUrl: string; policyUrl: string }> {
  const reportUrl = `${SOLID_SERVER}/alice/health/insights/report.ttl`;
  const policyUrl = `${reportUrl}.dtou`;

  if (MOCK_MODE) {
    console.log('[mock] saveReportToPod:', reportUrl);
    return { reportUrl, policyUrl };
  }

  const _fetch = fetchFn ?? fetch;
  const headers: Record<string, string> = { 'Content-Type': 'text/turtle' };
  await _fetch(reportUrl, { method: 'PUT', headers, body: reportToTurtle(report) });
  await _fetch(policyUrl, { method: 'PUT', headers, body: derivedPolicyTurtle });
  return { reportUrl, policyUrl };
}
