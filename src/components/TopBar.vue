<template>
    <v-toolbar dense fixed color="primary">
        <router-link tag="img" src="/logo.png" height="100%"
                     :to="{name: 'home'}"/>
        <v-toolbar-title class="white--text bolder" :to="{name: 'home'}">Government - Municipality Officer
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
            <v-btn flat dark :to="{name: 'home'}" exact>
                <v-icon class="mr-2">search</v-icon>
                <span class="hidden-sm-and-down">search</span>
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "TopBar",
        data() {
            return {
                connected: true
            };
        },
        computed: {
            ...mapGetters({
                linkedDID: "getLinkedDidValue",
                linkedWallet: "getLinkedWalletName",
                linkedPool: "getLinkedPoolName"
            })
        }
    };
</script>

<style scoped>
    .bolder {
        font-weight: 600 !important;
        font-style: italic;
    }
</style>
