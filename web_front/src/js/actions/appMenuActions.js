import {
  MENU_DATA_USER_SELECT
} from '../constants/appMenuConst'

import * as hdActions         from './hdActions' 



export function handleMenuSelect(event, swgClient) {
  //console.log(event.target)
  return (dispatch) => {
    dispatch({
      type: MENU_DATA_USER_SELECT,
      payload: {'storeDataKey': 'itemSelected', 'storeDataValue': event.target.innerText}
    })

    // --------------------------------------------------------
    // Стартовые запросы у компонент после выбора Меню
    // --------------------------------------------------------
    let token = window.localStorage.getItem('token')
    
    if (event.target.innerText === 'HelpDesk') {
      dispatch(hdActions.ttMyListGet(swgClient, token))
    }

  }
}