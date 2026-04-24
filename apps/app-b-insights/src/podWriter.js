import { SOLID_SERVER, MOCK_MODE } from '@dtou-demo/dtou-client';
import { reportToTurtle } from './insights';
export async function saveReportToPod(report, derivedPolicyTurtle, accessToken) {
    const reportUrl = `${SOLID_SERVER}/alice/health/insights/report.ttl`;
    const policyUrl = `${reportUrl}.dtou`;
    if (MOCK_MODE) {
        console.log('[mock] saveReportToPod:', reportUrl);
        return { reportUrl, policyUrl };
    }
    const headers = {
        'Content-Type': 'text/turtle',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
    await fetch(reportUrl, { method: 'PUT', headers, body: reportToTurtle(report) });
    await fetch(policyUrl, { method: 'PUT', headers, body: derivedPolicyTurtle });
    return { reportUrl, policyUrl };
}
