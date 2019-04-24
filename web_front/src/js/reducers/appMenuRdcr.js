import {
  MENU_DATA_USER_SELECT
} from '../constants/appMenuConst'

const initialState = {
  displayBlock:   true,

  itemList:     [],
  itemSelected: '',
}



export default function appMenuRdcr(state = initialState, action) {

  switch (action.type) {

    case MENU_DATA_USER_SELECT:
      switch (action.payload.storeDataKey) {
        case 'itemSelected':
          return { ...state, 'itemSelected': action.payload.storeDataValue }
        break

        default:
          return state
        break
      }
    break



    default:
      return state
    break
  }

}