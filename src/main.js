import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import Filters from "./filters";
import "./registerServiceWorker";
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.scss";
import "placeholder-loading/src/scss/placeholder-loading.scss";

Vue.use(Vuetify, {
  theme: {
    primary: "#03699b",
    secondary: "#b0bec5",
    accent: "#8c9eff",
    error: "#b71c1c"
  }
});

Vue.use(Filters);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
