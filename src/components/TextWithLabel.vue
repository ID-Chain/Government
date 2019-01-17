<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <p class="label">{{label}}</p>
    </v-flex>
    <v-flex xs12 sm6>
      <h3 class="subheading primary--text text--darken-4 value mt-0 pt-0">{{value}}</h3>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "TextWithLabel",
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      default: "Unknown"
    },
    fullSize: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.value {
  text-transform: capitalize;
}

.label {
  font-size: 12px;
  font-weight: bolder;
  color: grey;
  text-transform: uppercase;
}
</style>
