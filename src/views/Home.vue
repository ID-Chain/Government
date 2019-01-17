<template>
  <v-container fluid fill-height class="home">
    <v-layout justify-center row wrap class="mt-5">
      <v-flex xs12 sm8 md6 lg4 class="mt-5">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-autocomplete
            :items="bsnList"
            v-model="bsn"
            label="Burger Service Nummer"
            required
            autocomplete
          ></v-autocomplete>
          <v-btn
            small
            color="primary"
            class="ml-0"
            :disabled="!valid"
            @click="submit"
          >
            submit
          </v-btn>
          <v-btn small outline color="error" @click="clear">clear</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "home",
  data: () => ({
    valid: true,
    bsn: "",
    bsnRules: [
      v => !!v || "BSN is required",
      v => v.length === 10 || "BSN should be 10 digits long"
    ]
  }),
  computed: {
    ...mapGetters({
      bsnList: "getBsnList"
    })
  },
  methods: {
    ...mapActions({
      getBsnList: "getAllBsns"
    }),
    submit() {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        this.$router.push({ name: "citizenDetails", params: { bsn: this.bsn }})
      }
    },
    clear() {
      this.$refs.form.reset();
    }
  },
  created() {
    this.getBsnList({ showSpinner: true });
  }
};
</script>
