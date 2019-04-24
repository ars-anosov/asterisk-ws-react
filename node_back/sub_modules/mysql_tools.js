'use strict'

const mysqlAction = function (mysqlPool, sqlStr, callback) {
  // pool.query() is shortcut for pool.getConnection() + connection.query() + connection.release()
  // https://github.com/mysqljs/mysql/issues/1202
  mysqlPool.query(
    sqlStr,
    function (err, result, fields) {
      callback(result, err)
    }
  )
}









module.exports.mysqlAction    = mysqlAction