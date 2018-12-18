'use strict';

const m_token_get    = require('./client_token_get')

const m_user_get     = require('./client_user_get')









module.exports.token_get = function(req, res, next) {
  m_token_get.apiAction(req, res, next)
}

module.exports.user_get = function(req, res, next) {
  m_user_get.apiAction(req, res, next)
}