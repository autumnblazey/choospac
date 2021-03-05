import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { store, key as storekey } from "./store";

createApp(App).use(store, storekey).use(router).mount("#app");
