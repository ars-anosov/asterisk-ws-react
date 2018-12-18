'use strict';

const apiTools      = require('./api_tools')
const mysqlTools  = require('./mysql_tools')

// Аутентификация по args.auth_name && args.auth_pass
exports.checkAuth = function(req, res, next) {

  if (req.swagger) {
    // Объекта swagger присутствует.
    console.log('req.swagger.operationPath:')
    console.log(req.swagger.operationPath)
    var args              = req.swagger.params

    if (args.auth_name && args.auth_pass) {
      // Прилетел запрос с 2-мя полями args.auth_name и args.auth_pass
      if (req.swagger.operationPath[1] === '/client/token' && req.swagger.operationPath[2] === 'get') {
        // Клиент хочет обратиться в controller "token_get". Пропускаю 
        next();
      }
      else {
        // Клиент хочет проскочить в controller отличный от "token_get"
        apiTools.apiResJson(res, {code: 202, message: 'token Unauthorized'}, 202);
      }
    }
    else {
      // У клиента есть token. Провожу Аутентификацию.
      let qStr = "SELECT"+
      "   id,"+
      "   level,"+
      "   fio,"+
      "   exten"+
      " FROM"+
      "   user"+
      " WHERE"+
      "   token = '"+args.token.value+"'"

      mysqlTools.mysqlAction(
        req.mysqlPoolAP,
        qStr,
        // sql result ---
        (result) => {
          req.aaa.authentication  = result[0]
          if (req.aaa.authentication && req.aaa.authentication.level > 0) {
            //authorizeCmdLvl(req, res, next)   // проверяю API команду
            next()                              // пропускаю любые API-команды
          }
          else {
            apiTools.apiResJson(res, {code: 202, message: 'token Unauthorized'}, 202)
          }
        }
        // sql result ---
      )

    }
  }
  else {
    // Нет объекта swagger. Просто считывается spec. Пропускаю.
    next();
  }

}









// Авторизация уровня доступа к команде cmd:method по req.aaa.authentication.level
function authorizeCmdLvl(req, res, next) {
  // прилетело обращение к cmd:method
  let cmd     = req.swagger.operationPath[1]
  let method  = req.swagger.operationPath[2]
  console.log(cmd+':'+method)

  // Сверяю authentication.level с cmd_level (аутентификация пользователя на конкретную API-команду)
  let qStr = "SELECT"+
  "   get_lvl, post_lvl, put_lvl, delete_lvl"+
  " FROM"+
  "   cmd_level"+
  " WHERE"+
  "   cmd = '"+cmd+"'"

  mysqlTools.mysqlAction(
    req.mysqlPoolAP,
    qStr,
    // sql result ---
    (result) => {
      if (result.length > 0) {
        let minimalLevel  = result[0][method+'_lvl']

        if (req.aaa.authentication.level >= minimalLevel) {
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

}
