'use strict';

const log = require('../log').logger;
const FIELDS = require('../config').PASSPORT_SCHEMA_FIELDS;

module.exports = {
    getPassportValuesFromCitizen
};

/**
 * Get Passport Values From Citizen
 * @param {object} userInfo
 * @param {string} schemaVersion
 * @return {object} passport credentials
 */
function getPassportValuesFromCitizen(userInfo, schemaVersion) {
    const {
        bsn,
        code,
        gender,
        givenName,
        surname,
        dateOfBirth,
        placeOfBirth,
        passportNumber,
        passportDateOfIssue,
        passportDateOfExpiry,
        passportAuthority
    } = userInfo;
    const credentialOffered = Math.floor(Date.now() / 1000);
    // For now the schema attributes are fixed for all versions, if we would like to support multiple schema formats
    // we would need to take it into consideration here
    let passport = {};
    passport[FIELDS[0].toLowerCase()] = credentialOffered;
    passport[FIELDS[1].toLowerCase()] = bsn;
    passport[FIELDS[2].toLowerCase()] = passportNumber;
    passport[FIELDS[3].toLowerCase()] = surname;
    passport[FIELDS[4].toLowerCase()] = givenName;
    passport[FIELDS[5].toLowerCase()] = gender;
    passport[FIELDS[6].toLowerCase()] = code;
    passport[FIELDS[7].toLowerCase()] = -1 * dateOfBirth;
    passport[FIELDS[8].toLowerCase()] = placeOfBirth;
    passport[FIELDS[9].toLowerCase()] = passportAuthority;
    passport[FIELDS[10].toLowerCase()] = passportDateOfIssue;
    passport[FIELDS[11].toLowerCase()] = passportDateOfExpiry;
    log.info(`Passport v${schemaVersion} stringified for citizen with bsn: ${bsn} \n ${JSON.stringify(passport)}`);
    return passport;
}
