'use strict';

const apiTools    = require('../sub_modules/api_tools')
const mysqlTools  = require('../sub_modules/mysql_tools')

exports.apiAction = function(req, res, next) {

  const args      = req.swagger.params

  let qStr = "SELECT"+
  "   id,"+
  "   level,"+
  "   fio"+
  " FROM"+
  "   user"+
  " WHERE"+
  "   name = '"+args.auth_name.value+"' AND"+
  "   pass = '"+args.auth_pass.value+"'"

  mysqlTools.mysqlAction(
    req.mysqlPoolAP,
    qStr,
    // sql result ---
    (result) => {

      let authStatus  = {}
      // map ---
      result.map((row, i) => {
        authStatus.id     = row.id
        authStatus.level  = row.level
        authStatus.fio    = row.fio
      })
      // map ---

      // response ---
      if (authStatus.level) {
        // клиент ввел правильный пароль и level пользователя не 0
        let token_new  = apiTools.randWDclassic(30)
        
        // UPDATE DB token
        let qStr = "UPDATE"+
        "   user"+
        " SET"+
        "   token='"+token_new+"'"+
        " WHERE"+
        "   id = '"+authStatus.id+"'"

        mysqlTools.mysqlAction(
          req.mysqlPoolAP,
          qStr,
          (result) => {
            if (result.changedRows > 0) {
              apiTools.apiResJson(res, {'token': token_new, 'fio': authStatus.fio}, 200)
            }
            else {
              apiTools.apiResJson(res, {'code': 202, 'message': 'token не обновился в БД'}, 202)
            }
          }
        )
        // UPDATE token

      }
      else {
        apiTools.apiResJson(res, {'code': 202, 'message': 'Пароль не подходит'}, 202)
      }
      // response ---

    }
    // sql result ---
  )

}