import { ref, onMounted } from 'vue';
import {
  checkPolicy,
  fetchDataPolicyForDisplay,
} from '@dtou-demo/dtou-client';
import type { DataPolicyDisplay, CompatibilityResult } from '@dtou-demo/dtou-client';
import { APP_C_POLICY } from '../policy';

export function useHealthData() {
  const loading = ref(true);
  const dataPolicies = ref<DataPolicyDisplay[]>([]);
  const compatibility = ref<CompatibilityResult | null>(null);

  onMounted(async () => {
    try {
      // Policy check runs before any data is accessed — this is the key demo point.
      compatibility.value = await checkPolicy(APP_C_POLICY);

      // Fetch Alice's data policy for the UI display panel only.
      const display = await fetchDataPolicyForDisplay(
        'http://localhost:3000/alice/health/heartrate/2024-03-01.ttl',
      );
      dataPolicies.value = [display];
    } finally {
      loading.value = false;
    }
  });

  return { loading, dataPolicies, compatibility };
}
