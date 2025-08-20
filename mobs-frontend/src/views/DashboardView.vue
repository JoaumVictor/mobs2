<template>
  <div class="dashboard">
    <div id="map"></div>
    <div class="controls">
      <input v-model="searchPlate" placeholder="Buscar por placa" />
      <button @click="toggleHistory">
        {{ showHistory ? "Ocultar Histórico" : "Mostrar Histórico" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import axios from "axios";

interface Vehicle {
  id: number;
  plate: string;
  speed: number;
  fuel: number;
  last_update: string;
  positions: { lat: number; lng: number }[];
}

const searchPlate = ref("");
const showHistory = ref(false);
const vehicles = ref<Vehicle[]>([]);
let map: google.maps.Map;

const fetchVehicles = async () => {
  const res = await axios.get("http://localhost:8000/api/vehicles");
  vehicles.value = res.data;
  renderMarkers();
};

const toggleHistory = () => {
  showHistory.value = !showHistory.value;
  renderMarkers();
};

const renderMarkers = () => {
  if (!map) return;
  vehicles.value
    .filter((v) => v.plate.includes(searchPlate.value.toUpperCase()))
    .forEach((vehicle) => {
      const marker = new google.maps.Marker({
        position: vehicle.positions[0],
        map,
        title: vehicle.plate,
      });

      const info = new google.maps.InfoWindow({
        content: `
          <div>
            <strong>${vehicle.plate}</strong><br/>
            Velocidade: ${vehicle.speed} km/h<br/>
            Combustível: ${vehicle.fuel}%<br/>
            Última atualização: ${vehicle.last_update}
          </div>
        `,
      });

      marker.addListener("click", () => {
        info.open(map, marker);
        if (showHistory.value) {
          new google.maps.Polyline({
            path: vehicle.positions,
            geodesic: true,
            strokeColor: "#1E90FF",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map,
          });
        }
      });
    });
};

onMounted(async () => {
  const loader = new Loader({
    apiKey: "SUA_GOOGLE_MAPS_API_KEY",
    version: "weekly",
  });
  await loader.load();
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: -23.55, lng: -46.63 },
    zoom: 12,
  });
  fetchVehicles();
});

watch(searchPlate, renderMarkers);
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
#map {
  flex: 1;
}
.controls {
  padding: 1rem;
  display: flex;
  gap: 1rem;
}
</style>
