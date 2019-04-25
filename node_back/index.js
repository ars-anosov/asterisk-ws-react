'use strict';

// arg
if (process.argv.length < 11) {
  console.log("Usage: node index.js $AMI_HOST $AMI_PORT $AMI_USER $AMI_SECRET $OPENAPI_PORT $WS_PORT $DB_HOST $DB_USER $DB_PASS")
  process.exit();
}
//  host: "192.168.30.29",
//  port: 5038,
//  username: "helpdesk",
//  secret: "helpdeskadmin"
const nodePath    = process.argv[0]
const appPath     = process.argv[1]
const amiHost     = process.argv[2]
const amiPort     = process.argv[3]
const amiUser     = process.argv[4]
const amiSecret   = process.argv[5]
const openApiPort = process.argv[6]
const wsPort      = process.argv[7]
const dbHost      = process.argv[8]
const dbUser      = process.argv[9]
const dbPass      = process.argv[10]

const namiConfig = {
  'host':     amiHost,
  'port':     amiPort,
  'username': amiUser,
  'secret':   amiSecret
}

const mysqlConfigAP = {
  connectionLimit : 3,
  host     : dbHost,
  user     : dbUser,
  password : dbPass,
  database : 'asterisk-ws'
}
const mysqlConfigHd = {
  connectionLimit : 3,
  host     : 'vrf.intellin-tech.ru',
  user     : 'hduser',
  password : 'arsadmin',
  database : 'helpdesk'
}

// fs
const fs          = require('fs')
const path        = require('path')

// http/https + middleware(express)
const http        = require('http')
const express     = require('express')

// swagger
const swaggerTools  = require('swagger-tools')
const jsyaml        = require('js-yaml')

// NAMI and logger
const namiLib   = require('nami')
const log4js    = require('log4js')

const aaa_handle    = require('./sub_modules/aaa_handle')
const namiTools     = require('./sub_modules/nami_tools')
const mysqlTools    = require('./sub_modules/mysql_tools')
const wsTools       = require('./sub_modules/ws_tools')

// Глобальный объект, будет асинхронно мутировать:
var nami                = {}
var mysqlPoolAP         = {}
var mysqlPoolHd         = {}
var coreShowChannelsObj = []
var wsServer            = {}
const localDb           = {
  'info'        : 'local base for Asterisk-WS-React',
  'apiUrl'      : 'take it from swaggerDoc const later',
}

// loggers
const logger = log4js.getLogger('index')
logger.level = 'debug'

namiConfig.logger = log4js.getLogger('NAMI')
namiConfig.logger.level = 'error'









console.log('|------------------|')
console.log('|\x1b[36m Start ARGUMENTS \x1b[0m|')
console.log('|------------------|')
console.log('namiConfig:')
console.log(namiConfig)
console.log('mysqlConfigAP:')
console.log(mysqlConfigAP)
console.log('mysqlConfigHd:')
console.log(mysqlConfigHd)
console.log('localDb:')
console.log(localDb)
console.log()








// NAMI
// https://github.com/marcelog/Nami/blob/master/src/index.js
nami = new namiLib.Nami(namiConfig)

process.on('SIGINT', function () {
  nami.close();
  process.exit();
})

nami.on('namiConnectionClose', (data) => {
  logger.warn('NAMI: Reconnecting...')
  setTimeout(function () { nami.open(); }, 5000)
})
nami.on('namiInvalidPeer', (data) => {
  logger.warn('NAMI: Invalid AMI Salute. Not an AMI?')
  process.exit();
})
nami.on('namiLoginIncorrect', (data) => {
  logger.warn('NAMI: Invalid Credentials')
  process.exit();
});

var ShowChannelsintervalId = null
nami.on('namiConnected', (data) => {
  if (ShowChannelsintervalId) {
    clearInterval(ShowChannelsintervalId)
  }
  //ShowChannelsintervalId = setInterval( () => {
  //  localDb.coreShowChannelsObj = namiTools.coreShowChannelsObjGet(nami)
  //}, 1000)
})

// Start my interactive logic -------------------------------------------------
// nami.on('namiEvent' ... всякое такое тут
const namiEventRouter = require('./nami_logic/event_router')
nami.on('namiEvent', (data) => {
  namiEventRouter.handleEvent(data, wsServer)
})

nami.open()
// NAMI end ----









// |--------------|
// |     MySQL    |
// |--------------|
var mysql = require('mysql')

// Мутирую глобальную переменную
mysqlPoolAP = mysql.createPool(mysqlConfigAP)
mysqlTools.mysqlCheckServer(mysqlPoolAP, 'AdminPage DB')

mysqlPoolHd = mysql.createPool(mysqlConfigHd)
mysqlTools.mysqlCheckServer(mysqlPoolHd, 'HelpDesk DB')









// |--------------------------|
// |     Websocket server     |
// |--------------------------|
// https://github.com/sitegui/nodejs-websocket/blob/master/samples/chat/server.js
var ws = require("nodejs-websocket")

