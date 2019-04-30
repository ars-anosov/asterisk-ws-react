'use strict';

var wsBroadcast = function (wsServer, str) {
  if (wsServer && wsServer.connections) {
    wsServer.connections.forEach((connection) => {
      connection.sendText(str)
    })
  }
}

var wsSendToNickname = function (wsServer, nickname, str) {
  if (wsServer && wsServer.connections) {
    wsServer.connections.forEach((connection) => {
      if (connection.nickname === nickname) {
        connection.sendText(str)
      }
    })
  }
}








var wsNewConn = function (wsServer, connection) {
  if (wsServer && wsServer.connections) {
    
    wsBroadcast(wsServer, '{"event": "___debugMsg", "msg": "WS new client", "connectionsNow": '+wsServer.connections.length+'}')

    connection.nickname = null

    // Клиент прислал текст
    connection.on("text", function (str) {
      console.log('WS text: '+str)
      
      let objFromWsText = {}
      try {
        objFromWsText = JSON.parse(str)
      } catch (e) {
        //console.log(e)
      }

      if (connection.nickname === null) {
        if (objFromWsText[0]) {
          connection.nickname = objFromWsText[0]
          wsBroadcast(wsServer, '{"event": "___debugMsg", "msg":"'+objFromWsText[0]+' subscribed to WebSocket connection"}')
        }
        else (
          wsBroadcast(wsServer, '{"event": "___debugMsg", "msg":"ERROR! First message must be JSON formated: ["SIP_exten"]"}')
        )
      }
      else {
        wsBroadcast(wsServer, '{"event": "___debugMsg", "msg":"'+connection.nickname+' send text: '+str+'"}')
      }
    })
  }

}









var wsCloseConn = function (wsServer, connection) {
  if (wsServer && wsServer.connections) {
    wsBroadcast(wsServer, '{"event": "___debugMsg", "msg": "WS close connection", "connectionsNow": '+wsServer.connections.length+'}')
  }
}









var onText = function(connection) {
  if (connection) {
    console.log('WS - text')
  }
}









module.exports.wsBroadcast		= wsBroadcast
module.exports.wsSendToNickname = wsSendToNickname

module.exports.wsNewConn			= wsNewConn
module.exports.wsCloseConn		= wsCloseConn
module.exports.onText					= onText
