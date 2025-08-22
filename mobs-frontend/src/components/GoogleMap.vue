<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const mapEl = ref<HTMLDivElement | null>(null);
const map = ref<google.maps.Map | null>(null);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
    if (!apiKey) {
      error.value = "VITE_GOOGLE_MAPS_API_KEY não configurada no .env";
      return;
    }

    // Carrega a lib do Maps
    const loader = new Loader({
      apiKey,
      version: "weekly",
    });

    await loader.load();

    if (!mapEl.value) return;

    // Cria o mapa
    map.value = new google.maps.Map(mapEl.value, {
      center: { lat: -23.55, lng: -46.63 }, // SP como default
      zoom: 12,
      // mapId: "SE_TIVER_UM_MAP_ID_OPCIONAL",
      disableDefaultUI: false,
    });
  } catch (e: any) {
    error.value = e?.message ?? "Falha ao carregar o Google Maps.";
  }
});
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapEl" class="map"></div>
    <div v-if="error" class="map-error">{{ error }}</div>
  </div>
</template>

<style scoped>
.map-wrapper {
  height: 100vh; /* ocupa a tela toda para testar */
  width: 100%;
}
.map {
  height: 100%;
  width: 100%;
}
.map-error {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ffeded;
  color: #a40000;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
}
</style>
