<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import GoogleMap from "../components/GoogleMap.vue";
import Sidebar from "../components/Sidebar.vue";
import { useSidebarStore } from "../stores/useSidebarStore";
import background from "../assets/background.avif";

const sidebarOpen = ref(true);
const selectedPlate = ref<string | null>(null);
const showHistory = ref(true);

const sidebarStore = useSidebarStore();

onMounted(() => {
  const intervalId = setInterval(async () => {
    await sidebarStore.verifyApis();

    if (sidebarStore.allReady) {
      clearInterval(intervalId);
      await sidebarStore.fetchVehicles();
    }
  }, 2000);
});

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${background})`,
}));
</script>

<template>
  <div class="dashboard" :style="backgroundStyle">
    <Sidebar
      v-model:open="sidebarOpen"
      v-model:selectedPlate="selectedPlate"
      v-model:showHistory="showHistory"
    />

    <div class="map-container">
      <div v-if="!sidebarStore.allReady" class="loading-overlay">
        <div class="loading-box">
          <p>{{ sidebarStore.loadingMessage }}</p>
          <div class="spinner"></div>
        </div>
      </div>

      <GoogleMap
        v-if="sidebarStore.allReady"
        :selectedPlate="selectedPlate"
        :showHistory="showHistory"
      />
    </div>
  </div>
</template>

<style>
@import url("../assets/scss/_variables.scss");

.dashboard {
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin-left: 300px;
}

.loading-box {
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  p {
    font-size: 1.8em;
    color: #ffffff;
  }
}
</style>
