<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getVehicles } from "../services/vehicleService";

interface Vehicle {
  id: number;
  plate: string;
  model: string;
  manufacturer: string;
  year: number;
}

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

const filteredVehicles = computed(() =>
  vehicles.value.filter((v) =>
    v.plate?.toLowerCase().includes(search.value?.toLowerCase())
  )
);

onMounted(async () => {
  try {
    error.value = null;
    vehicles.value = await getVehicles();
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Falha ao carregar veículos";
  }
});
</script>

<template>
  <Transition name="slide">
    <aside v-if="open" class="sidebar">
      <header>
        <h2>Veículos</h2>
        <button @click="emit('update:open', false)">✖</button>
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
          @click="emit('update:selectedPlate', v.plate)"
        >
          {{ v.plate }} — {{ v.model }}
        </li>
      </ul>
    </aside>
  </Transition>

  <button v-if="!open" class="open-btn" @click="emit('update:open', true)">
    ☰
  </button>
</template>

<style scoped lang="scss">
.sidebar {
  width: 250px;
  background: #fff;
  border-right: 1px solid #ddd;
  height: 100vh;
  padding: 1rem;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.search {
  width: 100%;
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
</style>
