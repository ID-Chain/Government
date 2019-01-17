<template>
    <v-container row wrap>
      <p class="title mb-0 ">General Information</p>
      <v-divider class="mb-3"/>
      <text-with-label label="BSN" :value="bsn" />
      <text-with-label full-size label="Registered Address" :value="address" />
      <p class="title mb-0 ">Passport Information</p>
      <v-divider class="mb-3"/>
      <text-with-label label="Given Name" :value="givenName" />
      <text-with-label label="Surname" :value="surname" />
      <text-with-label label="Passport Number" :value="passportNumber" />
      <text-with-label label="Gender" :value="gender" />
      <text-with-label label="Nationality" :value="nationality" />
      <text-with-label full-size label="Date of Birth" :value="dateOfBirth" />
      <text-with-label full-size label="Place of Birth" :value="placeOfBirth" />
      <text-with-label full-size label="Authority" :value="passportAuthority" />
      <text-with-label full-size label="Date of Issue" :value="passportDateOfIssue"  />
      <text-with-label full-size label="Date of Expiry" :value="passportDateOfExpiry" />
      <p class="title mb-0 ">Indy Information</p>
      <v-divider class="mb-3"/>
      <text-with-label full-size label="Government DID" :value="governmentDid" />
      <text-with-label full-size label="Citizen DID" :value="citizenDid" />
      <text-with-label full-size label="Onboarded on" :value="dateOfDidOnboarding" />
    </v-container>
</template>

<script>
import TextWithLabel from "./TextWithLabel";
export default {
  name: "ProfileInfoContainer",
  components: { TextWithLabel },
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  computed: {
    bsn: vm => textOrUnknown(vm.info.bsn),
    address: vm => textOrUnknown(vm.info.address),
    givenName: vm => textOrUnknown(vm.info.givenName),
    surname: vm => textOrUnknown(vm.info.surname),
    passportNumber: vm => textOrUnknown(vm.info.passportNumber),
    gender: vm => textOrUnknown(vm.info.gender),
    nationality: vm => textOrUnknown(vm.info.nationality),
    dateOfBirth: vm => dateOrUnknown(vm.info.dateOfBirth),
    placeOfBirth: vm => textOrUnknown(vm.info.placeOfBirth),
    passportAuthority: vm => textOrUnknown(vm.info.passportAuthority),
    passportDateOfIssue: vm => dateOrUnknown(vm.info.passportDateOfIssue),
    passportDateOfExpiry: vm => dateOrUnknown(vm.info.passportDateOfExpiry),
    governmentDid: vm => textOrUnknown(vm.info.governmentDid),
    citizenDid: vm => textOrUnknown(vm.info.citizenDid),
    dateOfDidOnboarding: vm => dateOrUnknown(vm.info.dateOfDidOnboarding)
  }
};

function textOrUnknown(value) {
  return value ? value : "Unknown";
}
function dateOrUnknown(date) {
  if (!date) return "-";
  return new Date(date * 1000).toDateString();
}
</script>

<style scoped>
</style>
