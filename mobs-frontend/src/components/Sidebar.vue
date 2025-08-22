<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getVehicles } from "../services/vehicleService";
import type { Vehicle } from "../types/vehicle";
import { checkApisHealth } from "../services/healthService";
import type { HealthStatus } from "../services/healthService";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/auth";

const props = defineProps<{
  open: boolean;
  selectedPlate: string | null;
  showHistory: boolean;
}>();
const emit = defineEmits([
  "update:open",
  "update:selectedPlate",
  "update:showHistory",
]);

const search = ref("");
const vehicles = ref<Vehicle[]>([]);
const error = ref<string | null>(null);

const apiStatus = ref<HealthStatus>({ telemetry: false, backend: false });
const loadingApis = ref(true);
const toast = useToast();
const authStore = useAuthStore();

const filteredVehicles = computed(() =>
  vehicles.value.filter((v) =>
    v.placa?.toLowerCase().includes(search.value?.toLowerCase())
  )
);

const handleLogout = () => {
  authStore.logout();
  window.location.href = "/login";
};

const verifyApis = async () => {
  loadingApis.value = true;
  const status = await checkApisHealth();
  apiStatus.value = status;
  loadingApis.value = false;

  if (status.telemetry && status.backend) {
    toast.success("Vamos lá!");
  }
};

const googleMapsKey = ref(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "");
const isGoogleMapsKeyValid = computed(() => googleMapsKey.value.trim() !== "");

onMounted(() => {
  const intervalId = setInterval(async () => {
    await verifyApis();
    if (apiStatus.value.telemetry && apiStatus.value.backend) {
      clearInterval(intervalId);

      try {
        error.value = null;
        const result = await getVehicles();
        vehicles.value = result;
      } catch (e: any) {
        error.value =
          e?.response?.data?.message || "Falha ao carregar veículos";
      }
    }
  }, 2000);
});
</script>

<template>
  <Transition name="slide">
    <aside v-if="open" class="sidebar">
      <div class="sidebar-content">
        <header>
          <h2>Veículos</h2>
          <!-- <button @click="emit('update:open', false)">✖</button> -->
        </header>

        <input v-model="search" placeholder="Buscar por placa" class="search" />

        <label class="toggle">
          <input
            type="checkbox"
            :checked="showHistory"
            @change="
              emit(
                'update:showHistory',
                ($event.target as HTMLInputElement).checked
              )
            "
          />
          Mostrar histórico
        </label>

        <div v-if="error" class="error">{{ error }}</div>

        <ul class="vehicle-list">
          <li
            v-for="v in filteredVehicles"
            :key="v.id"
            @click="emit('update:selectedPlate', v.placa)"
          >
            {{ v.placa }} — {{ v.modelo }}
          </li>
        </ul>

        <div class="api-status">
          <p>Status das APIs:</p>
          <div class="status-item">
            <span
              class="status-dot"
              :class="apiStatus.telemetry ? 'green' : 'red'"
            ></span>
            Telemetria
          </div>
          <div class="status-item">
            <span
              class="status-dot"
              :class="apiStatus.backend ? 'green' : 'red'"
            ></span>
            Banco de dados
          </div>
          <p>Chaves de API necessárias:</p>
          <div class="status-item" style="margin-top: 0.5rem">
            <span
              class="status-dot"
              :class="isGoogleMapsKeyValid ? 'green' : 'red'"
            ></span>
            Google Maps
          </div>
        </div>

        <button class="logout-btn" @click="handleLogout">Deslogar</button>
      </div>
    </aside>
  </Transition>

  <button v-if="!open" class="open-btn" @click="emit('update:open', true)">
    ☰
  </button>
</template>

<style scoped lang="scss">
@import "../assets/scss/variables";

.sidebar {
  width: 300px;
  background: #fff;
  border-right: 6px solid $color-purple-light;
  height: 100%;
  padding: 1rem;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 90%;
  margin-top: 5%;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .search {
    width: auto;
    padding: 6px;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .toggle {
    margin-bottom: 1rem;
    font-size: 14px;
  }

  .error {
    background: #ffeded;
    color: #a40000;
    padding: 8px;
    border-radius: 6px;
    margin-bottom: 8px;
  }

  .vehicle-list {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .vehicle-list li {
    padding: 8px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }

  .vehicle-list li:hover {
    background: #f5f5f5;
  }

  .open-btn {
    position: fixed;
    top: 12px;
    left: 12px;
    background: #4285f4;
    color: white;
    border: none;
    padding: 10px 14px;
    border-radius: 6px;
    cursor: pointer;
    z-index: 10;
  }

  /* transição lateral */
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s ease;
  }
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(-100%);
  }

  .api-status {
    margin-bottom: 0.5rem;
    font-size: 14px;

    .status-item {
      display: flex;
      align-items: center;
      margin-top: 2px;

      .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 6px;

        &.green {
          background: #4caf50;
        }
        &.red {
          background: #f44336;
        }
      }
    }
  }

  .logout-btn {
    margin-top: 20px;
    background-color: #f44336;
    color: white;
    border: none;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.2s;

    &:hover {
      background-color: #d32f2f;
    }
  }
}
</style>
