import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getVehicles } from "../services/vehicleService";
import { checkApisHealth } from "../services/healthService";
import type { HealthStatus } from "../services/healthService";
import { useToast } from "vue-toastification";

export const useSidebarStore = defineStore("sidebar", () => {
  const vehicles = ref<any[]>([]);
  const error = ref<string | null>(null);
  const loadingVehicles = ref(false);

  const apiStatus = ref<HealthStatus>({ telemetry: false, backend: false });
  const loadingApis = ref(true);

  const googleMapsKey = ref(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "");
  const isGoogleMapsKeyValid = computed(
    () => googleMapsKey.value.trim() !== ""
  );

  const toast = useToast();

  // ações
  const fetchVehicles = async () => {
    try {
      loadingVehicles.value = true;
      error.value = null;
      const result = await getVehicles();
      vehicles.value = result;
    } catch (e: any) {
      error.value = e?.response?.data?.message || "Falha ao carregar veículos";
    } finally {
      loadingVehicles.value = false;
    }
  };

  const verifyApis = async () => {
    loadingApis.value = true;
    try {
      const status = await checkApisHealth();
      apiStatus.value = status;
    } finally {
      loadingApis.value = false;
    }
  };

  const allReady = computed(() => {
    return (
      apiStatus.value.telemetry &&
      apiStatus.value.backend &&
      isGoogleMapsKeyValid.value
    );
  });

  const loadingMessage = computed(() => {
    if (!apiStatus.value.telemetry)
      return "Aguardando a telemetria responder...";

    if (!apiStatus.value.backend)
      return "Aguardando o banco de dados responder...";

    if (!isGoogleMapsKeyValid.value) return "Verificando sua chave de API...";

    return "Quase lá...";
  });

  return {
    vehicles,
    error,
    loadingVehicles,
    apiStatus,
    loadingApis,
    googleMapsKey,
    isGoogleMapsKeyValid,
    fetchVehicles,
    verifyApis,
    allReady,
    loadingMessage,
  };
});
