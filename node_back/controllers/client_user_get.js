'use strict';

const apiTools    = require('../sub_modules/api_tools')

exports.apiAction = function(req, res, next) {
  apiTools.apiResJson(res, req.aaa.authentication, 200)
}