// Мутирую глобальную переменную при каждом новом коннекте
wsServer = ws.createServer(function (connection) {
  
  wsTools.wsNewConn(wsServer, connection)
  
  connection.on("close", function () {
    wsTools.wsCloseConn(wsServer, connection)
    //wsBroadcast(connection.nickname+" left")
  })

})

wsServer.listen(wsPort)
console.log('|--------------------------|')
console.log('|\x1b[36m Websocket server started \x1b[0m|')
console.log('|--------------------------|')
console.log('  ws://192.168.13.97:%d', wsPort)
console.log('  connections now: ', wsServer.connections.length)
console.log()









//----------------------------------------------------------------------------|
//                                    swagger                                 |
//----------------------------------------------------------------------------|
const options       = {
  swaggerUi:    path.join(__dirname, 'swagger.json'),
  controllers:  path.join(__dirname, 'controllers'),
  useStubs:     process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
}
const spec          = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
const swaggerDoc    = jsyaml.safeLoad(spec)
localDb.apiUrl      = 'http://'+swaggerDoc.host

// [!!! middleware !!!] [!!! middleware !!!] [!!! middleware !!!] -------------

// Добавляю в ответ заголовки
var httpAccessControl = function (req, res, next) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  // Для OAuth2 нужен Access-Control-Request-Headers: authorization
  // Для Swagger нужен Access-Control-Request-Headers: content-type, token
  res.setHeader('Access-Control-Allow-Headers', 'authorization, token, content-type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
}

// Отключаю обработку OPTIONS
var httpOptions = function(req, res, next) {
  if (req.method == 'OPTIONS') {
    res.end()
  }
  else {
    next()
  }
}

// Если у запроса есть в Header поле Authorization:Bearer значит была пройдена OAuth2
var httpOaut2 = function(req, res, next) {
  if (req.headers.authorization) {
    console.log(req.headers.authorization)
  }
  next()
}

// Заготовка на отдачу static файла
var httpStaticFiles = function (req, res, next) {
  switch (true) {
    case (req.url === '/favion.ico'):
      res.end()
      break
    default:
      next()
      break
  }
}

// Наполнение req.localDb мутирующим глобальным объектом localDb
var connectMyModules = function(req, res, next) {
  req['nami']                 = nami
  req['mysqlPoolAP']          = mysqlPoolAP
  req['mysqlPoolHd']          = mysqlPoolHd
  req['coreShowChannelsObj']  = coreShowChannelsObj
  req['wsServer']             = wsServer
  req['localDb']              = localDb
  req['aaa']                  = {'authentication':{}, 'authorization':{}, 'accounting':{}}
  next()
}









//----------------------------------------------------------------------------|
//                                  express                                   |
//----------------------------------------------------------------------------|

// swagger OpenAPI ------------------------------------------------------------
var eAppSwg = express()

eAppSwg.get('/', (req, res) => res.send('Answer to the Ultimate Question of Life, the Universe, and Everything\n'))

swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Моя статика
  eAppSwg.use('/ws_test',       express.static(path.join(__dirname, 'ws_test')))
  eAppSwg.use('/front_build',   express.static(path.join(__dirname, '../web_front/build')))

  // Работаю с модулем swaggerTools (объект middleware) =============
  // https://github.com/apigee-127/swagger-tools/blob/master/docs/Middleware.md

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  eAppSwg.use(middleware.swaggerMetadata())

  // Правильная реакция на всякое от HTTP
  eAppSwg.use(httpAccessControl)
  eAppSwg.use(httpOptions)
  eAppSwg.use(httpOaut2)
  eAppSwg.use(httpStaticFiles)
  
  // Прокидываю свои контроллеры в переменной req
  eAppSwg.use(connectMyModules)

  // AAA на базе HTTP Header "token"
  eAppSwg.use(aaa_handle.checkAuth)

  // AAA на базе oauth2
  //eAppSwg.use(middleware.swaggerSecurity({
  //  oauth2: function (req, def, scopes, callback) {
  //    // Do real stuff here
  //  }
  //}))

  // Validate Swagger requests
  eAppSwg.use(middleware.swaggerValidator({
    validateResponse: true
  }))

  // Route validated requests to appropriate controller
  eAppSwg.use(middleware.swaggerRouter(options))

  // Serve the Swagger documents and Swagger UI
  // https://github.com/apigee-127/swagger-tools/blob/master/middleware/swagger-ui.js
  eAppSwg.use(middleware.swaggerUi({
    apiDocs: '/spec/swagger.json',
    swaggerUi: '/spec-ui'
  }))

  const httpServer = http.createServer(eAppSwg)
  httpServer.listen(openApiPort, () => {
    console.log('|------------------------------------|')
    console.log('|\x1b[36m Asterisk WebSocket REACTOR started \x1b[0m|')
    console.log('|------------------------------------|')
    console.log('  Swagger-UI: '+localDb.apiUrl+'/spec-ui/')
    console.log()
    console.log()
  })

})
