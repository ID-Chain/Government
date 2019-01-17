'use strict';

const DB = require('./DatabaseService');

/**
 * Get all BSN numbers
 *
 * returns List
 **/
exports.getAllBsn = DB.getAllBsnNumbers;

/**
 * Get Citizen all personal data
 *
 * bsn Integer Social Security Number in the Netherlands (Burger Service Nummer)
 * returns CitizenDetails
 **/
exports.getCitizensDetailsByBsn = DB.getCitizenByBsn;
