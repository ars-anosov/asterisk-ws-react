'use strict';

const m_hd_ttmy_get    = require('./hd_ttmy_get')









module.exports.hd_ttmy_get = function(req, res, next) {
  m_hd_ttmy_get.apiAction(req, res, next)
}