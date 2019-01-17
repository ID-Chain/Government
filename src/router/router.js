import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import CitizenDetails from "../views/CitizenDetails.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/citizens/:bsn",
      name: "citizenDetails",
      component: CitizenDetails,
      props: true
    },
    {
      path: "*",
      redirect: "/",
      name: "default",
      component: Home
    }
  ]
});
