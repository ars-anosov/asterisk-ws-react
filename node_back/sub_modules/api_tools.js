'use strict';

/** Ответ в виде JSON.stringify
 * 
 */
var apiResJson = function (res, resObj, statusCode) {
  var response = {};
  response['application/json'] = resObj;

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');

  res.end(JSON.stringify(response[Object.keys(response)[0]] || {}, null, 2));
}









module.exports.apiResJson     = apiResJson