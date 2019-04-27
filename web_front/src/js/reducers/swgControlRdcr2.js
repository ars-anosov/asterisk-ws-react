import {
  SWGCTL2_DISPLAY_BLK,
  SWGCTL2_CONNECT_REQUEST,
  SWGCTL2_CONNECT_SUCCESS
} from '../constants/swgControlConst2'

const initialState = {
  displayBlock: true,
  fetching:     false,
  swgClient:    {},
  StatusTxt:    'Start',
  StatusClass:  'swg-err'
}


export default function swgControlRdcr2(state = initialState, action) {

  switch (action.type) {
    case SWGCTL2_CONNECT_REQUEST:
      return { ...state, fetching: true, StatusTxt: 'Trying', StatusClass: 'swg-try' }

    case SWGCTL2_CONNECT_SUCCESS:
      return { ...state, fetching: false, swgClient: action.payload.swgClient, StatusTxt: 'Ok', StatusClass: 'swg-ok' }

    case SWGCTL2_DISPLAY_BLK:
      return { ...state, displayBlock: action.payload.boolVal }

    default:
      return state;
  }

}