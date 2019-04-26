import { combineReducers }  from 'redux'
import swgControlRdcr       from './swgControlRdcr'
import wsControlRdcr        from './wsControlRdcr'
import authRdcr             from './authRdcr'
import appMenuRdcr          from './appMenuRdcr'

import hdRdcr               from './hdRdcr'



export default combineReducers({
  swgControlRdcr,
  wsControlRdcr,
  authRdcr,
  appMenuRdcr,

  hdRdcr,
})