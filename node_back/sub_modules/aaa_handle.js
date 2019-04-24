'use strict';

const apiTools      = require('./api_tools')
const mysqlTools    = require('./mysql_tools')

// Аутентификация по args.auth_name && args.auth_pass
exports.checkAuth = function(req, res, next) {

  if (req.swagger) {
    // Объект swagger присутствует.
    const args              = req.swagger.params

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
      "   user.id                     AS id,"+
      "   user.name                   AS name,"+
      "   user.level                  AS level,"+
      "   user.fio                    AS fio,"+
      "   user_app.app_arr            AS app_arr,"+
      "   user_exten.exten_arr        AS exten_arr"+
      " FROM"+
      "   user"+
      " LEFT JOIN"+
      "   user_app ON user.id=user_app.user_id"+
      " LEFT JOIN"+
      "   user_exten ON user.id=user_exten.user_id"+
      " WHERE"+
      "   user.token = '"+args.token.value+"'"

      //console.log(qStr)

      mysqlTools.mysqlAction(
        req.mysqlPoolAP,
        qStr,
        // sql result ---
        (result) => {
          req.aaa.authentication  = result[0]
          if (req.aaa.authentication && req.aaa.authentication.level > 0) {
            accountingCmd(req, res, next)       // Начинаю цепочку действий с логирования команд в базе
            //next()                              // пропускаю любые API-команды
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









// Accounting действий cmd:method
function accountingCmd(req, res, next) {
  // прилетело обращение к cmd:method
  const cmd     = req.swagger.operationPath[1]
  const method  = req.swagger.operationPath[2]
  const args    = req.swagger.params

  console.log('[accountingCmd] '+req.aaa.authentication.name+' > '+cmd+':'+method)
  if ( method === 'delete' || ((method === 'post' || method === 'put') && args.body) ) {
    const qStr = "INSERT INTO user_log (user_id, cmd, method, text) VALUES"+
    "   ("+req.aaa.authentication.id+","+
    "   '"+cmd+"',"+
    "   '"+method+"',"+
    "   '"+JSON.stringify(args)+"')"

    mysqlTools.mysqlAction(
      req.mysqlPoolAP,
      qStr,
      (result) => {
        //console.log(result)
      }
    )
  }

  //authenticateCmdLvl(req, res, next)   // Проверка уровня доступа к API команде
  next()                              // Цепочка проверок закончена
  
}









// Уровень доступа к команде cmd:method по req.aaa.authentication.level
function authenticateCmdLvl(req, res, next) {
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
