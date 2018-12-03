'use strict';

// arg
if (process.argv.length !== 7) {
  console.log("Usage: node index.js $AMI_HOST $AMI_PORT $AMI_USER $AMI_SECRET $OPENAPI_PORT")
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

// fs
const fs          = require('fs')
const path        = require('path')

// http/https + middleware(express)
const http        = require('http')
const express     = require('express')

// swagger
const swaggerTools  = require('swagger-tools')
const jsyaml        = require('js-yaml')

var aaa_handle    = require('./sub_modules/aaa_handle')

// Глобальный объект, будет асинхронно мутировать:
var nami = {}
var coreShowChannelsObj = []
const localDb = {
  'info': 'local base for Asterisk-WS-React',
  'namiConfig': {
    'host':     amiHost,
    'port':     amiPort,
    'username': amiUser,
    'secret':   amiSecret
  },
  'coreShowChannelsObj': [],
  'nami': nami
}


console.log('\nlocalDb:')
console.log(localDb)
console.log()









// NAMI
// https://github.com/marcelog/Nami/blob/master/src/index.js

const namiLib = require('nami')

//localDb.namiConfig.logger = require('log4js').getLogger('Nami.Core')
//localDb.namiConfig.logger.setLevel('ERROR')

nami = new namiLib.Nami(localDb.namiConfig)

process.on('SIGINT', function () {
  nami.close();
  process.exit();
})

nami.on('namiConnectionClose', function (data) {
  console.log('Reconnecting...');
  setTimeout(function () { nami.open(); }, 5000)
});
nami.on('namiInvalidPeer', function (data) {
  console.log("Invalid AMI Salute. Not an AMI?")
  process.exit();
});
nami.on('namiLoginIncorrect', function () {
  console.log("Invalid Credentials")
  process.exit();
});

nami.on('namiEvent', function (event) {
  console.log('event -------------------------------------------:')
  console.log(event.event)
  if (event.event == 'HangupRequest') {
    //
  }

})

nami.open()


const namiAction = new namiLib.Actions.CoreShowChannels()

/*
setInterval(
  () => {
    coreShowChannelsObj = coreShowChannelsObjGet(namiAction)
  }, 1000)
*/

function coreShowChannelsObjGet(action) { 
  let respObj = []

  nami.send(action, function (response) {
    //console.log(' ---- Response: ' + util.inspect(response).slice(5));
    //console.log(response.events[0]);
    //var jsonObj = JSON.parse(response);
    //console.log(jsonObj);
    
    for (var i in response.events) {
      if (response.events[i].event == 'CoreShowChannel') {
        //console.log(response.events[i])
        respObj.push(response.events[i])
      }
    }

  })

  return respObj
}
// NAMI end ----









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
  localDb['nami'] = nami
  localDb['coreShowChannelsObj'] = coreShowChannelsObj

  req['localDb'] = localDb
  next()
}









//----------------------------------------------------------------------------|
//                                  express                                   |
//----------------------------------------------------------------------------|

// swagger OpenAPI ------------------------------------------------------------
var eAppSwg = express()

eAppSwg.get('/', (req, res) => res.send('Answer to the Ultimate Question of Life, the Universe, and Everything\n'))

swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
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
    console.log('express eAppSwg started on http server, port: '+openApiPort)
  })

})
