'use strict';

let utils = require('../utils/writer.js');
let Citizens = require('../service/CitizensService');

exports.getAllBsn = function getAllBsn(req, res, next) {
    Citizens.getAllBsn()
        .then(response => utils.writeJson(res, response))
        .catch(error => utils.serverError(res, error));
};

exports.getCitizensDetailsByBsn = function getCitizensDetailsByBsn(req, res, next) {
    let bsn = req.swagger.params['bsn'].value;
    Citizens.getCitizensDetailsByBsn(bsn)
        .then(response => utils.writeJson(res, response))
        .catch(error => utils.serverError(res, error));
};
