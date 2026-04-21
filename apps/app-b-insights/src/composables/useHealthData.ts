import { ref, onMounted } from 'vue';
import {
  checkPolicy,
  fetchDataPolicyForDisplay,
  MOCK_MODE,
} from '@dtou-demo/dtou-client';
import type { DataPolicyDisplay, CompatibilityResult } from '@dtou-demo/dtou-client';
import { APP_B_POLICY } from '../policy';

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

export function useHealthData() {
  const loading = ref(true);
  const error = ref<string | null>(null);
  const dataPolicies = ref<DataPolicyDisplay[]>([]);
  const compatibility = ref<CompatibilityResult | null>(null);
  const data = ref<HealthData | null>(null);

  onMounted(async () => {
    try {
      compatibility.value = await checkPolicy(APP_B_POLICY);

      const display = await fetchDataPolicyForDisplay(
        'http://localhost:3000/alice/health/heartrate/2024-03-01.ttl',
      );
      dataPolicies.value = [display];

      if (compatibility.value.compatible) {
        data.value = MOCK_MODE ? MOCK_DATA : await fetchRealHealthData();
      }
    } catch (e: any) {
      error.value = e.message ?? 'Unknown error';
    } finally {
      loading.value = false;
    }
  });

  return { loading, error, dataPolicies, compatibility, data };
}

async function fetchRealHealthData(): Promise<HealthData> {
  // TODO: fetch and parse the actual .ttl resources from the Pod using n3
  return MOCK_DATA;
}
