<template>
    <v-layout>
        <v-flex xs12 sm12 md8 offset-md2 class="mt-4">
            <v-card class="elevation-10">
                <v-card-title>
                    <v-container grid-list-xs>
                        <profile-loading v-if="loading"/>
                        <v-layout row wrap v-else>
                            <v-flex xs12 sm12 md5 lg4 text-xs-center align-center justify-center>
                                <v-avatar
                                    id="avatarContainer"
                                    class="my-4"
                                    size="200"
                                >
                                    <img id="avatarImage" :src="imageUrl"/>
                                </v-avatar>
                                <h3 class="headline">{{ info.givenName }} {{ info.surname }}</h3>
                            </v-flex>
                            <v-flex xs12 sm12 md7 lg8>
                                <profile-info-container :info="info"/>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-title>
                <v-card-actions>
                    <v-spacer v-if="!onboarded"/>
                    <v-btn flat color="accent darken-4"
                           :loading="loading"
                           @click="onboardingDialog = true"
                    >{{ onboardBtnText }}
                    </v-btn>
                    <v-spacer v-if="onboarded"/>
                    <v-btn flat color="accent darken-4"
                            v-if="onboarded"
                           :loading="loading"
                           @click="offerCredentialDialog = true"
                    >Offer Credentials
                    </v-btn>
                </v-card-actions>
            </v-card>
            <onboarding-dialog :dialog="onboardingDialog" :bsn="info.bsn" @close="closeOnboardingDialog"/>
            <offer-credentials-dialog :dialog="offerCredentialDialog" :bsn="info.bsn"
                                      @close="closeOfferCredentialDialog"/>
        </v-flex>
    </v-layout>
</template>

<script>
    import TextWithLabel from "./TextWithLabel";
    import ProfileInfoContainer from "./ProfileInfoContainer";
    import ProfileLoading from "./ProfileLoading";
    import OnboardingDialog from "./OnboardingDialog";
    import OfferCredentialsDialog from "./OfferCredentialsDialog";

    const DEFAULT_IMAGE_URL = `https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png`;

    export default {
        name: "ProfileCard",
        components: {
            OfferCredentialsDialog,
            OnboardingDialog,
            ProfileLoading,
            ProfileInfoContainer,
            TextWithLabel
        },
        props: {
            info: {
                type: Object,
                required: true
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            imageUrl() {
                return this.info && typeof this.info.imageUrl !== "undefined"
                    ? this.info.imageUrl
                    : DEFAULT_IMAGE_URL;
            },
            onboarded() {
                return this.info && this.info.citizenDid;
            },
            onboardBtnText() {
                return this.onboarded ? "re-connect" : "onboard"
            }
        },
        data() {
            return {
                onboardingDialog: false,
                offerCredentialDialog: false
            };
        },
        methods: {
            closeOnboardingDialog() {
                this.onboardingDialog = false;
                this.$emit("refresh");
            },
            closeOfferCredentialDialog() {
                this.offerCredentialDialog = false;
                this.$emit("refresh");
            }
        }
    };
</script>

<style scoped>
    #avatarImage {
        -webkit-filter: grayscale(90%); /* Safari 6.0 - 9.0 */
        filter: grayscale(90%);
        max-height: 100%;
        max-width: 100%;
        object-fit: cover;
        object-position: top;
    }
</style>
