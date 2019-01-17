<template>
  <div id="app">
    <v-app>
      <top-bar/>
      <router-view class="mt-5"/>
      <notification/>
    </v-app>
  </div>
</template>

<script>
import TopBar from "./components/TopBar";
import Notification from "./components/Notification";

export default {
  poolName: "home",
  components: {
    TopBar,
    Notification
  }
};
</script>
