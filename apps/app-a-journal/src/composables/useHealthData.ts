import { ref } from 'vue';
import { Parser } from 'n3';
import type { Quad } from 'n3';
import { MOCK_MODE, SOLID_SERVER } from '@dtou-demo/dtou-client';

export interface HeartRateRecord { time: string; bpm: number; }
export interface StepsRecord { date: string; steps: number; }
export interface SleepRecord { date: string; hours: number; quality: number; }

export interface HealthData {
  heartRate: HeartRateRecord[];
  steps: StepsRecord[];
  sleep: SleepRecord[];
}

const MOCK_DATA: HealthData = {
  heartRate: [
    { time: '08:00', bpm: 72 }, { time: '12:00', bpm: 68 }, { time: '20:00', bpm: 75 },
    { time: '08:00', bpm: 70 }, { time: '12:00', bpm: 65 }, { time: '20:00', bpm: 78 },
  ],
  steps: [
    { date: '2024-03-01', steps: 8423 },
    { date: '2024-03-02', steps: 10251 },
  ],
  sleep: [
    { date: '2024-03-01', hours: 7.5, quality: 82 },
    { date: '2024-03-02', hours: 6.5, quality: 71 },
  ],
};

export function useHealthData(fetchFn?: () => typeof fetch | undefined) {
  const data = ref<HealthData | null>(null);
  const error = ref<string | null>(null);

  async function loadData() {
    try {
      data.value = MOCK_MODE ? MOCK_DATA : await fetchRealHealthData(fetchFn?.());
    } catch (e: any) {
      error.value = e.message ?? 'Unknown error';
    }
  }

  return { data, error, loadData };
}

// ---- RDF helpers ----

const EX = 'http://example.org/health#';
const LDP = 'http://www.w3.org/ns/ldp#';
const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

function parseTurtle(text: string, baseIRI: string): Quad[] {
  return new Parser({ baseIRI }).parse(text);
}

async function fetchTurtle(url: string, _fetch: typeof fetch): Promise<Quad[]> {
  const res = await _fetch(url, { headers: { Accept: 'text/turtle' } });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return parseTurtle(await res.text(), url);
}

/** Returns URLs of .ttl files listed in an LDP container. */
async function listContainer(url: string, _fetch: typeof fetch): Promise<string[]> {
  const quads = await fetchTurtle(url, _fetch);
  return quads
    .filter(q => q.predicate.value === `${LDP}contains`)
    .map(q => q.object.value)
    .filter(v => v.endsWith('.ttl'));
}

function subjectsOfType(quads: Quad[], type: string): string[] {
  return quads
    .filter(q => q.predicate.value === RDF_TYPE && q.object.value === type)
    .map(q => q.subject.value);
}

function getStr(quads: Quad[], subj: string, pred: string): string | null {
  return quads.find(q => q.subject.value === subj && q.predicate.value === pred)?.object.value ?? null;
}

function getInt(quads: Quad[], subj: string, pred: string): number | null {
  const v = getStr(quads, subj, pred);
  return v !== null ? parseInt(v, 10) : null;
}

function getFloat(quads: Quad[], subj: string, pred: string): number | null {
  const v = getStr(quads, subj, pred);
  return v !== null ? parseFloat(v) : null;
}

// ---- Real fetch ----

async function fetchRealHealthData(_fetch: typeof fetch = fetch): Promise<HealthData> {
  const base = `${SOLID_SERVER}/alice/health`;

  const [hrFiles, stepsFiles, sleepFiles] = await Promise.all([
    listContainer(`${base}/heartrate/`, _fetch),
    listContainer(`${base}/steps/`, _fetch),
    listContainer(`${base}/sleep/`, _fetch),
  ]);

  const heartRate: HeartRateRecord[] = [];
  const steps: StepsRecord[] = [];
  const sleep: SleepRecord[] = [];

  for (const url of hrFiles) {
    const quads = await fetchTurtle(url, _fetch);
    for (const subj of subjectsOfType(quads, `${EX}HeartRateMeasurement`)) {
      const bpm = getInt(quads, subj, `${EX}bpm`);
      const ts = getStr(quads, subj, `${EX}timestamp`);
      if (bpm !== null && ts) {
        // extract HH:MM from ISO datetime "2024-03-01T08:00:00Z"
        heartRate.push({ time: ts.substring(11, 16), bpm });
      }
    }
  }

  for (const url of stepsFiles) {
    const quads = await fetchTurtle(url, _fetch);
    for (const subj of subjectsOfType(quads, `${EX}DailySteps`)) {
      const count = getInt(quads, subj, `${EX}stepCount`);
      const date = getStr(quads, subj, `${EX}date`);
      if (count !== null && date) steps.push({ date, steps: count });
    }
  }

  for (const url of sleepFiles) {
    const quads = await fetchTurtle(url, _fetch);
    for (const subj of subjectsOfType(quads, `${EX}SleepRecord`)) {
      const hours = getFloat(quads, subj, `${EX}durationHours`);
      const quality = getInt(quads, subj, `${EX}qualityScore`);
      const date = getStr(quads, subj, `${EX}date`);
      if (hours !== null && quality !== null && date) sleep.push({ date, hours, quality });
    }
  }

  heartRate.sort((a, b) => a.time.localeCompare(b.time));
  steps.sort((a, b) => a.date.localeCompare(b.date));
  sleep.sort((a, b) => a.date.localeCompare(b.date));

  return { heartRate, steps, sleep };
}
