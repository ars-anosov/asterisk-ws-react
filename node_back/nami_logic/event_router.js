'use strict';

const log4js  = require('log4js')
const logger  = log4js.getLogger('event_router')
logger.level  = 'debug'

const wsTools       = require('../sub_modules/ws_tools')


const handleEvent = function(data, wsServer) {

  logger.debug(data)
  wsTools.wsBroadcast(wsServer, JSON.stringify(data))

  switch(data.event) {

    case 'FullyBooted':
      logger.info(data.event)
      break

    case 'Dial':
      logger.info(data.event)
      break

    case 'Hangup':
      logger.info(data.event)
      break
  }

}
// END OF handleEvent









module.exports.handleEvent   = handleEvent