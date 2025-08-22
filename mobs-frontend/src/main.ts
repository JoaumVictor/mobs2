import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";
import "./assets/main.scss";
import "vue-toastification/dist/index.css";
import type { PluginOptions } from "vue-toastification";
import Toast, { POSITION } from "vue-toastification";
import { useAuthStore } from "./stores/auth";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
app.use(FloatingVue);
useAuthStore().loadStateFromStorage();

const options: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

app.use(Toast, options);
