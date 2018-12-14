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



/** Генератор случайной строки
 * @param {int} n длинна строки
 */
var randWDclassic = function (n) {
  var s ='', abd ='abcdefghijklmnopqrstuvwxyz0123456789', aL = abd.length;
  while(s.length < n)
    s += abd[Math.random() * aL|0];
  return s;
}









module.exports.apiResJson     = apiResJson
module.exports.randWDclassic  = randWDclassic