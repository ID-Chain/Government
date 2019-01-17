<template>
  <v-container fluid fill-height class="home">
    <v-layout justify-center row wrap class="mt-5">
      <profile-card :info="citizenInfo" :loading="isLoading" @refresh="getCitizenInfo"></profile-card>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { SHOW_NOTIFICATION } from "../store/mutation-types";
import ProfileCard from "../components/ProfileCard";
export default {
  name: "citizenDetails",
  components: { ProfileCard },
  props: ["bsn"],
  data: () => ({
    interval: 0
  }),
  computed: {
    ...mapGetters({ citizenInfo: "getCitizen", isLoading: "isLoading" })
  },
  methods: {
    ...mapActions({
      getCitizenDetails: "getCitizenDetails"
    }),
    getCitizenInfo(spinner) {
      this.getCitizenDetails({ showSpinner: spinner, bsn: this.bsn }).catch(
        () => {
          this.$router.push({ name: "home" });
        }
      );
    }
  },
  created() {
    if (!this.bsn) {
      this.$store.commit(SHOW_NOTIFICATION, {
        type: "error",
        msg: `Error while reading BSN!`
      });
      this.$router.push({ name: "home" });
    }
    this.getCitizenInfo(true);
    this.interval = setInterval(() => this.getCitizenInfo(false), 10000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>
