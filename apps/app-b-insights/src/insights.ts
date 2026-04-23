export interface InsightsReport {
  avgHeartRate: number;
  avgSteps: number;
  totalSteps: number;
  avgSleepHours: number;
  avgSleepQuality: number;
  narrative: string;
  generatedAt: string;
}

export function generateInsights(
  heartRate: { bpm: number }[],
  steps: { steps: number }[],
  sleep: { hours: number; quality: number }[],
): InsightsReport {
  const avgHR = Math.round(heartRate.reduce((s, r) => s + r.bpm, 0) / heartRate.length);
  const totalSteps = steps.reduce((s, r) => s + r.steps, 0);
  const avgSteps = Math.round(totalSteps / steps.length);
  const avgSleep = parseFloat((sleep.reduce((s, r) => s + r.hours, 0) / sleep.length).toFixed(1));
  const avgQuality = Math.round(sleep.reduce((s, r) => s + r.quality, 0) / sleep.length);

  const parts: string[] = [];
  parts.push(avgHR < 75 ? 'Heart rate is in a healthy range.' : 'Heart rate is slightly elevated.');
  parts.push(avgSteps >= 10000 ? "You're hitting the 10,000-steps goal!" : 'Consider increasing daily steps.');
  parts.push(avgSleep >= 7 ? 'Sleep duration is healthy.' : 'Aim for 7–8 hours of sleep.');
  parts.push(avgQuality >= 75 ? 'Sleep quality looks good.' : 'Sleep quality could be improved.');

  return {
    avgHeartRate: avgHR,
    avgSteps,
    totalSteps,
    avgSleepHours: avgSleep,
    avgSleepQuality: avgQuality,
    narrative: parts.join(' '),
    generatedAt: new Date().toISOString(),
  };
}

/** Serialize the report as Turtle for saving to the Pod */
export function reportToTurtle(report: InsightsReport): string {
  return `@prefix health: <urn:dtou-demo:health#> .
@prefix xsd:    <http://www.w3.org/2001/XMLSchema#> .

<#report>
  a health:InsightsReport ;
  health:avgHeartRate ${report.avgHeartRate} ;
  health:avgSteps ${report.avgSteps} ;
  health:totalSteps ${report.totalSteps} ;
  health:avgSleepHours "${report.avgSleepHours}"^^xsd:decimal ;
  health:avgSleepQuality ${report.avgSleepQuality} ;
  health:narrative """${report.narrative}""" ;
  health:generatedAt "${report.generatedAt}"^^xsd:dateTime .
`;
}
