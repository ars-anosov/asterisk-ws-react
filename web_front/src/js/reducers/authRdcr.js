import {
  AUTH_TOKEN_DISPLAY_BLK,

  AUTH_TOKEN_GET_REQUEST,
  AUTH_TOKEN_GET_SUCCESS,
  AUTH_TOKEN_GET_202,

  AUTH_USER_GET_REQUEST,
  AUTH_USER_GET_SUCCESS,
  AUTH_USER_GET_202,

  AUTH_DATA_USER_INPUT,
} from '../constants/authConst'

const initialState = {
  displayBlock: false,
  fetching:     false,
  token:        '',
  message:      '',

  clientUserDataApiMessage    : '',
  clientUserData              : {},
}

import { ISODateString }  from '../sub_modules/html_tools'



export default function authRdcr(state = initialState, action) {

  switch (action.type) {

    case AUTH_TOKEN_DISPLAY_BLK:
      return { ...state, displayBlock: action.payload.boolVal }
    break



    case AUTH_TOKEN_GET_REQUEST:
      return { ...state, 'fetching': true, 'message': action.payload.message }
    break

    case AUTH_TOKEN_GET_SUCCESS:
      return { ...state, 'fetching': false, 'displayBlock': false, 'token': action.payload.token, 'message': action.payload.message }
    break

    case AUTH_TOKEN_GET_202:
      return { ...state, 'fetching': false, 'displayBlock': true, 'token': action.payload.token, 'message': action.payload.message }
    break




    case AUTH_USER_GET_REQUEST:
      return { ...state, 'clientUserDataApiMessage': 'Запрашиваю данные...' }
    break

    case AUTH_USER_GET_SUCCESS:
      return { ...state, 'clientUserData': action.payload.data, 'clientUserDataApiMessage': 'Данные получены '+ISODateString(new Date()) }
    break

    case AUTH_USER_GET_202:
      return { ...state, 'clientUserData': action.payload.data, 'clientUserDataApiMessage': action.payload.message }
    break

    

    default:
      return state;
  }

}