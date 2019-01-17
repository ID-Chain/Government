import axios from "axios";

const defaults = {
    baseURL: "/api",
    timeout: 20000
};

Object.assign(axios.defaults, defaults);

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        if (response.data) return response.data;
    } else {
        console.error("Response Request to API with ERROR Status");
        throw new Error("Something went wrong!");
    }
}

function apiGet(url) {
    return axios.get(url).then(checkStatus);
}

function apiPost(url, payload) {
    return axios.post(url, payload).then(checkStatus);
}

export default {
    getCitizen: bsn => apiGet(`/citizens/${bsn}`),
    getAllBsn: () => apiGet(`/bsn`),
    onboard: bsn => apiPost(`/connections?bsn=${bsn}`, {}),
    connectionStatus: (myDid) => apiGet(`/connections/${myDid}`),
    getOffers: () => apiGet(`/credentials`),
    sendCredentials: (payload) => apiPost(`/credentials`, payload)
};
