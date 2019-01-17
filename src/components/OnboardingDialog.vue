<template>
    <v-dialog persistent :value="dialog" max-width="500">
        <v-card>
            <v-card-title class="my-0 pb-0">
                <v-flex>
                    <p class="headline pa-2 ma-0">Onboarding Citizen to Indy</p>
                </v-flex>
                <v-spacer/>
                <v-flex class="text-xs-right">
                    <v-btn icon @click="closeDialog">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-title>
            <v-card-text>
                <v-progress-circular
                        indeterminate
                        color="primary"
                        v-if="isLoading"
                ></v-progress-circular>
                <canvas v-if="!isLoading" ref="qrCodeCanvas"></canvas>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn @click="newQrCode" outline color="primary">refresh</v-btn>
                <v-spacer/>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import QRCode from "qrcode";
    import {mapActions, mapGetters} from "vuex";
    import {SHOW_NOTIFICATION} from "../store/mutation-types";

    export default {
        name: "OnboardingDialog",
        props: {
            dialog: Boolean,
            bsn: {
                type: Number
            }
        },
        computed: {
            ...mapGetters({
                onboardingInfo: "onboardingInfo",
                did: "getGovernmentDid",
                isConnectionAcknowledged: "isConnectionAcknowledged",
                isLoading: "isLoading"
            })
        },
        data: () => ({
            qrcode: {},
            interval: 0
        }),
        watch: {
            dialog(newValue, oldValue) {
                if (oldValue === false && newValue === true) {
                    this.newQrCode();
                }
            },
            isConnectionAcknowledged(newValue, oldValue) {
                if (oldValue === false && newValue === true) {
                    this.$store.commit(SHOW_NOTIFICATION, {
                        type: "success",
                        msg: "Citizen connection created successfully"
                    });
                    this.closeDialog();
                }
            }
        },
        methods: {
            ...mapActions({
                getOnboarding: "getOnboarding",
                getConnectionStatus: "getConnectionStatus"
            }),
            newQrCode() {
                clearInterval(this.interval);
                const vm = this;
                this.getOnboarding({showSpinner: true, bsn: this.bsn}).then(() => {
                    QRCode.toCanvas(
                        vm.$refs.qrCodeCanvas,
                        JSON.stringify(vm.onboardingInfo.message),
                        {errorCorrectionLevel: "M", width: "450"},
                        err => {
                            if (err) {
                                console.log(err);
                                vm.$store.commit(SHOW_NOTIFICATION, {
                                    type: "error",
                                    msg: "Something went wrong, while generating QRCode"
                                });
                            }
                        }
                    );
                    this.startCheckingConnection();
                });
            },
            startCheckingConnection() {
                this.getConnectionStatus(this.did);
                this.interval = setInterval(() => this.getConnectionStatus(this.did), 2000)
            },
            closeDialog() {
                clearInterval(this.interval);
                this.$emit("close");
            }
        },
        beforeDestroy() {
            clearInterval(this.interval);
        }
    };
</script>

<style scoped>
</style>
