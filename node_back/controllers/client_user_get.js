'use strict';

const apiTools    = require('../sub_modules/api_tools')
const mysqlTools  = require('../sub_modules/mysql_tools')

exports.apiAction = function(req, res, next) {
  apiTools.apiResJson(res, req.aaa.authentication, 200)
}