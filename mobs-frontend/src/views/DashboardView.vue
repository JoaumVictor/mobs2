<script setup lang="ts">
import { ref } from "vue";
import GoogleMap from "../components/GoogleMap.vue";
import Sidebar from "../components/Sidebar.vue";

const sidebarOpen = ref(true);
const selectedPlate = ref<string | null>(null);
const showHistory = ref(true);
</script>

<template>
  <div class="dashboard">
    <Sidebar
      v-model:open="sidebarOpen"
      v-model:selectedPlate="selectedPlate"
      v-model:showHistory="showHistory"
    />

    <div class="map-container">
      <GoogleMap :selectedPlate="selectedPlate" :showHistory="showHistory" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  height: 100vh;
}
.map-container {
  flex: 1;
}
</style>
