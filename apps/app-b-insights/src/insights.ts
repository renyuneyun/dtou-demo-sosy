import { Parser } from 'n3';

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

/** Parse a saved report.ttl back into an InsightsReport. Returns null if the document has no report. */
export async function reportFromTurtle(turtle: string, baseIRI: string): Promise<InsightsReport | null> {
  const HEALTH = 'urn:dtou-demo:health#';
  const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

  const quads = new Parser({ baseIRI }).parse(turtle);
  const subj = quads.find(q => q.predicate.value === RDF_TYPE && q.object.value === `${HEALTH}InsightsReport`)?.subject.value;
  if (!subj) return null;

  const get = (pred: string) => quads.find(q => q.subject.value === subj && q.predicate.value === pred)?.object.value ?? null;

  const avgHeartRate = get(`${HEALTH}avgHeartRate`);
  const avgSteps = get(`${HEALTH}avgSteps`);
  const totalSteps = get(`${HEALTH}totalSteps`);
  const avgSleepHours = get(`${HEALTH}avgSleepHours`);
  const avgSleepQuality = get(`${HEALTH}avgSleepQuality`);
  const narrative = get(`${HEALTH}narrative`);
  const generatedAt = get(`${HEALTH}generatedAt`);

  if (!avgHeartRate || !avgSteps || !totalSteps || !avgSleepHours || !avgSleepQuality || !narrative || !generatedAt) return null;

  return {
    avgHeartRate: parseInt(avgHeartRate, 10),
    avgSteps: parseInt(avgSteps, 10),
    totalSteps: parseInt(totalSteps, 10),
    avgSleepHours: parseFloat(avgSleepHours),
    avgSleepQuality: parseInt(avgSleepQuality, 10),
    narrative,
    generatedAt,
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
