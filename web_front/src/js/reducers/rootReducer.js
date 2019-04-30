import { combineReducers }  from 'redux'
import swgControlRdcr       from './swgControlRdcr'
import swgControlRdcr2      from './swgControlRdcr2'
import wsControlRdcr        from './wsControlRdcr'
import authRdcr             from './authRdcr'

import appMenuRdcr          from './appMenuRdcr'
import wsPopupRdcr          from './wsPopupRdcr'

import hdRdcr               from './hdRdcr'



export default combineReducers({
  swgControlRdcr,
  swgControlRdcr2,
  wsControlRdcr,
  authRdcr,
  
  appMenuRdcr,
  wsPopupRdcr,

  hdRdcr,
  
})