<template>
    <v-dialog persistent :value="dialog" max-width="750">
        <v-card>
            <v-card-title class="my-0 pb-0">
                <v-flex>
                    <p class="headline pa-2 ma-0">Credential Offers Info</p>
                </v-flex>
                <v-spacer/>
                <v-flex class="text-xs-right">
                    <v-btn icon @click="closeDialog">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-title>
            <v-card-text>
                <v-flex class="mx-3">
                    <v-autocomplete
                        :items="credentialOffersInfo"
                        v-model="selectedSchema"
                        return-object
                        label="Credential Schema"
                    >
                        <template slot="selection" slot-scope="data">
                            {{ data.item.name }}, v:{{ data.item.version }}
                        </template>
                        <template slot="item" slot-scope="data">
                            {{ data.item.name }}, v:{{ data.item.version }}
                        </template>
                    </v-autocomplete>
                </v-flex>
                <v-container row wrap v-if="selectedSchema.name">
                    <p class="title mb-0 ">General Information</p>
                    <v-divider class="mb-3"/>
                    <text-with-label label="Schema ID"
                                     :value="selectedSchema.schemaId"></text-with-label>
                    <text-with-label label="Credential Definition ID"
                                     :value="selectedSchema.credentialDefinitionId"></text-with-label>
                    <text-with-label label="Revocation" :value="selectedSchema.isRevocable"></text-with-label>
                    <p class="title mb-0 ">Credential Fields</p>
                    <v-divider class="mb-3"/>
                    <text-with-label v-for="field in selectedSchema.attributes" :label="field.name"
                                     :value="field.type"></text-with-label>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn @click="send" :loading="loading" outline color="primary">send</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import {SHOW_NOTIFICATION} from "../store/mutation-types";
    import TextWithLabel from "./TextWithLabel";

    export default {
        name: "OfferCredentialsDialog",
        components: {TextWithLabel},
        props: {
            dialog: Boolean,
            bsn: {
                type: Number
            }
        },
        computed: {
            ...mapGetters({
                loading: "isLoading",
                getGovernmentDid: "getGovernmentDid",
                credentialOffersInfo: "credentialOffersInfo"
            })
        },
        data: () => ({
            selectedSchema: {},
            valid: false
        }),
        methods: {
            ...mapActions({
                getOffers: "getCredentialOffers",
                sendCredentials: "sendCredentials"
            }),
            send() {
                if (this.selectedSchema && this.selectedSchema.credentialDefinitionId) {
                    this.sendCredentials({
                        myDid: this.getGovernmentDid,
                        credDefId: this.selectedSchema.credentialDefinitionId,
                        schemaName: this.selectedSchema.name,
                        schemaVersion: this.selectedSchema.version
                    }).then(() => {
                        this.$store.commit(SHOW_NOTIFICATION, {
                            type: "success",
                            msg: "Credentials offer sent to citizen"
                        });
                        this.$emit("close");
                    })
                } else {
                    this.$store.commit(SHOW_NOTIFICATION, {
                        type: "error",
                        msg: "Please select schema"
                    });
                }
            },
            closeDialog() {
                this.$emit("close");
            }
        },
        created() {
            this.getOffers({showSpinner: false});
        }
    };
</script>

<style scoped>
</style>
