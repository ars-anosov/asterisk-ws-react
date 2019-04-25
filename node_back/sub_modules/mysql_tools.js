'use strict'

const mysqlAction = function (mysqlPool, sqlStr, callback) {
  // pool.query() is shortcut for pool.getConnection() + connection.query() + connection.release()
  // https://github.com/mysqljs/mysql/issues/1202
  mysqlPool.query(
    sqlStr,
    function (err, result, fields) {
      if (err) { console.log(err) }
      callback(result, err)
    }
  )
}

const mysqlCheckServer = function (mysqlPool, desc) {
  mysqlPool.query(
    "SHOW GLOBAL VARIABLES LIKE 'version%'",
    function (err, result, fields) {
      console.log()
      console.log('| '+desc)

      if (err) {
        console.log('|---')
        console.log('|\x1b[31m '+err.sqlMessage+' \x1b[0m')
        console.log('|---')
      }

      if (result) {
        console.log('|---------------------|')
        console.log('|\x1b[36m mysqlPool connected \x1b[0m|')
        console.log('|---------------------|')
        result.map((row) => {
          console.log('  '+row.Variable_name+': '+row.Value)
        })
      }

      console.log()
    }
  )
}








module.exports.mysqlAction        = mysqlAction
module.exports.mysqlCheckServer   = mysqlCheckServer