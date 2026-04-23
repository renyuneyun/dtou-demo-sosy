import { ref, onMounted } from 'vue';
import {
  checkPolicy,
  fetchDataPolicyForDisplay,
} from '@dtou-demo/dtou-client';
import type { DataPolicyDisplay, CompatibilityResult } from '@dtou-demo/dtou-client';
import { APP_C_POLICY } from '../policy';

export function useHealthData() {
  const loading = ref(true);
  const error = ref<string | null>(null);
  const dataPolicies = ref<DataPolicyDisplay[]>([]);
  const compatibility = ref<CompatibilityResult | null>(null);

  onMounted(async () => {
    try {
      // Policy check runs before any data is accessed — this is the key demo point.
      // If conflicts are detected, we stop here and never touch Alice's data.
      compatibility.value = await checkPolicy(APP_C_POLICY);

      // Fetch Alice's data policy for the UI display panel only (not part of reasoning).
      const display = await fetchDataPolicyForDisplay(
        'http://localhost:3000/alice/health/heartrate/2024-03-01.ttl',
      );
      dataPolicies.value = [display];

      // Data would only be accessed if the policy check passed — it never does for App C.
    } catch (e: any) {
      error.value = e.message ?? 'Unknown error';
    } finally {
      loading.value = false;
    }
  });

  return { loading, error, dataPolicies, compatibility };
}
