'use strict';

const apiTools    = require('../sub_modules/api_tools')
const mysqlTools  = require('../sub_modules/mysql_tools')



function ttFromClient(mysqlPool, login_hd, cb) {
  const qStr = "SELECT"+
  "  tt.number AS number,"+
  "  LEFT(tt.description,100) AS descrip,"+
  "  ( select operator.name from operator where tt.operator_to = operator.id ) AS oper,"+
  "  ( select client.name from client where tt.client = client.id ) AS company"+
  "  FROM"+
  "  tt,"+
  "  operator"+
  "  WHERE tt.status > 0"+
  "  AND operator.login = '"+login_hd+"'"+
  "  AND tt.operator_from <> tt.operator_to"+
  "  AND ("+
  "    ("+
  "      tt.operator_from = operator.id"+
  "      AND tt.id = (SELECT MAX(tt2.id) from tt tt2 WHERE tt2.number = tt.number)"+
  "    )"+
  "  )"+
  "  ORDER BY tt.id DESC"

  let finalArr = []
  
  mysqlTools.mysqlAction(
    mysqlPool,
    qStr,
    // sql result ---
    (result) => {
      if (result) {
        result.map(row => {
          finalArr.push(row)
        })
      }
      cb(finalArr)
    }
    // sql result ---
  )
}


function ttToClient(mysqlPool, login_hd, cb) {
  const qStr = "SELECT"+
  "  tt.number AS number,"+
  "  LEFT(tt.description,100) AS descrip,"+
  "  ( select operator.name from operator where tt.operator_from = operator.id ) AS oper,"+
  "  ( select client.name from client where tt.client = client.id ) AS company"+
  "  FROM"+
  "  tt,"+
  "  operator"+
  "  WHERE tt.status > 0"+
  "  AND operator.login = '"+login_hd+"'"+
  "  AND ("+
  "    ("+
  "      tt.operator_to = operator.id"+
  "      AND tt.id = (SELECT MAX(tt2.id) from tt tt2 WHERE tt2.number = tt.number)"+
  "    )"+
  "  )"+
  "  ORDER BY tt.id DESC"

  let finalArr = []
  
  mysqlTools.mysqlAction(
    mysqlPool,
    qStr,
    // sql result ---
    (result) => {
      if (result) {
        result.map(row => {
          finalArr.push(row)
        })
      }
      cb(finalArr)
    }
    // sql result ---
  )
}



exports.apiAction = function(req, res, next) {
  const args                = req.swagger.params

  const appArr = JSON.parse(req.aaa.authentication.app_arr)
  const appPassed = apiTools.arrExistsByPropName([{'name': 'HelpDesk'}], 'name', appArr)
  if (appPassed.length === 0) {
    apiTools.apiResJson(res, {'message': req.aaa.authentication.app_arr+' - недостаточный уровень доступа', 'code': 202}, 202)
  }
  else {

    ttToClient( req.mysqlPoolHd, req.aaa.authentication.login_hd, (ttNumToMe) => {
      ttFromClient( req.mysqlPoolHd, req.aaa.authentication.login_hd, (ttNumFromMe) => {

        let finalResult = []

        ttNumToMe.map(row => {
          finalResult.push({
            'tt_number'   : String(row.number),
            'tt_dir'      : 'to_me',
            'desc'        : row.descrip,
            'oper'        : row.oper,
            'company'     : row.company
          })
        })
        ttNumFromMe.map(row => {
          finalResult.push({
            'tt_number'   : String(row.number),
            'tt_dir'      : 'from_me',
            'desc'        : row.descrip,
            'oper'        : row.oper,
            'company'     : row.company
          })
        })
      
        apiTools.apiResJson(res, finalResult, 200)
      })    
    })

  }

}