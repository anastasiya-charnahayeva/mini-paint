import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import firebaseConfig from "../firebase.config.js";
import router from "./router/index";

const pinia = createPinia();
createApp(App).use(router).use(pinia).mount("#app");
