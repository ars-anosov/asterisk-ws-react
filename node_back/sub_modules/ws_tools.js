'use strict';

var wsBroadcast = function (wsServer, str) {
  if (wsServer && wsServer.connections) {
    wsServer.connections.forEach(function (connection) {
      connection.sendText(str)
    })
  }
}









var wsNewConn = function (wsServer, connection) {
  if (wsServer && wsServer.connections) {
    wsBroadcast(wsServer, '{"type": "___debugMsg", "msg": "WS new client", "connectionsNow": '+wsServer.connections.length+'}')

    connection.nickname = null

    // Подписываюсь на события
    connection.on("text", function (str) {
      console.log('WS - text')
      
      if (connection.nickname === null) {
        connection.nickname = str
        //wsBroadcast(str+" entered")
      }
      else {
        //wsBroadcast("["+connection.nickname+"] "+str)
      }
    })
  }

}









var wsCloseConn = function (wsServer, connection) {
  if (wsServer && wsServer.connections) {
    wsBroadcast(wsServer, '{"type": "___debugMsg", "msg": "WS close connection", "connectionsNow": '+wsServer.connections.length+'}')
  }
}









var onText = function(connection) {
  if (connection) {
    console.log('WS - text')
  }
}









module.exports.wsBroadcast		= wsBroadcast
module.exports.wsNewConn			= wsNewConn
module.exports.wsCloseConn		= wsCloseConn
module.exports.onText					= onText
