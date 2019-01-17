'use strict';

let utils = require('../utils/writer');
let Indy = require('../service/IndyService');

exports.getCredentialsList = function getCredentialsList(req, res, next) {
    Indy.getCredentialsList()
        .then(response => utils.writeJson(res, response))
        .catch(error => utils.serverError(res, error));
};

exports.newConnectionOffer = function newConnectionOffer(req, res, next) {
    const bsn = req.swagger.params['bsn'].value;
    Indy.newConnectionOffer(bsn)
        .then(response => utils.writeJson(res, response))
        .catch(error => utils.serverError(res, error));
};

exports.sendCredentialsToCitizen = function sendCredentialsToCitizen(req, res, next) {
    let { myDid, credDefId, schemaName, schemaVersion } = req.swagger.params['body'].value;
    Indy.sendCredentialsToCitizen(myDid, credDefId, schemaName, schemaVersion)
        .then(response => utils.writeJson(res, response))
        .catch(error => utils.serverError(res, error));
};

exports.getCitizensCredentials = function getCitizensCredentials(req, res, next) {
    let myDid = req.swagger.params['myDid'].value;
    let schemaName = req.swagger.params['schemaName'].value;
    let schemaVersion = req.swagger.params['schemaVersion'].value;
    Indy.getCitizensCredentials(myDid, schemaName, schemaVersion)
        .then(response => utils.writeJson(res, response))
        .catch(error => utils.serverError(res, error));
};

exports.getConnectionDetailsByMyDid = function getConnectionDetailsByMyDid(req, res, next) {
    let myDid = req.swagger.params['myDid'].value;
    Indy.getConnectionDetailsByMyDid(myDid)
        .then(response => utils.writeJson(res, response))
        .catch(error => utils.serverError(res, error));
};
