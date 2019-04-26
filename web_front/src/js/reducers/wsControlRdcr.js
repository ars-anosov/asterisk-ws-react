import {
  WSCTL_DISPLAY_BLK,

  WSCTL_CONNECT_REQUEST,
  WSCTL_CONNECT_SUCCESS,
  WSCTL_DISCONNECT_OK,
  WSCTL_DISCONNECT_ERR,

  WS_MSG_EVENT,
} from '../constants/wsControlConst'

const initialState = {
  displayBlock    : true,
  wsClient        : {},
  StatusTxt       : 'Start',
  StatusClass     : 'ws-off',

  msgEvent        : {},
}


export default function wsControlRdcr(state = initialState, action) {

  switch (action.type) {
    
    
    
    case WSCTL_CONNECT_REQUEST:
      return { ...state, StatusTxt: action.payload.message, StatusClass: 'ws-try' }

    case WSCTL_CONNECT_SUCCESS:
      return { ...state, StatusTxt: action.payload.message, StatusClass: 'ws-ok', wsClient: action.payload.wsClient }

    case WSCTL_DISCONNECT_OK:
      return { ...state, StatusTxt: action.payload.message, StatusClass: 'ws-off' }

    case WSCTL_DISCONNECT_ERR:
      return { ...state, StatusTxt: action.payload.message, StatusClass: 'ws-err' }



    case WS_MSG_EVENT:
      return { ...state, msgEvent: action.payload.event }



    case WSCTL_DISPLAY_BLK:
      return { ...state, displayBlock: action.payload.boolVal }



    default:
      return state;
  }

}