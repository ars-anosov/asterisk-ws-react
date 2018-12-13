import { combineReducers }  from 'redux'
import swgControlRdcr       from './swgControlRdcr'
import authRdcr             from './authRdcr'



export default combineReducers({
  swgControlRdcr,
  authRdcr
})