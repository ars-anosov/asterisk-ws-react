'use strict';

const apiTools      = require('./api_tools')
const mysqlTools  = require('./mysql_tools')

exports.checkAuth = function(req, res, next) {

  if (req.swagger) {
    // Объекта swagger присутствует.
    console.log('req.swagger.operationPath:')
    console.log(req.swagger.operationPath)
    var args              = req.swagger.params

    if (args.auth_name && args.auth_pass) {
      // Прилетел запрос с 2-мя полями args.auth_name и args.auth_pass
      if (req.swagger.apiPath === '/client/token') {
        // Клиент хочет обратиться в controller "token_get". Пропускаю 
        next();
      }
      else {
        // Клиент хочет проскочить в controller отличный от "token_get"
        apiTools.apiResJson(res, {code: 401, message: 'token Unauthorized'}, 401);
      }
    }
    else {
      // У клиента есть token. Проверяю.
      let qStr = "SELECT"+
      "   level"+
      " FROM"+
      "   user"+
      " WHERE"+
      "   token = '"+args.token.value+"'"

      apiResponse({level: 10}) // пока без проверок в БД
      /*
      let authStatus  = {}
      mysqlTools.mysqlAction(
        req.myObj.mysqlPoolAP,
        qStr,
        // sql result ---
        (result) => {

          // map ---
          result.map((row, i) => {
            authStatus.level  = row.level
          })
          // map ---

          apiResponse(authStatus)
        }
        // sql result ---
      )
      */

    }
  }
  else {
    // Нет объекта swagger. Просто считывается spec. Пропускаю.
    next();
  }





  // На любой запрос к API проверяю какая именно команда пришла
  function apiResponse(authStatus) {

    if (authStatus.level > 0) {
      // Для клиентского token нашелся какой-то level -> См. authStatus.
      let cmd     = req.swagger.operationPath[1]
      let method  = req.swagger.operationPath[2]
      console.log(cmd+':'+method)

      // Сверяю authStatus.level с cmd_level (аутентификация пользователя на конкретную API-команду)
      let qStr = "SELECT"+
      "   get_lvl, post_lvl, put_lvl, delete_lvl"+
      " FROM"+
      "   cmd_level"+
      " WHERE"+
      "   cmd = '"+cmd+"'"

      next() // пока без проверок в БД
      /*
      mysqlTools.mysqlAction(
        req.myObj.mysqlPoolAP,
        qStr,
        // sql result ---
        (result) => {
          if (result.length > 0) {
            let minimalLevel = 10000
            minimalLevel  = result[0][method+'_lvl']

            if (authStatus.level >= minimalLevel) {
              // Если authStatus.level пользователя подходящий - пропускаю
              next()
            }
            else {
              // Команда для пользователя не разрешена
              apiTools.apiResJson(res, {code: 202, message: cmd+':'+method+' - недостаточный уровень доступа'}, 202)
            }
          }
          else {
            apiTools.apiResJson(res, {code: 202, message: cmd+':'+method+' - не присвоен уровень доступа'}, 202)
          }
        }
        // sql result ---
      )
      */
    }

    else {
      // в authStatus пусто.
      apiTools.apiResJson(res, {code: 202, message: 'token Unauthorized'}, 202)
    }

  }

}
