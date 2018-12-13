import {
  AUTH_TOKEN_DISPLAY_BLK,
  AUTH_TOKEN_GET_REQUEST,
  AUTH_TOKEN_GET_SUCCESS,
  AUTH_TOKEN_GET_202,

  AUTH_DATA_USER_INPUT
} from '../constants/authConst'

const initialState = {
  displayBlock: false,
  fetching:     false,
  token:        '',
  fio:          'не авторизован',
  level:        'init level',
  authName:     '',
  authPass:     '',
  apiStatusTxt: ''
}


export default function authRdcr(state = initialState, action) {

  switch (action.type) {

    case AUTH_TOKEN_GET_REQUEST:
      return { ...state, 'fetching': true }
    break

    case AUTH_TOKEN_GET_SUCCESS:
      return { ...state, 'fetching': false, 'displayBlock': false, 'token': action.payload.token, 'fio': action.payload.fio }
    break

    case AUTH_TOKEN_GET_202:
      return { ...state, 'fetching': false, 'displayBlock': true, 'token': action.payload.token }
    break

    case AUTH_TOKEN_DISPLAY_BLK:
      return { ...state, displayBlock: action.payload.boolVal }
    break

    case AUTH_DATA_USER_INPUT:

      // DOM-элементы имеют store_data_key определенное значение
      if ( action.payload.storeDataKey === 'authName' ) {
        return { ...state, 'authName': action.payload.storeDataValue }
      }
      if ( action.payload.storeDataKey === 'authPass' ) {
        return { ...state, 'authPass': action.payload.storeDataValue }
      }

    break

    default:
      return state;
  }

}