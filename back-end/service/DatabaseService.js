'use strict';

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./back-end/government.db');

const COL_BSN = 'BSN';
const COL_GOVERNMENT_DID = 'GOVERNMENT_DID';
const COL_CITIZEN_DID = 'CITIZEN_DID';
const COL_DATE_OF_DID_ONBOARDING = 'DATE_OF_DID_ONBOARDING';

// SQL Commands
const SELECT_ALL_BSN = `SELECT ${COL_BSN} FROM CITIZENS`;
const UPDATE_CITIZEN_DIDS = `
UPDATE CITIZENS 
    SET ${COL_GOVERNMENT_DID} = ?, ${COL_CITIZEN_DID} = ?, ${COL_DATE_OF_DID_ONBOARDING} = ? 
    WHERE ${COL_BSN} = ?`;

module.exports = {
    getAllBsnNumbers,
    updateCitizenDids,
    getCitizenByBsn,
    getCitizenByMyDid
};

/**
 * Get Citizen Details by BSN
 *
 * @param {string} bsn
 * @return {object} citizen details
 **/
function getCitizenByBsn(bsn) {
    return getCitizenByColumnValue(COL_BSN, bsn);
}

/**
 * Get Citizen Details by MY DID
 *
 * @param {string} myDid
 * @return {object} citizen details
 **/
function getCitizenByMyDid(myDid) {
    return getCitizenByColumnValue(COL_GOVERNMENT_DID, myDid);
}

/**
 * Get All BSN Numbers (used in the autocomplete text field of the UI home page)
 *
 * @return {object} All BSN numbers in an Array
 **/
function getAllBsnNumbers() {
    return new Promise((resolve, reject) => {
        db.all(SELECT_ALL_BSN, (err, res) => {
            if (err) reject({ code: 500, message: err });
            resolve(res.map(({ BSN }) => BSN));
        });
    });
}

// -----> Util methods to check if user is fully onboarded or is pending

/**
 * Update Citizen DIDs
 *
 * @param {string} bsn
 * @param {string} myDid
 * @param {string} theirDid
 * @return {Promise<void>} query result
 **/
function updateCitizenDids(bsn, myDid, theirDid) {
    if (!bsn) throw Error('Invalid arguments');
    const governmentDid = typeof myDid !== 'undefined' ? myDid : null;
    const citizenDid = typeof theirDid !== 'undefined' ? theirDid : null;
    return new Promise((resolve, reject) => {
        db.run(
            UPDATE_CITIZEN_DIDS,
            [String(governmentDid), citizenDid, Math.floor(Date.now() / 1000), bsn],
            (err, res) => {
                if (err) reject({ code: 500, message: err });
                resolve(res);
            }
        );
    });
}

// -----> DB Utils methods:

/**
 * Get Citizen Info By a Given Column & Value Condition
 *
 * @param {string} column
 * @param {string} value
 * @return {Promise<void>} Citizen Detail if found
 **/
function getCitizenByColumnValue(column, value) {
    if (!value) throw Error('Invalid arguments');
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM CITIZENS WHERE ${column} = ?`, [value], (err, [res]) => {
            if (err) reject({ code: 500, message: err });
            if (!res)
                reject({
                    code: 404,
                    message: `Not found citizen with ${column}: ${value}`
                });
            resolve(camelCaseKeys(res));
        });
    });
}

/**
 * Transform DB columns formats to camelCase: COL_NAME to colName
 *
 * @param {string} str - Column Name in DB format
 * @return {string} camelCased column name
 **/
function toCamelCase(str) {
    if (typeof str === 'undefined') return '';
    return str
        .split('_')
        .map((t, i) => {
            const camel = t.toLowerCase();
            if (i) return camel[0].toUpperCase() + camel.slice(1);
            return camel;
        })
        .join('');
}

/**
 * Transform object result from DB to camelCased keys
 *
 * @param {object} o - result object
 * @return {object} camelCased object keys
 **/
function camelCaseKeys(o) {
    if (typeof o !== 'object') return {};
    let result = {};
    Object.entries(o).forEach(([k, v]) => (result[toCamelCase(k)] = v));
    return result;
}
