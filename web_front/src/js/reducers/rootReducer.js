import { combineReducers }  from 'redux'
import swgControlRdcr       from './swgControlRdcr'
import authRdcr             from './authRdcr'
import appMenuRdcr          from './appMenuRdcr'

import hdRdcr               from './hdRdcr'



export default combineReducers({
  swgControlRdcr,
  authRdcr,
  appMenuRdcr,

  hdRdcr,
})