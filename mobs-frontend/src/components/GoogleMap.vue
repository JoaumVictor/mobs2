<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import { getVehicles } from "../services/vehicleService";
import axios from "axios";

const props = defineProps<{
  selectedPlate: string | null;
  showHistory: boolean;
}>();

const mapEl = ref<HTMLDivElement | null>(null);
const map = ref<google.maps.Map | null>(null);
const error = ref<string | null>(null);
const infoWindows: Record<string, google.maps.InfoWindow> = {};

const markers: Record<string, google.maps.Marker> = {};
const polylines: Record<string, google.maps.Polyline> = {};
const positionsHistory: Record<string, google.maps.LatLngLiteral[]> = {};

let intervalId: number | null = null;

onMounted(async () => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
    if (!apiKey) {
      error.value = "VITE_GOOGLE_MAPS_API_KEY não configurada no .env";
      return;
    }

    const loader = new Loader({ apiKey, version: "weekly" });
    await loader.load();

    if (!mapEl.value) return;

    map.value = new google.maps.Map(mapEl.value, {
      center: { lat: -23.55, lng: -46.63 },
      zoom: 12,
      disableDefaultUI: false,
    });

    const vehicles = await getVehicles();

    intervalId = window.setInterval(async () => {
      for (const v of vehicles) {
        if (!v.plate) continue;
        try {
          const { data: telemetry } = await axios.get(
            `http://localhost:3000/telemetry/${encodeURIComponent(v.plate)}`
          );

          const pos = { lat: telemetry.lat, lng: telemetry.lng };

          if (!markers[v.plate]) {
            markers[v.plate] = new google.maps.Marker({
              position: pos,
              map: map.value!,
              title: v.plate,
            });

            positionsHistory[v.plate] = [];
            polylines[v.plate] = new google.maps.Polyline({
              path: [],
              geodesic: true,
              strokeColor: "#4285F4",
              strokeOpacity: 1.0,
              strokeWeight: 2,
              map: props.showHistory ? map.value! : null,
            });

            infoWindows[v.plate] = new google.maps.InfoWindow();
            markers[v.plate].addListener("click", () => {
              infoWindows[v.plate].open(map.value, markers[v.plate]);
            });
          }

          markers[v.plate].setPosition(pos);

          infoWindows[v.plate].setContent(`
            <div style="min-width:180px">
              <strong>${v.plate}</strong><br/>
              ${v.manufacturer} ${v.model} (${v.year})<br/>
              Vel.: ${telemetry.speed} km/h<br/>
              Comb.: ${telemetry.fuel}%<br/>
              <small>Atualizado: ${new Date().toLocaleTimeString()}</small>
            </div>
          `);

          positionsHistory[v.plate].push(pos);
          polylines[v.plate].setPath(positionsHistory[v.plate]);
        } catch (e) {
          // preciso tratar os erros...
        }
      }
    }, 5000);
  } catch (e: any) {
    error.value = e?.message ?? "Falha ao carregar o Google Maps.";
  }
});

onBeforeUnmount(() => {
  if (intervalId) window.clearInterval(intervalId);
});

watch(
  () => props.selectedPlate,
  (plate) => {
    if (!plate || !map.value) return;
    const marker = markers[plate];
    if (marker) {
      map.value.panTo(marker.getPosition()!);
      map.value.setZoom(15);
      infoWindows[plate]?.open(map.value, marker);
    }
  }
);

watch(
  () => props.showHistory,
  (show) => {
    Object.values(polylines).forEach((poly) => {
      poly.setMap(show ? map.value : null);
    });
  },
  { immediate: true }
);
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapEl" class="map"></div>
    <div v-if="error" class="map-error">{{ error }}</div>
  </div>
</template>

<style scoped>
.map-wrapper {
  height: 100vh;
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
