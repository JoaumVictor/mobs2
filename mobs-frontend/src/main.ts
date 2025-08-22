import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";
import "./assets/main.scss";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
app.use(FloatingVue);
