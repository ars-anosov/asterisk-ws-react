import {
  HD_DISPLAY_BLK,

  HD_TTMY_REQUEST,
  HD_TTMY_SUCCESS,
  HD_TTMY_202,

  HD_USER_INPUT
} from '../constants/hdConst'



const initialState = {
  displayBlock:       true,
  
  ttMyList:           [],
  ttMyApiMessage:     '',
  
  selectedTtNum:      null,
}



import { ISODateString }  from '../sub_modules/html_tools'



export default function(state = initialState, action) {

  switch (action.type) {

    case HD_TTMY_REQUEST:
      return { ...state, 'ttMyApiMessage': 'Запрашиваю данные...' }
    break

    case HD_TTMY_SUCCESS:
      return { ...state, 'ttMyList': action.payload.data, 'ttMyApiMessage': 'Данные получены '+ISODateString(new Date()) }
    break

    case HD_TTMY_202:
      return { ...state, 'ttMyList': action.payload.data, 'ttMyApiMessage': action.payload.message }
    break



    case HD_DISPLAY_BLK:
      return { ...state, 'displayBlock': action.payload.boolVal }
    break



    default:
      return state
    break
  }

}