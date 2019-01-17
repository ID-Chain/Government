'use strict';

const log = require('../log').logger;
const DB = require('./DatabaseService');
const utils = require('../utils/utils');
const { PASSPORT_SCHEMA_NAME, PASSPORT_SCHEMA_FIELDS, PASSPORT_SCHEMA_FIELDS_SUBMIT } = require('../config');

const governmentBaseUrl = `http://${process.env.GOV_HOST}:${process.env.GOV_PORT}/api`;

const axios = require('axios').create({
    baseURL: `http://${process.env.API_HOST || 'api'}:${process.env.API_PORT || '8000'}/api`,
    timeout: process.env.REQUESTS_TIMEOUT || 60000
});

let token = '';

/**
 * Login to Node API and get Bearer Token
 * @return {Promise<void>} if resolves a token is created and stored in the module variable
 */
async function getToken() {
    try {
        // TODO: Verify if stored token is still valid, instead of login each time
        let response = await axios.post('/login', {
            username: process.env.GOV_USER,
            password: process.env.GOV_PASSWORD
        });
        token = response.data.token;
        axios.defaults.headers.common['Authorization'] = token;
    } catch (e) {
        log.error('Could not log in with user credentials');
        throw new Error('Could not log in with user credentials');
    }
}

/**
 * Get all credentials offers available in Indy API for citizens
 *
 * @return {Promise<Object>} Credential List
 **/
exports.getCredentialsList = async function() {
    try {
        await getToken();
        let response = await axios.get('/schema?onlyActive=true');
        return response.data;
    } catch (e) {
        log.error(e);
        throw new Error(e);
    }
};

/**
 * Expose endpoint to allow Node API to retrieve citizen credentials
 *
 * @param {string} myDid - DID to communicate with the citizen
 * @return {Promise<object>} credentials - Credentials mapped to the schema keys
 **/
exports.getConnectionDetailsByMyDid = async function getConnectionDetailsByMyDid(myDid) {
    try {
        const { bsn } = await DB.getCitizenByMyDid(myDid);
        await getToken();
        let response = await axios.get(`/connection/${myDid}`);
        if (response && response.data && response.data.acknowledged) {
            await DB.updateCitizenDids(bsn, myDid, response.data.theirDid);
        }
        return response.data;
    } catch (e) {
        if (e && e.response && e.response.status === 404) {
            return Object.assign({}, e.response.data, { myDid, acknowledged: false });
        } else {
            log.error(e);
            return e.response.data;
        }
    }
};

/**
 * Generate Connection Offer for the given user/citizen
 *
 * @param {string} bsn - Burger Service Number (Social security number)
 * @return {Promise<object>} QRCodePayload
 **/
exports.newConnectionOffer = async function(bsn) {
    try {
        await getToken();
        let response = await axios.post('/connectionoffer', {
            data: {
                name: `${process.env.GOV_NAME || 'Government'}`,
                description: `${process.env.GOV_DESCRIPTION || 'Example Government'}`,
                logoUrl: `${process.env.GOV_LOGO_URL ||
                    'http://40.68.131.169:8090/img/icons/android-chrome-192x192.png'}`
            }
        });
        if (response && response.data && response.data.meta) {
            await DB.updateCitizenDids(bsn, response.data.meta.myDid, null);
        }
        return response.data;
    } catch (e) {
        log.error(e);
        throw new Error(e);
    }
};

/**
 * Send credential to specific user by my DID reference & Credential Definition ID
 *
 * @param {string} myDid - DID to communicate with the user
 * @param {string} credDefId - Credential definition Id related to the credential schema to be offered
 * @param {string} schemaName
 * @param {string} schemaVersion
 * @return {Promise<object>} credential offer- Credential offer response payload as returned by the Node API
 **/
exports.sendCredentialsToCitizen = async function(myDid, credDefId, schemaName, schemaVersion) {
    try {
        await getToken();
        const { citizenDid } = await DB.getCitizenByMyDid(myDid);
        const requestPayload = {
            recipientDid: citizenDid,
            credDefId,
            credentialLocation:
                governmentBaseUrl +
                `/credentials/${encodeURIComponent(schemaName)}/${encodeURIComponent(
                    schemaVersion
                )}/${encodeURIComponent(myDid)}`
        };
        log.info(requestPayload);
        let response = await axios.post('/credentialoffer', requestPayload);
        return response.data;
    } catch (e) {
        log.error(e);
        throw e;
    }
};

/**
 * Expose endpoint to allow Node API to retrieve citizen credentials
 *
 * @param {string} myDid - DID used to have a shared reference between Government & Node API
 * @param {string} schemaName - Schema Name
 * @param {string} schemaVersion - Schema Name
 * @return {Promise<object>} credentials - Credentials mapped to the schema keys
 **/
exports.getCitizensCredentials = async function getCitizensCredentials(myDid, schemaName, schemaVersion) {
    const citizenCredentials = await DB.getCitizenByMyDid(myDid);
    switch (schemaName) {
        case 'passport':
            return utils.getPassportValuesFromCitizen(citizenCredentials, schemaVersion);
        default:
            throw new Error('Unknown schema');
    }
};

/**
 * Initialize Agent
 * @return {Promise<void>} if resolves all steps succeeded execution
 */
exports.init = async function init() {
    await createUser();
    await createSchemaAndCredentialDefinition();
};

/**
 * Create Government User & Wallet
 * @return {Promise<void>} if resolves a User and a Wallet are created through the API
 */
async function createUser() {
    try {
        await axios.post('/user', {
            username: process.env.GOV_USER,
            password: process.env.GOV_PASSWORD,
            wallet: {
                name: process.env.GOV_WALLET,
                seed: process.env.GOV_SEED,
                credentials: {
                    key: process.env.GOV_WALLET_KEY
                }
            }
        });
        log.info('Successfully created Government User with seed ' + process.env.GOV_SEED);
    } catch (e) {
        if (
            e &&
            e.response &&
            e.response.data &&
            e.response.data.message &&
            e.response.data.message.indexOf('username already taken') > -1
        ) {
            log.info('Username already created');
        } else {
            throw e;
        }
    }
}

/**
 * Create Schema And CredentialDefinition
 * @return {Promise<void>} if resolves a Schema and Credential Definition are created through the API
 */
async function createSchemaAndCredentialDefinition() {
    await getToken();
    const userPassportSchemas = (await axios.get('/schema?onlyActive=true')).data.filter(s => {
        s.attributes.forEach(a => {
            if (a !== 'issuance_time@unix_time' && PASSPORT_SCHEMA_FIELDS.indexOf(a) === -1) {
                log.info(`Attribute ${a} not found`);
                return false;
            }
        });
        return true;
    });
    if (userPassportSchemas.length === 0) {
        // Create 2 schemas: with and without revocations
        await axios.post('/schema', {
            name: PASSPORT_SCHEMA_NAME,
            version: '1.0',
            createCredentialDefinition: true,
            isRevocable: false,
            attributes: PASSPORT_SCHEMA_FIELDS_SUBMIT
        });
        await axios.post('/schema', {
            name: PASSPORT_SCHEMA_NAME,
            version: '1.1',
            createCredentialDefinition: true,
            isRevocable: true,
            attributes: PASSPORT_SCHEMA_FIELDS_SUBMIT
        });
    }
}
