import {
  SWGCTL_DISPLAY_BLK,
  SWGCTL_CONNECT_REQUEST,
  SWGCTL_CONNECT_SUCCESS
} from '../constants/swgControlConst'

const initialState = {
  displayBlock: true,
  fetching:     false,
  swgClient:    {},
  StatusTxt:    'Start',
  StatusClass:  'swg-err'
}


export default function swgControlRdcr(state = initialState, action) {

  switch (action.type) {
    case SWGCTL_CONNECT_REQUEST:
      return { ...state, fetching: true, StatusTxt: 'try', StatusClass: 'swg-try' }

    case SWGCTL_CONNECT_SUCCESS:
      return { ...state, fetching: false, swgClient: action.payload.swgClient, StatusTxt: 'Ok', StatusClass: 'swg-ok' }

    case SWGCTL_DISPLAY_BLK:
      return { ...state, displayBlock: action.payload.boolVal }

    default:
      return state;
  }

}