import api from "../api";
import * as types from "../mutation-types";
import storeUtils from "../utils";

const state = {
    bsnList: [],
    citizen: {},
    onboardingInfo: {},
    connectionInfo: {},
    credentialOffersInfo: {},
    credentialOfferResponse: {}
};

const getters = {
    getBsnList: state => state.bsnList,
    getCitizen: state => state.citizen,
    getGovernmentDid: state => (state.onboardingInfo.meta || {}).myDid || state.citizen.governmentDid || '',
    getCitizenDid: state => state.citizen.citizenDid || '',
    onboardingInfo: state => state.onboardingInfo,
    connectionInfo: state => state.connectionInfo,
    isConnectionAcknowledged: state => state.connectionInfo.acknowledged || false,
    credentialOffersInfo: state => state.credentialOffersInfo
};

const mutations = {
    [types.SET_BSN_LIST](state, data) {
        state.bsnList = data;
    },
    [types.SET_CITIZEN](state, citizen) {
        state.citizen = citizen;
    },
    [types.SET_ONBOARDING_INFO](state, info) {
        state.onboardingInfo = info;
    },
    [types.SET_CONNECTION_INFO](state, info) {
        state.connectionInfo = info;
    },
    [types.SET_CREDENTIAL_OFFERS_INFO](state, info) {
        state.credentialOffersInfo = info;
    },
    [types.SET_CREDENTIAL_OFFER_RESPONSE](state, info) {
        state.credentialOfferResponse = info;
    }
};
const actions = {
    getAllBsns({commit}, {showSpinner}) {
        return storeUtils.loadIntoSlot(
            commit,
            types.SET_BSN_LIST,
            showSpinner,
            () => api.getAllBsn()
        );
    },
    getCitizenDetails({commit}, {showSpinner, bsn}) {
        return storeUtils.loadIntoSlot(commit, types.SET_CITIZEN, showSpinner, () =>
            api.getCitizen(bsn)
        );
    },
    getOnboarding({commit}, {showSpinner, bsn}) {
        return storeUtils.loadIntoSlot(
            commit,
            types.SET_ONBOARDING_INFO,
            showSpinner,
            () => api.onboard(bsn)
        );
    },
    getConnectionStatus({commit}, myDid) {
        return storeUtils.loadIntoSlot(
            commit,
            types.SET_CONNECTION_INFO,
            false,
            () => api.connectionStatus(myDid)
        );
    },
    getCredentialOffers({commit}, {showSpinner}) {
        return storeUtils.loadIntoSlot(
            commit,
            types.SET_CREDENTIAL_OFFERS_INFO,
            showSpinner,
            () => api.getOffers()
        );
    },
    sendCredentials({commit}, payload) {
        return storeUtils.loadIntoSlot(
            commit,
            types.SET_CREDENTIAL_OFFER_RESPONSE,
            true,
            () => api.sendCredentials(payload)
        );
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
