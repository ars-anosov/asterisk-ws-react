'use strict';

const namiLib   = require('nami')



var coreShowChannelsObjGet = function(nami) { 
  let respObj = []
  let namiAction = new namiLib.Actions.CoreShowChannels()

  nami.send(namiAction, function (response) {
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









module.exports.coreShowChannelsObjGet    = coreShowChannelsObjGet