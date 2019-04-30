import {
  WSPP_DISPLAY_BLK,
} from '../constants/wsPopupConst'

import {
  WS_MSG_EVENT,
} from '../constants/wsControlConst'

const initialState = {
  displayBlock    : false,

  msgEvent        : {},
}


export default function wsPopupRdcr(state = initialState, action) {

  switch (action.type) {

    case WSPP_DISPLAY_BLK:
      return { ...state, displayBlock: action.payload.boolVal }



    case WS_MSG_EVENT:
      let displayBoolVal = false

      if (
           action.payload.data.event === 'Newchannel'
        || action.payload.data.event === 'Newstate'
        || action.payload.data.event === 'NewAccountCode'
        || action.payload.data.event === 'Dial'
        || action.payload.data.event === 'HangupRequest'
        || action.payload.data.event === 'SoftHangupRequest'
        || action.payload.data.event === 'NewCallerid'
      ) { displayBoolVal = true }

      if (
        action.payload.data.event === 'Hangup'
      ) { displayBoolVal = false }

      return { ...state, msgEvent: action.payload.data, displayBlock: displayBoolVal }



    default:
      return state;
  }

}